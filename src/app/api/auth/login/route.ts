import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Read the master password and secret from environment variables
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set the secure, HttpOnly session cookie
      response.cookies.set('hush_admin_session', sessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure on HTTPS (prod)
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return response;
    }

    // Secure password failure response
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
