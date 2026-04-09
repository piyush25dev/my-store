// app/api/admin/orders/route.js
// GET — fetch all platform orders with buyer, creator, product info (admin only)

import { createClient } from '@supabase/supabase-js';

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

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    // Fetch all orders with their items + product + creator info
    const { data: orders, error: ordersError } = await adminClient
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_method,
        total_amount,
        subtotal,
        tax_amount,
        shipping_amount,
        currency,
        shipping_address,
        user_id,
        created_at,
        order_items (
          id,
          product_name,
          unit_price,
          quantity,
          line_total,
          products (
            id,
            name,
            creator_id
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('[admin/orders] Query error:', ordersError);
      throw ordersError;
    }

    // Collect all user_ids (buyers) and creator_ids to batch-fetch profiles
    const buyerIds    = [...new Set((orders || []).map(o => o.user_id).filter(Boolean))];
    const creatorIds  = [...new Set(
      (orders || []).flatMap(o =>
        (o.order_items || []).map(i => i.products?.creator_id).filter(Boolean)
      )
    )];
    const allIds = [...new Set([...buyerIds, ...creatorIds])];

    // Batch fetch profiles for buyers + creators
    let profileMap = {};
    if (allIds.length > 0) {
      const { data: profiles } = await adminClient
        .from('profiles')
        .select('id, display_name, business_name')
        .in('id', allIds);

      for (const p of profiles || []) profileMap[p.id] = p;
    }

    // Pull emails from auth for buyers
    let emailMap = {};
    try {
      const { data: { users: authUsers } } = await adminClient.auth.admin.listUsers();
      for (const u of authUsers || []) emailMap[u.id] = u.email;
    } catch (e) {
      console.warn('[admin/orders] Could not fetch auth emails:', e.message);
    }

    // Normalise status to UI labels
    function normaliseStatus(status, paymentStatus) {
      const s = (status ?? '').toLowerCase();
      if (s === 'refunded')  return 'Refunded';
      if (s === 'completed') return 'Settled';
      return 'Pending';
    }

    // Platform fee: 5% of subtotal (adjust to your actual rate)
    const PLATFORM_FEE_RATE = 0.05;

    const enriched = (orders || []).map(order => {
      const firstItem    = order.order_items?.[0];
      const productName  = firstItem?.products?.name ?? firstItem?.product_name ?? '—';
      const creatorId    = firstItem?.products?.creator_id;
      const creatorProfile = profileMap[creatorId];
      const buyerProfile   = profileMap[order.user_id];

      const totalAmount = Number(order.total_amount ?? 0);
      const subtotal    = Number(order.subtotal ?? totalAmount);
      const fee         = Math.round(subtotal * PLATFORM_FEE_RATE);
      const uiStatus    = normaliseStatus(order.status, order.payment_status);

      // Derive payment method label
      const method = (() => {
        const m = (order.payment_method ?? '').toLowerCase();
        if (m.includes('upi'))  return 'UPI';
        if (m.includes('card')) return 'Card';
        if (m.includes('net') || m.includes('bank')) return 'NetBanking';
        return order.payment_method || 'Card';
      })();

      return {
        id:          order.order_number ?? `#${String(order.id).slice(0, 6).toUpperCase()}`,
        rawId:       order.id,
        buyer:       buyerProfile?.display_name
                       || order.shipping_address?.name
                       || emailMap[order.user_id]
                       || '—',
        buyerEmail:  emailMap[order.user_id] || '—',
        creator:     creatorProfile?.business_name
                       || creatorProfile?.display_name
                       || '—',
        product:     productName,
        itemCount:   order.order_items?.length ?? 0,
        amount:      totalAmount,   // paise
        fee,                        // paise
        method,
        status:      uiStatus,
        date:        new Date(order.created_at).toLocaleDateString('en-IN', {
                       day: '2-digit', month: 'short', year: 'numeric',
                     }),
        createdAt:   order.created_at,
      };
    });

    return Response.json({ success: true, orders: enriched });

  } catch (error) {
    console.error('[admin/orders] GET error:', error);
    return Response.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}