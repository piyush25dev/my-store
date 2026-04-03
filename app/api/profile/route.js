// app/api/profile/route.js
// Updated API route to handle profile with avatar

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
            Authorization: `Bearer ${authHeader}`,
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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, user_role, avatar_url, phone_number, country, bio')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return Response.json(
        { error: 'Profile not found', profile: null },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      profile: {
        full_name: profile.display_name,
        user_role: profile.user_role,
        avatar_url: profile.avatar_url,
        phone_number: profile.phone_number,
        country: profile.country,
        bio: profile.bio,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: error.message, profile: null },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
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
            Authorization: `Bearer ${authHeader}`,
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

    // Get request body
    const updates = await request.json();

    // Map full_name → display_name
    if (updates.full_name !== undefined) {
      updates.display_name = updates.full_name;
      delete updates.full_name;
    }

    // Remove protected fields
    delete updates.id;
    delete updates.user_role;
    delete updates.is_verified;
    delete updates.created_at;
    delete updates.email;
    
    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 });
    }

    return Response.json({
      success: true,
      profile: profile,
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}