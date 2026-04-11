// app/api/admin/moderation/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service role client — bypasses RLS, admin only
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // never expose this to the client
  );
}

// Verify the requester is an admin
async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing authorization header'), { status: 401 });
  }

  const token = authHeader.slice(7);

  // Use anon client just to verify the user identity
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await anonClient.auth.getUser();
  if (error || !user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }

  // Check admin role — adjust this to match how you store admin status
  // Option A: via profiles table
  const serviceClient = getServiceClient();
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single();

  if (profile?.user_role !== 'admin') {
    throw Object.assign(new Error('Forbidden: admin access required'), { status: 403 });
  }

  return { serviceClient, user };
}

// GET /api/admin/moderation?status=pending
export async function GET(request) {
  try {
    let auth;
    try { auth = await requireAdmin(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }

    const { serviceClient } = auth;
    const status = request.nextUrl.searchParams.get('status') || 'all';

    let query = serviceClient
      .from('products')
      .select(`
        id, name, description, short_description, price, original_price,
        type, status, featured, created_at, updated_at, creator_id, slug,
        product_images(image_url, alt_text, is_primary),
        profiles(display_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error('GET /api/admin/moderation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/moderation?id={productId}
// Body: { status: 'published' | 'rejected' }
export async function PATCH(request) {
  try {
    let auth;
    try { auth = await requireAdmin(request); }
    catch (err) { return NextResponse.json({ error: err.message }, { status: err.status || 401 }); }

    const { serviceClient } = auth;
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ?id param' }, { status: 400 });

    let body;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }

    const { status } = body;
    const ADMIN_ALLOWED = ['published', 'rejected', 'pending', 'draft'];
    if (!ADMIN_ALLOWED.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${ADMIN_ALLOWED.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData = { status };
    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data: product, error } = await serviceClient
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    console.log(`✅ Admin set product ${id} → ${status}`);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('PATCH /api/admin/moderation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}