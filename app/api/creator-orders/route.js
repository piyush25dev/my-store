// app/api/creator-orders/route.js
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // --- User-scoped client (to verify identity only) ---
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
      );
    }

    // --- Service-role client (bypasses RLS for cross-table joins) ---
    // Safe because we verified the user above and manually scope to their creator_id.
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY  // server-only, never exposed to client
    );

    // Single query: order_items whose product belongs to this creator + parent order
    const { data: items, error: itemsError } = await adminClient
      .from('order_items')
      .select(`
        *,
        products!inner (
          id,
          name,
          creator_id
        ),
        orders!inner (
          id,
          status,
          payment_status,
          total_amount,
          subtotal,
          tax_amount,
          shipping_amount,
          shipping_address,
          currency,
          created_at,
          user_id,
          order_number
        )
      `)
      .eq('products.creator_id', user.id);

    if (itemsError) {
      console.error('[creator-orders] Query error:', itemsError);
      throw itemsError;
    }

    if (!items || items.length === 0) {
      return Response.json({ success: true, orders: [] });
    }

    // Group items by order
    const ordersMap = new Map();

    for (const item of items) {
      const order = item.orders;
      const orderId = order.id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, { ...order, order_items: [] });
      }

      ordersMap.get(orderId).order_items.push({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        variant_label: item.variant_label,
        unit_price: item.unit_price,
        quantity: item.quantity,
        line_total: item.line_total,
        tax_amount: item.tax_amount,
        discount_amount: item.discount_amount,
        created_at: item.created_at,
        products: {
          id: item.products.id,
          name: item.products.name,
        },
      });
    }

    const orders = Array.from(ordersMap.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    console.log(`[creator-orders] ${orders.length} orders for creator ${user.id}`);
    return Response.json({ success: true, orders });

  } catch (error) {
    console.error('[creator-orders] Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch creator orders' },
      { status: 500 }
    );
  }
}