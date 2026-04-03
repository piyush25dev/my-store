// app/api/wishlist/add/route.js
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return Response.json({ error: 'Product ID required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return Response.json({ error: 'Already in wishlist' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('wishlists')
      .insert([{ user_id: user.id, product_id: productId }])
      .select();

    if (error) throw error;

    return Response.json({ success: true, item: data[0], message: 'Added to wishlist' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}