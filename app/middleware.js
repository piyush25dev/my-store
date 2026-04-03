// middleware.js
// Protect routes that require authentication

import { createServerClient, parse, serialize } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/cart', '/orders', '/wishlist', '/profile'];
const AUTH_ROUTES = ['/auth/login', '/auth/signup'];
const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get cookies from request
  const cookieStore = parse(request.headers.getSetCookie());

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore[name],
        set: (name, value, options) => {
          cookieStore[name] = value;
        },
        remove: (name) => {
          delete cookieStore[name];
        },
      },
    }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users away from auth pages
  if (user && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/wishlist/:path*',
    '/profile/:path*',
    // Auth routes
    '/auth/login',
    '/auth/signup',
  ],
};