import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
 
    const { productId } = await request.json();
 
    if (!productId) {
      return Response.json({ error: 'Product ID required' }, { status: 400 });
    }
 
    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
 
    if (existing) {
      return Response.json({ 
        error: 'Already in wishlist' 
      }, { status: 400 });
    }
 
    const { data, error } = await supabase
      .from('wishlists')
      .insert([{ 
        user_id: user.id, 
        product_id: productId 
      }])
      .select();
 
    if (error) throw error;
 
    return Response.json({ 
      success: true, 
      item: data[0],
      message: 'Added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}