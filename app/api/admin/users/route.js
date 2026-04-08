// app/api/admin/users/route.js
// GET    — fetch all non-creator, non-admin profiles
// PATCH  ?id=<profileId> — update status (Active | Suspended)
// DELETE ?id=<profileId> — delete user profile + auth account

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

// ─── GET — list all users (customers) ────────────────────────────────────────

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    const { data: users, error: usersError } = await adminClient
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        bio,
        country,
        phone_number,
        user_role,
        preferences,
        is_verified,
        created_at,
        updated_at
      `)
      .eq('user_role', 'customer')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('[admin/users] Query error:', usersError);
      throw usersError;
    }

    // Get order counts + spend per user
    const userIds = (users || []).map(u => u.id);
    let orderStats = {};

    if (userIds.length > 0) {
      const { data: orders } = await adminClient
        .from('orders')
        .select('user_id, total_amount, status')
        .in('user_id', userIds);

      for (const order of orders || []) {
        if (!orderStats[order.user_id]) {
          orderStats[order.user_id] = { orders: 0, spend: 0 };
        }
        orderStats[order.user_id].orders += 1;
        if ((order.status ?? '').toLowerCase() !== 'refunded') {
          orderStats[order.user_id].spend += Number(order.total_amount ?? 0);
        }
      }
    }

    // Pull emails from auth.users
    let emailMap = {};
    try {
      const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
      for (const u of authUsers || []) emailMap[u.id] = u.email;
    } catch (e) {
      console.warn('[admin/users] Could not fetch auth emails:', e.message);
    }

    const enriched = (users || []).map(u => ({
      id:         u.id,
      name:       u.display_name || 'Anonymous',
      avatar:     u.display_name
                    ? u.display_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                    : '?',
      avatar_url: u.avatar_url || null,
      email:      emailMap[u.id] || '—',
      country:    u.country || '—',
      phone:      u.phone_number || '—',
      role:       u.user_role,
      joined:     new Date(u.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  }),
      orders:     orderStats[u.id]?.orders || 0,
      spend:      orderStats[u.id]?.spend  || 0,
      // Suspended tracked via preferences.suspended since enum has no suspended_customer
      status:     u.preferences?.suspended ? 'Suspended' : 'Active',
    }));

    return Response.json({ success: true, users: enriched });

  } catch (error) {
    console.error('[admin/users] GET error:', error);
    return Response.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

// ─── PATCH ?id=<profileId> — toggle Active / Suspended ───────────────────────

export async function PATCH(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing user id' }, { status: 400 });

    const { status } = await request.json();
    if (!['Active', 'Suspended'].includes(status)) {
      return Response.json({ error: 'Invalid status. Must be Active or Suspended' }, { status: 400 });
    }

    // Suspension tracked via preferences.suspended — user_role stays 'customer' (enum constraint)
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({
        preferences: { suspended: status === 'Suspended' },
        updated_at:  new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    return Response.json({ success: true, status });

  } catch (error) {
    console.error('[admin/users] PATCH error:', error);
    return Response.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

// ─── DELETE ?id=<profileId> ───────────────────────────────────────────────────

export async function DELETE(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing user id' }, { status: 400 });

    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    // Also remove auth login access
    try {
      await adminClient.auth.admin.deleteUser(id);
    } catch (e) {
      console.warn(`[admin/users] Could not delete auth user ${id}:`, e.message);
    }

    return Response.json({ success: true, deleted: id });

  } catch (error) {
    console.error('[admin/users] DELETE error:', error);
    return Response.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}