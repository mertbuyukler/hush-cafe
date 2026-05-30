import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

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
    const { name, description, stream_url, cover_image_url, category_id, is_featured } = await request.json();
    
    if (!name || !stream_url) {
      return NextResponse.json({ error: 'Name and Stream URL are required' }, { status: 400 });
    }

    const db = getRequestContext().env.DB as any;

    const { success } = await db.prepare(
      'UPDATE stations SET name = ?, description = ?, stream_url = ?, cover_image_url = ?, category_id = ?, is_featured = ? WHERE id = ?'
    ).bind(
      name.trim(), 
      description ? description.trim() : null, 
      stream_url.trim(), 
      cover_image_url ? cover_image_url.trim() : null, 
      category_id || null, 
      is_featured ? 1 : 0, 
      id
    ).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Station updated successfully' });
    } else {
      return NextResponse.json({ error: 'Station not found or update failed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update station:', error);
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
    
    const { success } = await db.prepare('DELETE FROM stations WHERE id = ?').bind(id).run();
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Station deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Station not found or delete failed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete station:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
