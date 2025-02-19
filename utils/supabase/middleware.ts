// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Use the helper to create a Supabase client that reads the auth cookie
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check for an active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, redirect to /login
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request to continue
  return res;
}

// Protect only certain routes (e.g. /page or /actors)
export const config = {
  matcher: ['/page', '/actors/:path*'],
};
