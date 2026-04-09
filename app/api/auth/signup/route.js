// app/api/auth/signup/route.js
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, password, fullName, userRole } = await request.json(); // ← added userRole

    if (!email || !password || !fullName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate role — only allow known values, default to 'customer' for safety
    const allowedRoles = ['customer', 'creator'];
    const role = allowedRoles.includes(userRole) ? userRole : 'customer';

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:  fullName,
          user_role:  role,   // ← trigger reads raw_user_meta_data->>'user_role'
        },
      },
    });

    if (error) throw error;

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