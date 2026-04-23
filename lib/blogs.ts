import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogsDirectory = path.join(process.cwd(), 'content/blogs');

export interface Blog {
  slug: string;
  title: string;
  date: string;
  category: string;
  source: string;
  image: string;
  disclaimer: string;
  content: string;
  excerpt: string;
}

export function getAllBlogs(): Blog[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogsDirectory);
  const blogs = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || '',
        category: data.category || 'general',
        source: data.source || '',
        image: data.image || '',
        disclaimer: data.disclaimer || '',
        content,
        excerpt: content.slice(0, 200).replace(/[#*`]/g, '') + '...',
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return blogs;
}

export function getBlogBySlug(slug: string): Blog | null {
  try {
    if (!fs.existsSync(blogsDirectory)) return null;

    const files = fs.readdirSync(blogsDirectory);
    const match = files.find(f => f.replace(/\.mdx?$/, '') === slug);

    if (!match) return null;

    const fullPath = path.join(blogsDirectory, match);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || '',
      category: data.category || 'general',
      source: data.source || '',
      image: data.image || '',
      disclaimer: data.disclaimer || '',
      content,
      excerpt: content.slice(0, 200).replace(/[#*`]/g, '') + '...',
    };
  } catch {
    return null;
  }
}

export function getCategories(): string[] {
  const blogs = getAllBlogs();
  const cats = new Set(blogs.map((b) => b.category));
  return ['all', ...Array.from(cats)];
}