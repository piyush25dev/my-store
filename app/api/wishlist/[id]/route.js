// app/api/wishlist/[id]/route.js
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
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

    const { id } = await params; // ✅ awaited
    console.log('DELETE wishlist id received:', id);

    console.log('Deleting wishlist item:', id, 'for user:', user.id); // debug

    const { error, count } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return Response.json({ success: true, message: 'Removed from wishlist' });

  } catch (error) {
    console.error('DELETE /api/wishlist/[id] error:', error);
    return Response.json(
      { error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}