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
    currency = 'INR', featured = false,
    // ↓ Default to 'pending' so all new products require admin approval
    status = 'pending',
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
// =============================================================================

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page        = parseInt(searchParams.get('page') || '1');
    const limit       = parseInt(searchParams.get('limit') || '120');
    const offset      = (page - 1) * limit;
    const creatorOnly = searchParams.get('creator_only') === 'true';
    const search      = searchParams.get('search');

    const featuredParam  = searchParams.get('featured');
    const featuredFilter = featuredParam === 'true'
      ? true
      : featuredParam === 'false' ? false : null;

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

    if (featuredFilter !== null) query = query.eq('featured', featuredFilter);
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
// POST /api/products — create product (status defaults to 'pending')
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

    const missing = ['name', 'slug', 'description', 'short_description', 'type', 'price']
      .filter((f) => !body[f] && body[f] !== 0);
    if (missing.length > 0) {
      return NextResponse.json({ error: 'Missing required fields', missing }, { status: 400 });
    }

    const VALID_TYPES = ['physical', 'digital', 'service'];
    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: `Invalid type. Must be: ${VALID_TYPES.join(', ')}` }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('products').select('id')
      .eq('creator_id', user.id).eq('slug', body.slug).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
    }

    // Force status to 'pending' regardless of what the client sends
    const productData = { ...buildProductData(body, user.id), status: 'pending' };

    const { data: product, error: createError } = await supabase
      .from('products')
      .insert(productData)
      .select('*').single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create product', details: createError.message, code: createError.code },
        { status: 400 }
      );
    }

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

    console.log('✅ Product created (pending review):', product.id);
    return NextResponse.json({
      success: true,
      product: { ...product, product_images: savedImages },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// PATCH /api/products?id={id}
// =============================================================================

// Statuses that only admin can assign.
// Creators CANNOT set these, nor change status away from them.
const ADMIN_CONTROLLED_STATUSES = ['pending', 'published', 'rejected'];

// Statuses a creator is allowed to transition TO (from draft only)
const CREATOR_ALLOWED_STATUSES = ['draft', 'pending'];

export async function PATCH(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ?id query param' }, { status: 400 });

    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    const { data: existing, error: fetchError } = await supabase
      .from('products').select('*').eq('id', id).eq('creator_id', user.id).single();
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { images, keepExistingImages = true, ...fields } = body;

    // ── Status change guard ───────────────────────────────────────────────────
    if ('status' in fields) {
      // Block: creator cannot change status if the current status is admin-controlled
      if (ADMIN_CONTROLLED_STATUSES.includes(existing.status)) {
        return NextResponse.json(
          { error: 'This product\'s status is managed by admin and cannot be changed.' },
          { status: 403 }
        );
      }
      // Block: creator cannot set a status that is admin-only
      if (!CREATOR_ALLOWED_STATUSES.includes(fields.status)) {
        return NextResponse.json(
          { error: `Creators can only set status to: ${CREATOR_ALLOWED_STATUSES.join(', ')}.` },
          { status: 403 }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

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

    if (fields.type && fields.type !== existing.type) {
      const rebuilt = buildProductData({ ...existing, ...fields }, null);
      const typeFields = [
        'stock_quantity','delivery_days','weight_grams','dimensions',
        'digital_delivery_url','digital_license_type','lifetime_updates',
      ];
      for (const f of typeFields) updateData[f] = rebuilt[f];
    }

    if (fields.status === 'published' && existing.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    if (fields.slug && fields.slug !== existing.slug) {
      const { data: slugConflict } = await supabase
        .from('products').select('id')
        .eq('creator_id', user.id).eq('slug', fields.slug).maybeSingle();
      if (slugConflict) {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
      }
    }

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

    let savedImages = existing.product_images || [];

    if (Array.isArray(images)) {
      const newImages    = images.filter((img) => img.base64);
      const existingImgs = images.filter((img) => img.image_url && !img.base64);

      if (!keepExistingImages || images.length === 0) {
        await supabase.from('product_images').delete().eq('product_id', id);
        savedImages = [];
      } else {
        const keptUrls = existingImgs.map((i) => i.image_url);
        if (keptUrls.length > 0) {
          await supabase.from('product_images').delete()
            .eq('product_id', id)
            .not('image_url', 'in', `(${keptUrls.map(u => `"${u}"`).join(',')})`);
        }
      }

      for (const img of existingImgs) {
        await supabase.from('product_images')
          .update({ is_primary: img.is_primary ?? false })
          .eq('product_id', id).eq('image_url', img.image_url);
      }

      if (newImages.length > 0) {
        const uploaded = await saveImages(supabase, id, newImages, product.name);
        savedImages = [...existingImgs, ...uploaded];
      } else {
        savedImages = existingImgs;
      }
    } else {
      const { data: imgs } = await supabase
        .from('product_images').select('*').eq('product_id', id)
        .order('is_primary', { ascending: false });
      savedImages = imgs || [];
    }

    console.log('✅ Product updated:', product.id);
    return NextResponse.json({
      success: true,
      product: { ...product, product_images: savedImages },
    });
  } catch (error) {
    console.error('PATCH /api/products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// =============================================================================
// DELETE /api/products?id={id}
// =============================================================================

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ?id query param' }, { status: 400 });

    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    const { data: existing } = await supabase
      .from('products')
      .select('id, creator_id')
      .eq('id', id)
      .eq('creator_id', user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    await supabase.from('product_images').delete().eq('product_id', id);

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('creator_id', user.id);

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
// PUT /api/products?id={id}&resource={faqs|highlights|details|variants}
// =============================================================================

export async function PUT(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id       = searchParams.get('id');
    const resource = searchParams.get('resource');

    if (!id) return NextResponse.json({ error: 'Missing ?id param' }, { status: 400 });

    const VALID_RESOURCES = ['faqs', 'highlights', 'details', 'variants'];
    if (!VALID_RESOURCES.includes(resource)) {
      return NextResponse.json(
        { error: `Invalid ?resource. Must be one of: ${VALID_RESOURCES.join(', ')}` },
        { status: 400 }
      );
    }

    let auth;
    try { auth = await requireAuth(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }
    const { supabase, user } = auth;

    const { data: product } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', id)
      .eq('creator_id', user.id)
      .maybeSingle();

    if (!product) {
      return NextResponse.json({ error: 'Product not found or access denied' }, { status: 404 });
    }

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { items = [] } = body;

    const TABLE = {
      faqs:       'product_faqs',
      highlights: 'product_highlights',
      details:    'product_details',
      variants:   'product_variants',
    }[resource];

    const { error: deleteError } = await supabase.from(TABLE).delete().eq('product_id', id);
    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to clear existing ${resource}`, details: deleteError.message },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json({ success: true, [resource]: [] });
    }

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

function sanitizeItem(resource, item) {
  switch (resource) {
    case 'faqs':
      return { question: item.question || '', answer: item.answer || '' };
    case 'highlights':
      return {
        highlight_text: item.highlight_text || item.title || '',
        icon_name:      item.icon_name      || item.icon  || null,
      };
    case 'details':
      return {
        detail_key:      item.detail_key      || item.label    || '',
        detail_value:    item.detail_value    || item.value    || '',
        detail_category: item.detail_category || item.category || null,
      };
    case 'variants':
      return {
        label:          item.label || item.name || '',
        variant_type:   item.variant_type && item.variant_type.trim() !== '' ? item.variant_type.trim() : null,
        sku:            item.sku && item.sku.trim() !== '' ? item.sku.trim() : null,
        price_modifier: item.price_modifier != null && item.price_modifier !== ''
          ? Math.round(parseFloat(item.price_modifier) * 100) : 0,
        stock_quantity: item.stock_quantity != null && item.stock_quantity !== ''
          ? parseInt(item.stock_quantity) : 0,
        metadata:       item.metadata || {},
      };
    default:
      return item;
  }
}