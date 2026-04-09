// app/api/admin/stats/route.js
// GET — aggregated platform stats for admin overview + analytics pages

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

  const { data: profile } = await userClient
    .from('profiles').select('user_role').eq('id', user.id).single();
  if (profile?.user_role !== 'admin') {
    return { error: 'Forbidden: admin access required', status: 403 };
  }
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return { adminClient };
}

// Build last-N-months bucket keys
function buildMonthBuckets(n = 6) {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return {
      month: d.toLocaleString('en-IN', { month: 'short' }),
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      gmv: 0, fee: 0, orders: 0,
    };
  });
}

const PLATFORM_FEE_RATE = 0.05; // 5% — adjust to match your rate

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return Response.json({ error: auth.error }, { status: auth.status });
    const { adminClient } = auth;

    // ── 1. Fetch all orders (lightweight) ────────────────────────────────────
    const { data: orders, error: ordersErr } = await adminClient
      .from('orders')
      .select('id, user_id, total_amount, subtotal, status, payment_method, shipping_address, created_at');
    if (ordersErr) throw ordersErr;

    // ── 2. Fetch all order_items with product + creator ───────────────────────
    const { data: items, error: itemsErr } = await adminClient
      .from('order_items')
      .select('order_id, line_total, product_name, products ( id, name, type, creator_id )');
    if (itemsErr) throw itemsErr;

    // ── 3. Fetch all profiles (creators + customers) ──────────────────────────
    const { data: profiles, error: profErr } = await adminClient
      .from('profiles')
      .select('id, display_name, business_name, business_slug, country, user_role, is_verified, created_at');
    if (profErr) throw profErr;

    const profileMap   = Object.fromEntries((profiles || []).map(p => [p.id, p]));
    const creators     = (profiles || []).filter(p => p.user_role === 'creator');
    const customers    = (profiles || []).filter(p => p.user_role === 'customer');
    const activeCreators = creators.filter(c => c.is_verified);

    // Map order_id → items
    const itemsByOrder = {};
    for (const item of items || []) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    // ── 4. Aggregate orders ───────────────────────────────────────────────────
    const nonRefunded = (orders || []).filter(o => (o.status ?? '').toLowerCase() !== 'refunded');
    const refunded    = (orders || []).filter(o => (o.status ?? '').toLowerCase() === 'refunded');

    const totalGMV    = nonRefunded.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
    const totalFee    = Math.round(nonRefunded.reduce((s, o) => s + Number(o.subtotal ?? o.total_amount ?? 0), 0) * PLATFORM_FEE_RATE);
    const avgOrder    = nonRefunded.length ? Math.round(totalGMV / nonRefunded.length) : 0;
    const refundRate  = orders.length ? ((refunded.length / orders.length) * 100).toFixed(1) : '0.0';

    // ── 5. Monthly GMV + fee + orders (last 6 months) ─────────────────────────
    const monthBuckets = buildMonthBuckets(6);
    for (const order of orders || []) {
      const key    = order.created_at?.slice(0, 7);
      const bucket = monthBuckets.find(b => b.key === key);
      if (!bucket) continue;
      bucket.orders += 1;
      if ((order.status ?? '').toLowerCase() !== 'refunded') {
        const amt = Number(order.total_amount ?? 0);
        const sub = Number(order.subtotal ?? amt);
        bucket.gmv += amt;
        bucket.fee += Math.round(sub * PLATFORM_FEE_RATE);
      }
    }

    // ── 6. Active creators count per month (joined) ───────────────────────────
    const monthBucketsWithCreators = monthBuckets.map(b => ({
      ...b,
      creators: creators.filter(c => c.is_verified && c.created_at?.slice(0, 7) <= b.key).length,
    }));

    // ── 7. Revenue by product type (category) ─────────────────────────────────
    const typeRevMap = {};
    for (const item of items || []) {
      const order = (orders || []).find(o => o.id === item.order_id);
      if (!order || (order.status ?? '').toLowerCase() === 'refunded') continue;
      const type = item.products?.type ?? 'other';
      typeRevMap[type] = (typeRevMap[type] || 0) + Number(item.line_total ?? 0);
    }
    const totalTypeRev = Object.values(typeRevMap).reduce((s, v) => s + v, 0) || 1;
    const revenueByCategory = Object.entries(typeRevMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, revenue]) => ({
        name:    name.charAt(0).toUpperCase() + name.slice(1),
        revenue,
        pct:     Math.round((revenue / totalTypeRev) * 100),
      }));

    // ── 8. Users by country ───────────────────────────────────────────────────
    const countryMap = {};
    for (const p of profiles || []) {
      const country = p.country || 'Unknown';
      if (!countryMap[country]) countryMap[country] = { users: 0, orders: 0 };
      countryMap[country].users += 1;
    }
    // Also count orders per country from shipping_address
    for (const order of orders || []) {
      const country = order.shipping_address?.country || 'Unknown';
      if (!countryMap[country]) countryMap[country] = { users: 0, orders: 0 };
      countryMap[country].orders += 1;
    }
    const totalCountryUsers = Object.values(countryMap).reduce((s, v) => s + v.users, 0) || 1;
    const topCountries = Object.entries(countryMap)
      .filter(([c]) => c !== 'Unknown')
      .sort((a, b) => b[1].orders - a[1].orders)
      .slice(0, 6)
      .map(([country, { users, orders: cnt }]) => ({
        country, users, orders: cnt,
        pct: Math.round((users / totalCountryUsers) * 100),
      }));

    // ── 9. Top stores (creators by revenue) ───────────────────────────────────
    const creatorRevMap = {};
    for (const item of items || []) {
      const cid   = item.products?.creator_id;
      const order = (orders || []).find(o => o.id === item.order_id);
      if (!cid || !order || (order.status ?? '').toLowerCase() === 'refunded') continue;
      if (!creatorRevMap[cid]) creatorRevMap[cid] = { revenue: 0, orders: new Set() };
      creatorRevMap[cid].revenue += Number(item.line_total ?? 0);
      creatorRevMap[cid].orders.add(item.order_id);
    }
    const topStores = Object.entries(creatorRevMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([cid, { revenue, orders: orderSet }]) => {
        const p = profileMap[cid];
        return {
          id:       cid,
          name:     p?.business_name || p?.display_name || 'Unknown Store',
          owner:    p?.display_name  || '—',
          category: 'Creator',
          revenue,
          orders:   orderSet.size,
          status:   p?.is_verified ? 'Active' : 'Pending',
        };
      });

    // ── 10. Recent 5 transactions ─────────────────────────────────────────────
    const recentOrders = (orders || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(order => {
        const firstItem   = itemsByOrder[order.id]?.[0];
        const productName = firstItem?.products?.name || firstItem?.product_name || '—';
        const buyerProfile = profileMap[order.user_id];
        const statusRaw   = (order.status ?? '').toLowerCase();
        return {
          id:      order.id,
          txnId:   `#${String(order.id).slice(0, 6).toUpperCase()}`,
          user:    buyerProfile?.display_name || order.shipping_address?.name || '—',
          product: productName,
          amount:  Number(order.total_amount ?? 0),
          status:  statusRaw === 'completed' ? 'Settled' : statusRaw === 'refunded' ? 'Refunded' : 'Pending',
        };
      });

    // ── 11. Summary stats for overview cards ──────────────────────────────────
    const stats = {
      totalGMV,
      totalFee,
      avgOrder,
      refundRate,
      totalOrders:   orders.length,
      totalCreators: creators.length,
      totalCustomers: customers.length,
      activeCreators: activeCreators.length,
      pendingCreators: creators.filter(c => !c.is_verified).length,
    };

    return Response.json({
      success: true,
      stats,
      monthlyData:      monthBucketsWithCreators,
      revenueByCategory,
      topCountries,
      topStores,
      recentTransactions: recentOrders,
    });

  } catch (error) {
    console.error('[admin/stats] GET error:', error);
    return Response.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 });
  }
}