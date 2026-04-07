// app/api/orders/route.js - FIXED WITH PROPER TOTAL VALIDATION
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
      .eq('user_id', user.id)
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

    console.log('[API] Received items:', items);
    console.log('[API] Items count:', items?.length);

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: 'No items in order' }, 
        { status: 400 }
      );
    }

    // Calculate totals with detailed logging
    console.log('[API] Calculating totals...');
    
    let subtotal = 0;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      const itemTotal = itemPrice * itemQty;
      
      console.log(`[API] Item ${i}: price=${itemPrice}, qty=${itemQty}, total=${itemTotal}`);
      
      subtotal += itemTotal;
    }

    console.log('[API] Subtotal:', subtotal);

    // Ensure subtotal is a valid number
    if (typeof subtotal !== 'number' || isNaN(subtotal) || subtotal <= 0) {
      console.error('[API] Invalid subtotal calculated:', subtotal);
      return Response.json(
        { error: `Invalid subtotal: ${subtotal}. Check item prices and quantities.` }, 
        { status: 400 }
      );
    }

    // Calculate other amounts
    const taxAmount = Math.round(subtotal * 0.18);  // 18% GST
    const shippingAmount = subtotal > 49900 ? 0 : 4900;  // Free over ₹499
    const totalAmount = subtotal + taxAmount + shippingAmount;

    console.log('[API] Tax:', taxAmount);
    console.log('[API] Shipping:', shippingAmount);
    console.log('[API] Total:', totalAmount);

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      console.error('[API] Invalid total amount:', totalAmount);
      return Response.json(
        { error: `Invalid total amount: ${totalAmount}` }, 
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    console.log('[API] Order number:', orderNumber);
    console.log('[API] Creating order with totals:', {
      subtotal,
      taxAmount,
      shippingAmount,
      totalAmount
    });

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        email: user.email || shippingAddress?.email || '',
        customer_name: shippingAddress?.name || '',
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: paymentInfo?.method || 'card',
        shipping_status: 'pending',
        currency: 'INR',
        subtotal: subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        discount_code: null,
        total_amount: totalAmount,  // EXPLICITLY SET - THIS WAS NULL BEFORE
        shipping_address: shippingAddress || {},
        billing_address: shippingAddress || {},
        gateway_order_id: null,
        notes: null,
        created_at: now,
        updated_at: now,
      }])
      .select()
      .single();

    if (orderError) {
      console.error('[API] Order insertion error:', orderError);
      throw orderError;
    }

    console.log('[API] Order created:', order.id);

    // Insert order items
    const orderItems = items.map((item, index) => {
      const unitPrice = item.price || 0;
      const quantity = item.quantity || 1;
      const lineTotal = unitPrice * quantity;
      const itemTax = Math.round(lineTotal * 0.18);

      return {
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product_name || `Item ${index + 1}`,
        variant_label: item.variant_label || null,
        unit_price: unitPrice,
        quantity: quantity,
        line_total: lineTotal,
        tax_amount: itemTax,
        discount_amount: 0,
        created_at: now,
      };
    });

    console.log('[API] Inserting order items:', orderItems.length);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[API] Order items insertion error:', itemsError);
      throw itemsError;
    }

    console.log('[API] Order items inserted successfully');

    return Response.json({ 
      success: true, 
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        shipping_amount: order.shipping_amount,
      },
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('[API] POST /api/orders error:', error);
    return Response.json(
      { error: error.message || 'Failed to create order' }, 
      { status: 500 }
    );
  }
}