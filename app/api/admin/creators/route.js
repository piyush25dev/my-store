// app/api/admin/creators/route.js
// GET  — fetch all creator profiles (admin only)
// PATCH ?id=<profileId> — update status (Active / Pending / Suspended)
// DELETE ?id=<profileId> — soft-delete / hard-delete creator

import { createClient } from '@supabase/supabase-js';

// ─── Shared auth helper ───────────────────────────────────────────────────────

async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 };
  }

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return { error: 'Unauthorized', status: 401 };

  const { data: profile, error: roleError } = await userClient
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single();

  if (roleError || profile?.user_role !== 'admin') {
    return { error: 'Forbidden: admin access required', status: 403 };
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return { adminClient };
}

// ─── GET — list all creators ──────────────────────────────────────────────────

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    // 1. Fetch all creator profiles
    const { data: creators, error: creatorsError } = await adminClient
      .from('profiles')
      .select(`
        id,
        display_name,
        bio,
        avatar_url,
        business_name,
        business_slug,
        country,
        phone_number,
        user_role,
        social_links,
        preferences,
        is_verified,
        verification_date,
        created_at,
        updated_at
      `)
      .eq('user_role', 'creator')
      .order('created_at', { ascending: false });

    if (creatorsError) {
      console.error('[admin/creators] Query error:', creatorsError);
      throw creatorsError;
    }

    const creatorIds = (creators || []).map(c => c.id);
    let productCounts = {};
    let orderStats    = {};

    if (creatorIds.length > 0) {
      // 2. Product count per creator
      const { data: products } = await adminClient
        .from('products')
        .select('creator_id')
        .in('creator_id', creatorIds);

      for (const p of products || []) {
        productCounts[p.creator_id] = (productCounts[p.creator_id] || 0) + 1;
      }

      // 3. Revenue + order count per creator via order_items → products join
      const { data: items } = await adminClient
        .from('order_items')
        .select(`
          line_total,
          products!inner ( creator_id ),
          orders!inner ( id, status )
        `)
        .in('products.creator_id', creatorIds);

      for (const item of items || []) {
        const cid = item.products?.creator_id;
        if (!cid) continue;
        if (!orderStats[cid]) orderStats[cid] = { revenue: 0, orderIds: new Set() };
        if ((item.orders?.status ?? '').toLowerCase() !== 'refunded') {
          orderStats[cid].revenue += Number(item.line_total ?? 0);
        }
        if (item.orders?.id) orderStats[cid].orderIds.add(item.orders.id);
      }
    }

    // 4. Pull emails from auth.users
    let emailMap = {};
    try {
      const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
      for (const u of authUsers || []) emailMap[u.id] = u.email;
    } catch (e) {
      console.warn('[admin/creators] Could not fetch auth emails:', e.message);
    }

    // 5. Enrich and return
    const enriched = (creators || []).map(c => ({
      id:           c.id,
      name:         c.display_name || 'Unnamed Creator',
      avatar:       c.display_name
                      ? c.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                      : '??',
      avatar_url:   c.avatar_url || null,
      handle:       c.business_slug ? `@${c.business_slug}` : `@${c.id.slice(0, 8)}`,
      email:        emailMap[c.id] || '—',
      country:      c.country || '—',
      bio:          c.bio || '',
      business:     c.business_name || '—',
      social_links: c.social_links || {},
      is_verified:  c.is_verified,
      joined:       new Date(c.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    }),
      products:     productCounts[c.id] || 0,
      revenue:      orderStats[c.id]?.revenue    || 0,  // in paise
      orders:       orderStats[c.id]?.orderIds?.size || 0,
      payoutPending: 0,
      // Active = verified, Suspended = preferences.suspended true, Pending = not verified + not suspended
      status: c.is_verified
                ? 'Active'
                : c.preferences?.suspended
                  ? 'Suspended'
                  : 'Pending',
    }));

    return Response.json({ success: true, creators: enriched });

  } catch (error) {
    console.error('[admin/creators] GET error:', error);
    return Response.json({ error: error.message || 'Failed to fetch creators' }, { status: 500 });
  }
}

// ─── PATCH ?id=<profileId> — change status ────────────────────────────────────
// Body: { status: "Active" | "Pending" | "Suspended" }
//
// Status maps to profile fields:
//   Active    → is_verified: true,  user_role: 'creator'
//   Pending   → is_verified: false, user_role: 'creator'
//   Suspended → is_verified: false, user_role: 'suspended_creator'

export async function PATCH(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing creator id' }, { status: 400 });

    const body = await request.json();
    const { status } = body;

    if (!['Active', 'Pending', 'Suspended'].includes(status)) {
      return Response.json({ error: 'Invalid status. Must be Active, Pending, or Suspended' }, { status: 400 });
    }

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (status === 'Active') {
      updates.is_verified       = true;
      updates.user_role         = 'creator';
      updates.verification_date = new Date().toISOString();
      updates.preferences       = { suspended: false };
    } else if (status === 'Pending') {
      updates.is_verified       = false;
      updates.user_role         = 'creator';
      updates.verification_date = null;
      updates.preferences       = { suspended: false };
    } else if (status === 'Suspended') {
      // user_role stays 'creator' — enum has no suspended_creator value
      // We track suspension via preferences.suspended = true
      updates.is_verified       = false;
      updates.user_role         = 'creator';
      updates.verification_date = null;
      updates.preferences       = { suspended: true };
    }

    const { data: updated, error: updateError } = await adminClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, is_verified, user_role')
      .single();

    if (updateError) {
      console.error('[admin/creators] PATCH error:', updateError);
      throw updateError;
    }

    console.log(`[admin/creators] Status updated → ${status} for creator ${id}`);
    return Response.json({ success: true, status, profile: updated });

  } catch (error) {
    console.error('[admin/creators] PATCH error:', error);
    return Response.json({ error: error.message || 'Failed to update status' }, { status: 500 });
  }
}

// ─── DELETE ?id=<profileId> — remove creator ─────────────────────────────────
// Deletes the profile row. Auth user deletion is optional (commented out below)
// so you can keep order history intact. Uncomment to also remove login access.

export async function DELETE(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing creator id' }, { status: 400 });

    // Delete profile row
    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      console.error('[admin/creators] DELETE profile error:', profileError);
      throw profileError;
    }

    // Optionally also delete the auth user so they can no longer log in.
    // Comment this out if you want to preserve login access / keep order history linked.
    try {
      await adminClient.auth.admin.deleteUser(id);
      console.log(`[admin/creators] Auth user deleted: ${id}`);
    } catch (authDeleteErr) {
      // Non-fatal — profile is already deleted
      console.warn(`[admin/creators] Could not delete auth user ${id}:`, authDeleteErr.message);
    }

    console.log(`[admin/creators] Creator deleted: ${id}`);
    return Response.json({ success: true, deleted: id });

  } catch (error) {
    console.error('[admin/creators] DELETE error:', error);
    return Response.json({ error: error.message || 'Failed to delete creator' }, { status: 500 });
  }
}