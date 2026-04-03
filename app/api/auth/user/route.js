import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
 
    if (error || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    return Response.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}