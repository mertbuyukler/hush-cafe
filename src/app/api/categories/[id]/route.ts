import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

// Helper to verify admin
async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('hush_admin_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default_dev_secret';
  return sessionCookie && sessionCookie.value === expectedToken;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, slug } = await request.json();
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const db = getRequestContext().env.DB as any;

    // Check if slug exists on ANOTHER category
    const existing = await db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').bind(slug, id).first();
    if (existing) {
      return NextResponse.json({ error: 'Another category with this slug already exists' }, { status: 400 });
    }

    const { success } = await db.prepare('UPDATE categories SET name = ?, slug = ? WHERE id = ?').bind(name, slug, id).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Category updated successfully' });
    } else {
      return NextResponse.json({ error: 'Category not found or update failed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getRequestContext().env.DB as any;
    
    // Ensure we don't delete categories that have stations attached
    // Or we rely on SQLite ON DELETE SET NULL which we defined in schema.
    // For safety, let's just delete. SQLite will set category_id to NULL on stations.
    
    const { success } = await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Category not found or delete failed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
