import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all products created by this creator
    const { data: creatorProducts } = await supabase
      .from('products')
      .select('id')
      .eq('creator_id', user.id);

    const productIds = creatorProducts?.map((p) => p.id) || [];

    if (productIds.length === 0) {
      return NextResponse.json({
        orders: [],
        total: 0,
      });
    }

    // Get orders containing creator's products
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        order_id,
        product_name,
        line_total,
        orders:order_id(
          id, order_number, total_amount, status, created_at,
          customer_name, email
        )
      `)
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by order and get unique orders
    const uniqueOrders = Array.from(
      new Map(
        (orderItems || []).map((item) => [
          item.orders.id,
          {
            ...item.orders,
            product_names: [
              ...(new Map().get(item.orders.id)?.product_names || []),
              item.product_name,
            ],
          },
        ])
      ).values()
    );

    return NextResponse.json({
      orders: uniqueOrders,
      total: uniqueOrders.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}