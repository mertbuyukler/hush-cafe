import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

// Public GET route for frontend
export async function GET(request: Request) {
  try {
    const db = getRequestContext().env.DB as any;
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// Protected POST route for admin
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('hush_admin_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';
  
  if (!sessionCookie || sessionCookie.value !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug } = await request.json();
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Basic format validation for slug
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const db = getRequestContext().env.DB as any;
    
    // Check if slug already exists
    const existing = await db.prepare('SELECT id FROM categories WHERE slug = ?').bind(slug).first();
    if (existing) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }

    const { success } = await db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').bind(name, slug).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Category created successfully' }, { status: 201 });
    } else {
      throw new Error('Database insertion failed');
    }
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
