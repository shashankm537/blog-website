import { getAllBlogs } from '@/lib/blogs';

export default function sitemap() {
  const blogs = getAllBlogs();
  const baseUrl = 'https://the-daily-read.vercel.app';

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...blogUrls,
  ];
}