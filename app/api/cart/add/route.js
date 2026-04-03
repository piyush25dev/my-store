import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
 
    const { productId, quantity = 1, variantId = null } = await request.json();
 
    if (!productId || quantity < 1) {
      return Response.json(
        { error: 'Invalid product or quantity' },
        { status: 400 }
      );
    }
 
    // Check if product exists
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single();
 
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
 
    // Check if item already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('variant_id', variantId)
      .single();
 
    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select();
 
      if (error) throw error;
      return Response.json({ 
        success: true, 
        item: data[0],
        message: 'Cart updated'
      });
    }
 
    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        user_id: user.id,
        product_id: productId,
        variant_id: variantId,
        quantity,
      }])
      .select();
 
    if (error) throw error;
 
    return Response.json({ 
      success: true, 
      item: data[0],
      message: 'Added to cart'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}