// app/api/auth/signup/route.js
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // trigger reads this
      },
    });

    if (error) throw error;

    // ✅ No manual profile insert needed — trigger handles it automatically

    return Response.json({
      success: true,
      user: data.user,
      message: 'Check your email to confirm signup',
    });

  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}