// app/api/orders/route.js - FIXED (no image_url)
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

    const token = authHeader.slice(7);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized: Invalid or expired token' }, 
        { status: 401 }
      );
    }

    // Simple query without image_url
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return Response.json({ success: true, orders: data || [] });

  } catch (error) {
    console.error('GET /api/orders error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch orders' }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Missing or invalid authorization header' }, 
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return Response.json(
        { error: 'Unauthorized: Invalid or expired token' }, 
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentInfo } = await request.json();

    if (!items?.length) {
      return Response.json({ error: 'No items in order' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        status: 'pending',
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_info: paymentInfo,
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      variant_id: item.variantId || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    return Response.json({ 
      success: true, 
      order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('POST /api/orders error:', error);
    return Response.json(
      { error: error.message || 'Failed to create order' }, 
      { status: 500 }
    );
  }
}