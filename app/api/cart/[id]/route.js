import { supabase } from "@/lib/supabase";

export async function DELETE(request, { params }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
 
    const { id } = await params;
 
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
 
    if (error) throw error;
 
    return Response.json({ 
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Delete from cart error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}