// app/api/wishlist/route.js - MINIMAL COLUMNS (safest)
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

    // Query wishlist with only ESSENTIAL columns that definitely exist
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          price
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return Response.json({ success: true, wishlist: data || [] });

  } catch (error) {
    console.error('GET /api/wishlist error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch wishlist' }, 
      { status: 500 }
    );
  }
}