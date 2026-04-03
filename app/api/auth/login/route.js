import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
 
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
 
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
 
    if (error) throw error;
 
    return Response.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: error.message }, { status: 401 });
  }
}