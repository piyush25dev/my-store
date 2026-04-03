import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 120;
    const offset = (page - 1) * limit;
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    let query = supabase
      .from('products')
      .select(
        `*, 
        product_images!left(id, image_url, alt_text, is_primary)`,
        { count: 'exact' }
      )
      .eq('status', 'published');

    if (featured) {
      query = query.eq('featured', true);
    }

    if (search) {
      query = query.textSearch('search_vector', search);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      products: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}