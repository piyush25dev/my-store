// app/api/orders/[id]/route.js - FIXED (no image_url)
import { createClient } from '@supabase/supabase-js';

export async function GET(request, { params }) {
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

    const { id } = await params;

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
      .eq('id', id)
      .single();

    if (error || !data) {
      return Response.json(
        { error: 'Order not found' }, 
        { status: 404 }
      );
    }

    return Response.json({ success: true, order: data });

  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch order' }, 
      { status: 500 }
    );
  }
}