import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const db = getRequestContext().env.DB as any;
    
    let query = 'SELECT * FROM stations ORDER BY created_at DESC';
    let results;
    
    if (category) {
      query = 'SELECT * FROM stations WHERE category_id = ? ORDER BY created_at DESC';
      const stmt = await db.prepare(query).bind(category);
      results = (await stmt.all()).results;
    } else {
      results = (await db.prepare(query).all()).results;
    }
    
    return NextResponse.json(results);
  } catch (err) {
    console.error('Failed to fetch stations:', err);
    return NextResponse.json({ error: 'Failed to fetch stations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('hush_admin_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';
  
  if (!sessionCookie || sessionCookie.value !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, stream_url, cover_image_url, category_id, is_featured } = await request.json();
    
    if (!name || !stream_url) {
      return NextResponse.json({ error: 'Name and Stream URL are required' }, { status: 400 });
    }

    const db = getRequestContext().env.DB as any;
    
    const { success } = await db.prepare(
      'INSERT INTO stations (name, description, stream_url, cover_image_url, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      name.trim(), 
      description ? description.trim() : null, 
      stream_url.trim(), 
      cover_image_url ? cover_image_url.trim() : null, 
      category_id || null, 
      is_featured ? 1 : 0
    ).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Station created successfully' }, { status: 201 });
    } else {
      throw new Error('Database insertion failed');
    }
  } catch (error) {
    console.error('Failed to create station:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
