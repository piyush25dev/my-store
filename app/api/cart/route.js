import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
 
    // Fetch cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        variant_id,
        products (
          id,
          name,
          price,
          image_url,
          slug
        ),
        product_variants (
          id,
          name,
          price
        )
      `)
      .eq('user_id', user.id);
 
    if (error) throw error;
 
    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      const price = item.product_variants?.price || item.products?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
 
    return Response.json({
      success: true,
      cart: cartItems,
      total,
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error('Cart error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}