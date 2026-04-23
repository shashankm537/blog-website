'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  date: string;
  category: string;
  source: string;
  image: string;
  disclaimer: string;
  content: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetch(`/api/blogs/${slug}`)
        .then((r) => {
          if (!r.ok) { setNotFound(true); setLoading(false); return null; }
          return r.json();
        })
        .then((data) => {
          if (data) { setBlog(data); setLoading(false); }
        });
    }
  }, [slug]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const categoryColor: Record<string, string> = {
    tech: '#2563eb',
    finance: '#16a34a',
    data_engineering: '#7c3aed',
    cybersecurity: '#dc2626',
    general: '#c8472b',
  };

  const renderContent = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 style="font-size:20px;margin:28px 0 10px;font-family:Playfair Display,Georgia,serif">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size:26px;margin:36px 0 12px;font-family:Playfair Display,Georgia,serif">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size:32px;margin:40px 0 16px;font-family:Playfair Display,Georgia,serif">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p style="margin-bottom:20px">')
      .replace(/^/, '<p style="margin-bottom:20px">')
      .replace(/$/, '</p>');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>Loading article...</p>
    </div>
  );

  if (notFound || !blog) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>Article not found.</p>
      <Link href="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Back to home</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/">
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', cursor: 'pointer' }}>
              The Daily Read
            </h1>
          </Link>
          <Link href="/" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
            ← Back to all articles
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      {blog.image && (
        <div style={{ width: '100%', height: 'clamp(200px, 40vw, 420px)', overflow: 'hidden' }}>
          <img
            src={blog.image}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Article */}
      <main style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#fff',
            background: categoryColor[blog.category] || '#c8472b',
            padding: '4px 12px',
            borderRadius: 4
          }}>
            {blog.category.replace('_', ' ')}
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {formatDate(blog.date)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 4vw, 40px)',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 24,
          color: 'var(--text-primary)'
        }}>
          {blog.title}
        </h1>

        {/* Disclaimer */}
        {blog.disclaimer && (
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--accent)',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 28,
            fontSize: 14,
            color: 'var(--text-secondary)'
          }}>
            ⚠️ {blog.disclaimer}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 32 }} />

        {/* Content */}
        <div
          style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text-primary)' }}
          dangerouslySetInnerHTML={{ __html: renderContent(blog.content) }}
        />

        {/* Source */}
        {blog.source && (
          <div style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            fontSize: 14,
            color: 'var(--text-muted)'
          }}>
            Original source:{' '}
            
             <a href={blog.source}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'underline' }}
            >
              {blog.source}
            </a>
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15
          }}>
            ← Back to all articles
          </Link>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: 14
      }}>
        © {new Date().getFullYear()} The Daily Read · Auto-published daily
      </footer>
    </div>
  );
}