'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  disclaimer: string;
}

const POSTS_PER_PAGE = 8;

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data);
        setFiltered(data);
        const cats = ['all', ...Array.from(new Set<string>(data.map((b: Blog) => b.category)))];
        setCategories(cats);
        const dates = Array.from(new Set<string>(data.map((b: Blog) => b.date))).sort((a, b) => b.localeCompare(a));
        setAvailableDates(dates);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = blogs;
    if (activeCategory !== 'all') {
      result = result.filter((b) => b.category === activeCategory);
    }
    if (selectedDate) {
      result = result.filter((b) => b.date === selectedDate);
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [activeCategory, selectedDate, blogs]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const categoryColor: Record<string, string> = {
    tech: '#2563eb',
    finance: '#16a34a',
    data_engineering: '#7c3aed',
    cybersecurity: '#dc2626',
    general: '#c8472b',
  };

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

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
          width: '100%',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
              The Daily Read
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
              Tech · Finance · Data · Security
            </p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              position: 'absolute',
              right: 24,
              background: 'var(--accent-light)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'inherit'
            }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'var(--accent)',
        color: '#fff',
        textAlign: 'center',
        padding: '56px 24px'
      }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: 12 }}>
          Your Daily Dose of What Matters
        </h2>
        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', opacity: 0.85, maxWidth: 560, margin: '0 auto' }}>
          Curated and rewritten daily from the best sources across tech, finance, data engineering and cybersecurity.
        </p>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0' }}>
        {/* Category + Date row - center aligned */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                background: activeCategory === cat ? 'var(--accent)' : 'var(--surface)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'inherit',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}

          {/* Date dropdown */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: selectedDate ? 'var(--accent)' : 'var(--surface)',
              color: selectedDate ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              appearance: 'none',
              paddingRight: 32
            }}
          >
            <option value="">📅 Date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {(selectedDate || activeCategory !== 'all') && (
            <button
              onClick={() => { setSelectedDate(''); setActiveCategory('all'); }}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            Loading articles...
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            No articles found.
          </div>
        ) : (
          <>
            {/* 4 columns grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20
            }}>
              {paginated.map((blog) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                  <article style={{
                    background: 'var(--surface)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: 180, background: 'var(--accent-light)', overflow: 'hidden' }}>
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 36
                        }}>
                          {blog.category === 'tech' ? '💻' :
                            blog.category === 'finance' ? '📈' :
                            blog.category === 'cybersecurity' ? '🔒' : '📊'}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          color: '#fff',
                          background: categoryColor[blog.category] || '#c8472b',
                          padding: '3px 8px',
                          borderRadius: 4
                        }}>
                          {blog.category.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {formatDate(blog.date)}
                        </span>
                      </div>

                      <h2 style={{
                        fontSize: 16,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        marginBottom: 8,
                        color: 'var(--text-primary)'
                      }}>
                        {blog.title}
                      </h2>

                      <p style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        flex: 1
                      }}>
                        {blog.excerpt}
                      </p>

                      <div style={{
                        marginTop: 14,
                        fontSize: 13,
                        color: 'var(--accent)',
                        fontWeight: 600
                      }}>
                        Read more →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginTop: 48,
                flexWrap: 'wrap'
              }}>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  >
                    ← Prev
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: currentPage === page ? 'var(--accent)' : 'var(--surface)',
                      color: currentPage === page ? '#fff' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      fontWeight: currentPage === page ? 700 : 400
                    }}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
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