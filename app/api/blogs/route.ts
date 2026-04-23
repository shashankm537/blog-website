import { NextResponse } from 'next/server';
import { getAllBlogs } from '@/lib/blogs';

export async function GET() {
  const blogs = getAllBlogs();
  return NextResponse.json(blogs);
}