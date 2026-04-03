import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      user_id,
      session_id,
      event_type,
      event_category,
      resource_type,
      resource_id,
      properties,
      user_agent,
      country,
      device_type,
    } = body;

    // Fire and forget - don't await for performance
    supabaseAdmin
      .from('event_logs')
      .insert({
        user_id,
        session_id,
        event_type,
        event_category,
        resource_type,
        resource_id,
        properties,
        user_agent,
        country,
        device_type,
        ip_address: request.headers.get('x-forwarded-for') || null,
      })
      .then()
      .catch((err) => console.error('Event logging error:', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Event logging error:', error);
    return NextResponse.json({ success: true });
  }
}