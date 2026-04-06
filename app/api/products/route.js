// app/api/products/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ─── Supabase helpers ─────────────────────────────────────────────────────────

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function getAuthenticatedClient(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing or invalid authorization header'), { status: 401 });
  }
  const supabase = getAuthenticatedClient(authHeader.slice(7));
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  return { supabase, user };
}

// ─── Upload a single base64 image to Supabase Storage ────────────────────────

async function uploadImageToStorage(supabase, productId, image, index) {
  const ext    = image.mimeType.split('/')[1] || 'jpg';
  const path   = `products/${productId}/${Date.now()}-${index}.${ext}`;
  const buffer = Buffer.from(image.base64, 'base64');

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType: image.mimeType, upsert: false });

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return publicUrl;
}

// ─── Build type-specific product fields ──────────────────────────────────────

function buildProductData(body, userId) {
  const {
    name, slug, description, short_description, type, price,
    currency = 'INR', featured = false, status = 'draft',
    stock_quantity, delivery_days, weight_grams, dimensions,
    digital_delivery_url, digital_license_type, lifetime_updates,
    metadata, original_price,
  } = body;

  const data = {
    name, slug, description, short_description, type,
    price:          Math.round(price),
    original_price: original_price ? Math.round(original_price) : null,
    currency, featured, status,
    ...(userId && { creator_id: userId }),
  };

  if (type === 'physical') {
    data.stock_quantity       = stock_quantity ? parseInt(stock_quantity) : 0;
    data.delivery_days        = delivery_days  ? parseInt(delivery_days)  : null;
    data.weight_grams         = weight_grams   ? parseInt(weight_grams)   : null;
    data.dimensions           = dimensions || {};
    data.digital_delivery_url = null;
    data.digital_license_type = null;
    data.lifetime_updates     = false;
  } else if (type === 'digital') {
    data.digital_delivery_url = digital_delivery_url || null;
    data.digital_license_type = digital_license_type || 'personal';
    data.lifetime_updates     = lifetime_updates === true || lifetime_updates === 'true';
    data.stock_quantity       = null;
    data.delivery_days        = null;
    data.weight_grams         = null;
    data.dimensions           = {};
  } else if (type === 'service') {
    data.delivery_days        = delivery_days ? parseInt(delivery_days) : null;
    data.stock_quantity       = null;
    data.digital_delivery_url = null;
    data.digital_license_type = null;
    data.lifetime_updates     = false;
    data.weight_grams         = null;
    data.dimensions           = {};
  }

  if (metadata) data.metadata = metadata;
  return data;
}

// ─── Save images (upload + insert rows) ──────────────────────────────────────

async function saveImages(supabase, productId, images, productName) {
  if (!Array.isArray(images) || images.length === 0) return [];

  const hasPrimary = images.some((img) => img.is_primary);
  if (!hasPrimary) images[0].is_primary = true;

  const imageRows = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    // Skip already-saved images (have image_url but no base64)
    if (img.image_url && !img.base64) {
      imageRows.push({
        product_id: productId,
        image_url:  img.image_url,
        alt_text:   img.alt_text || productName,
        is_primary: img.is_primary ?? false,
      });
      continue;
    }
    try {
      const publicUrl = await uploadImageToStorage(supabase, productId, img, i);
      imageRows.push({
        product_id: productId,
        image_url:  publicUrl,
        alt_text:   img.alt_text || productName,
        is_primary: img.is_primary ?? false,
      });
    } catch (err) {
      console.error(`Image ${i} upload failed:`, err.message);
    }
  }

  if (!imageRows.length) return [];

  const { data, error } = await supabase
    .from('product_images')
    .insert(imageRows)
    .select('*');

  if (error) throw new Error('Failed to save images: ' + error.message);
  return data;
}

// =============================================================================
// GET /api/products
//   Public → published products
//   ?creator_only=true → authenticated, creator's own products (any status)
// =============================================================================

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page        = parseInt(searchParams.get('page') || '1');
    const limit       = parseInt(searchParams.get('limit') || '120');
    const offset      = (page - 1) * limit;
    const creatorOnly = searchParams.get('creator_only') === 'true';
    const search      = searchParams.get('search');

    // ?featured=true  → only featured products
    // ?featured=false → only non-featured products
    // (omitted)       → no filter on featured
    const featuredParam = searchParams.get('featured');
    const featuredFilter = featuredParam === 'true'
      ? true
      : featuredParam === 'false'
        ? false
        : null;

    let supabase, userId = null;

    if (creatorOnly) {
      let auth;
      try { auth = await requireAuth(request); }
      catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
      supabase = auth.supabase;
      userId   = auth.user.id;
    } else {
      supabase = getPublicClient();
    }

    let query = supabase
      .from('products')
      .select(`*, product_images!left(id, image_url, alt_text, is_primary)`, { count: 'exact' });

    if (creatorOnly && userId) {
      query = query.eq('creator_id', userId);
    } else {
      query = query.eq('status', 'published');
    }

    // Apply featured filter only when explicitly requested
    if (featuredFilter !== null) {
      query = query.eq('featured', featuredFilter);
    }

    if (search) query = query.textSearch('search_vector', search);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      products: data || [],
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// POST /api/products — create product + images in one request
// =============================================================================

export async function POST(request) {
  try {
    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { images = [] } = body;

    // Validate
    const missing = ['name', 'slug', 'description', 'short_description', 'type', 'price']
      .filter((f) => !body[f] && body[f] !== 0);
    if (missing.length > 0) {
      return NextResponse.json({ error: 'Missing required fields', missing }, { status: 400 });
    }

    const VALID_TYPES = ['physical', 'digital', 'service'];
    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}` }, { status: 400 });
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('products').select('id')
      .eq('creator_id', user.id).eq('slug', body.slug).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
    }

    // Insert product
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert(buildProductData(body, user.id))
      .select('*').single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create product', details: createError.message, code: createError.code },
        { status: 400 }
      );
    }

    // Upload + save images
    let savedImages = [];
    try {
      savedImages = await saveImages(supabase, product.id, images, body.name);
    } catch (imgErr) {
      return NextResponse.json({
        success: true,
        warning: imgErr.message,
        product: { ...product, product_images: [] },
      }, { status: 201 });
    }

    console.log('✅ Product created:', product.id);
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        // price stays in paise — frontend divides by 100 only at display time
        product_images: savedImages,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// PATCH /api/products?id={id}  — update product fields and/or status and/or images
//
// Supports partial updates. Send only the fields you want to change.
// To change status only: { status: 'published' }
// To edit product:       { name, price, ... }
// New images (base64):   { images: [{ base64, mimeType, is_primary }] }
// Keep existing images:  { images: [{ image_url, is_primary }] }   (no base64)
// =============================================================================

export async function PATCH(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ?id query param' }, { status: 400 });
    }

    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('products').select('*').eq('id', id).eq('creator_id', user.id).single();
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { images, keepExistingImages = true, ...fields } = body;

    // Build update payload — only include fields that were sent
    const updateData = {};
    const allowedFields = [
      'name', 'slug', 'description', 'short_description', 'type', 'price',
      'original_price', 'currency', 'featured', 'status',
      'stock_quantity', 'delivery_days', 'weight_grams', 'dimensions',
      'digital_delivery_url', 'digital_license_type', 'lifetime_updates', 'metadata',
    ];

    for (const key of allowedFields) {
      if (key in fields) {
        if (key === 'price' || key === 'original_price') {
          updateData[key] = fields[key] != null ? Math.round(fields[key]) : null;
        } else {
          updateData[key] = fields[key];
        }
      }
    }

    // If type is changing, rebuild type-specific fields
    if (fields.type && fields.type !== existing.type) {
      const rebuilt = buildProductData({ ...existing, ...fields }, null);
      const typeFields = ['stock_quantity','delivery_days','weight_grams','dimensions',
                         'digital_delivery_url','digital_license_type','lifetime_updates'];
      for (const f of typeFields) updateData[f] = rebuilt[f];
    }

    // Set published_at when publishing for the first time
    if (fields.status === 'published' && existing.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    // Check slug uniqueness if slug is changing
    if (fields.slug && fields.slug !== existing.slug) {
      const { data: slugConflict } = await supabase
        .from('products').select('id')
        .eq('creator_id', user.id).eq('slug', fields.slug).maybeSingle();
      if (slugConflict) {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
      }
    }

    // Update product
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*').single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update product', details: updateError.message },
        { status: 400 }
      );
    }

    // Handle images if provided
    let savedImages = existing.product_images || [];

    if (Array.isArray(images)) {
      // Separate new (base64) from existing (image_url only)
      const newImages     = images.filter((img) => img.base64);
      const existingImgs  = images.filter((img) => img.image_url && !img.base64);

      if (!keepExistingImages || images.length === 0) {
        // Delete all existing image records (user cleared them)
        await supabase.from('product_images').delete().eq('product_id', id);
        savedImages = [];
      } else {
        // Delete image records that weren't included in the payload
        const keptUrls = existingImgs.map((i) => i.image_url);
        if (keptUrls.length > 0) {
          await supabase.from('product_images').delete()
            .eq('product_id', id).not('image_url', 'in', `(${keptUrls.map(u => `"${u}"`).join(',')})`);
        }
      }

      // Update is_primary on kept images
      for (const img of existingImgs) {
        await supabase.from('product_images')
          .update({ is_primary: img.is_primary ?? false })
          .eq('product_id', id).eq('image_url', img.image_url);
      }

      // Upload and insert new images
      if (newImages.length > 0) {
        const uploaded = await saveImages(supabase, id, newImages, product.name);
        savedImages = [...existingImgs, ...uploaded];
      } else {
        savedImages = existingImgs;
      }
    } else {
      // No images in payload — just fetch current ones
      const { data: imgs } = await supabase
        .from('product_images').select('*').eq('product_id', id)
        .order('is_primary', { ascending: false });
      savedImages = imgs || [];
    }

    console.log('✅ Product updated:', product.id);
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        // price stays in paise — frontend divides by 100 only at display time
        product_images: savedImages,
      },
    });
  } catch (error) {
    console.error('PATCH /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// DELETE /api/products?id={id} — hard delete product + its images
// =============================================================================

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ?id query param' }, { status: 400 });
    }

    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    // Verify ownership
    const { data: existing } = await supabase
      .from('products')
      .select('id, creator_id')
      .eq('id', id)
      .eq('creator_id', user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    // Delete associated image records first (FK constraint)
    await supabase.from('product_images').delete().eq('product_id', id);

    // Hard delete the product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('creator_id', user.id); // double-check ownership at DB level

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete product', details: deleteError.message },
        { status: 400 }
      );
    }

    console.log('✅ Product hard-deleted:', id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('DELETE /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// PATCH /api/products?id={id}&resource={faqs|highlights|details|variants}
//
// Saves the full list for a sub-resource (replace-all strategy):
//   DELETE existing rows → INSERT new rows in one transaction.
//
// Body for each resource:
//
//  faqs:       { items: [{ question, answer, display_order }] }
//  highlights: { items: [{ title, description, icon, display_order }] }
//  details:    { items: [{ label, value, display_order }] }
//  variants:   { items: [{ name, sku, price_modifier, stock_quantity,
//                          attributes, display_order, is_active }] }
//
// All existing rows for that product+resource are replaced on every save.
// =============================================================================

export async function PUT(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id       = searchParams.get('id');
    const resource = searchParams.get('resource'); // faqs | highlights | details | variants

    if (!id) return NextResponse.json({ error: 'Missing ?id param' }, { status: 400 });

    const VALID_RESOURCES = ['faqs', 'highlights', 'details', 'variants'];
    if (!VALID_RESOURCES.includes(resource)) {
      return NextResponse.json(
        { error: `Invalid ?resource. Must be one of: ${VALID_RESOURCES.join(', ')}` },
        { status: 400 }
      );
    }

    // Auth
    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    // Verify product ownership
    const { data: product } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', id)
      .eq('creator_id', user.id)
      .maybeSingle();

    if (!product) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    // Parse body
    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { items = [] } = body;

    // Map resource name → table name
    const TABLE = {
      faqs:       'product_faqs',
      highlights: 'product_highlights',
      details:    'product_details',
      variants:   'product_variants',
    }[resource];

    // Replace-all: delete existing rows then insert fresh ones
    const { error: deleteError } = await supabase
      .from(TABLE)
      .delete()
      .eq('product_id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to clear existing ${resource}`, details: deleteError.message },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      // Nothing to insert — cleared successfully
      return NextResponse.json({ success: true, [resource]: [] });
    }

    // Build rows with product_id + display_order fallback
    const rows = items.map((item, idx) => ({
      ...sanitizeItem(resource, item),
      product_id:    id,
      display_order: item.display_order ?? idx,
    }));

    const { data: saved, error: insertError } = await supabase
      .from(TABLE)
      .insert(rows)
      .select('*');

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to save ${resource}`, details: insertError.message },
        { status: 400 }
      );
    }

    console.log(`✅ ${saved.length} ${resource} saved for product ${id}`);
    return NextResponse.json({ success: true, [resource]: saved });
  } catch (error) {
    console.error('PUT /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Strip unknown keys per resource — column names match actual DB schema
function sanitizeItem(resource, item) {
  switch (resource) {
    case 'faqs':
      return {
        question: item.question || '',
        answer:   item.answer   || '',
      };
    case 'highlights':
      // DB columns: highlight_text, icon_name
      return {
        highlight_text: item.highlight_text || item.title || '',
        icon_name:      item.icon_name      || item.icon  || null,
      };
    case 'details':
      // DB columns: detail_key, detail_value, detail_category
      return {
        detail_key:      item.detail_key      || item.label    || '',
        detail_value:    item.detail_value    || item.value    || '',
        detail_category: item.detail_category || item.category || null,
      };
    case 'variants':
      // DB columns: label, variant_type (enum — null if not set), sku,
      //             price_modifier, stock_quantity, metadata
      // is_available is auto-computed from stock_quantity — never insert it
      return {
        label:          item.label || item.name || '',
        // Send null if empty — avoids invalid enum value error
        variant_type:   item.variant_type && item.variant_type.trim() !== '' ? item.variant_type.trim() : null,
        sku:            item.sku && item.sku.trim() !== '' ? item.sku.trim() : null,
        price_modifier: item.price_modifier != null && item.price_modifier !== '' ? Math.round(parseFloat(item.price_modifier) * 100) : 0,
        stock_quantity: item.stock_quantity != null && item.stock_quantity !== '' ? parseInt(item.stock_quantity) : 0,
        metadata:       item.metadata || {},
      };
    default:
      return item;
  }
}