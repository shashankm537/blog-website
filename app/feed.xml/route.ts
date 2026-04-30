import { getAllBlogs } from '@/lib/blogs';

export async function GET() {
  const blogs = getAllBlogs();
  const baseUrl = 'https://the-daily-read.vercel.app';

  const rssItems = blogs.slice(0, 20).map((blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid>${baseUrl}/blog/${blog.slug}</guid>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <category>${blog.category.replace('_', ' ')}</category>
      <description><![CDATA[${blog.excerpt}]]></description>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Daily Read</title>
    <link>${baseUrl}</link>
    <description>Daily curated news across Tech, Finance, Data Engineering and Cybersecurity</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600',
    },
  });
}