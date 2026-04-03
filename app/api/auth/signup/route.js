import { supabase } from '@/lib/supabase';
 
export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json();
 
    if (!email || !password || !fullName) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
 
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName,
          avatar_url: null,
        },
      },
    });
 
    if (error) throw error;
 
    // Create profile entry
    if (data.user) {
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          user_role: 'customer',
        },
      ]);
    }
 
    return Response.json({ 
      success: true, 
      user: data.user,
      message: 'Check your email to confirm signup'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}