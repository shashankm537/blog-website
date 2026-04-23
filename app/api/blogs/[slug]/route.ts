import { NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/blogs';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const blog = getBlogBySlug(slug);
  if (!blog) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(blog);
}