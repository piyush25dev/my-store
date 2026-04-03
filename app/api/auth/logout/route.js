import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { error } = await supabase.auth.signOut();
 
    if (error) throw error;
 
    return Response.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}