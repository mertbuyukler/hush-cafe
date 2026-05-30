import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect all /admin routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('hush_admin_session');
    
    // In Edge middleware, we check against the environment variable
    const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';

    if (!sessionCookie || sessionCookie.value !== expectedToken) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If already authenticated and trying to access the login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('hush_admin_session');
    const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';
    
    if (sessionCookie && sessionCookie.value === expectedToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
