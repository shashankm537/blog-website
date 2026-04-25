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

      {/* Responsive CSS */}
      <style>{`
        .header-inner {
          width: 100%;
          padding: 0 16px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
        }
        .theme-btn {
          position: absolute;
          right: 16px;
          background: var(--accent-light);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          color: var(--text-primary);
          font-size: 13px;
          font-family: inherit;
          white-space: nowrap;
        }
        .hero {
          background: var(--accent);
          color: #fff;
          text-align: center;
          padding: 40px 16px;
        }
        .hero h2 {
          font-size: clamp(22px, 5vw, 48px);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .hero p {
          font-size: clamp(13px, 2vw, 18px);
          opacity: 0.85;
          max-width: 560px;
          margin: 0 auto;
        }
        .filters {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px 0;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          text-transform: capitalize;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-select {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          appearance: none;
        }
        .blog-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 480px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .blog-card {
          background: var(--surface);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: var(--card-shadow);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .card-image {
          height: 180px;
          background: var(--accent-light);
          overflow: hidden;
          flex-shrink: 0;
        }
        @media (max-width: 479px) {
          .card-image {
            height: 200px;
          }
        }
        .card-content {
          padding: 14px 16px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-title {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        @media (max-width: 479px) {
          .card-title {
            font-size: 17px;
          }
        }
        .card-excerpt {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
          flex: 1;
        }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .page-btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
        }
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 16px 64px;
        }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
      }}>
        <div className="header-inner">
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 700, letterSpacing: '-0.5px' }}>
              The Daily Read
            </h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              Tech · Finance · Data · Security
            </p>
          </div>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="hero">
        <h2>Your Daily Dose of What Matters</h2>
        <p>Curated and rewritten daily from the best sources across tech, finance, data engineering and cybersecurity.</p>
      </div>

      {/* Filters */}
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="filter-btn"
            style={{
              background: activeCategory === cat ? 'var(--accent)' : 'var(--surface)',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-select"
          style={{
            background: selectedDate ? 'var(--accent)' : 'var(--surface)',
            color: selectedDate ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <option value="">📅 Date</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>{formatDate(date)}</option>
          ))}
        </select>

        {(selectedDate || activeCategory !== 'all') && (
          <button
            className="filter-btn"
            onClick={() => { setSelectedDate(''); setActiveCategory('all'); }}
            style={{ background: 'var(--surface)', color: 'var(--accent)' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Blog Grid */}
      <main className="main-content">
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
            <div className="blog-grid">
              {paginated.map((blog) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} style={{ display: 'flex' }}>
                  <article className="blog-card">
                    <div className="card-image">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 36
                        }}>
                          {blog.category === 'tech' ? '💻' :
                            blog.category === 'finance' ? '📈' :
                            blog.category === 'cybersecurity' ? '🔒' : '📊'}
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: 1,
                          color: '#fff',
                          background: categoryColor[blog.category] || '#c8472b',
                          padding: '3px 8px', borderRadius: 4
                        }}>
                          {blog.category.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {formatDate(blog.date)}
                        </span>
                      </div>

                      <h2 className="card-title">{blog.title}</h2>
                      <p className="card-excerpt">{blog.excerpt}</p>

                      <div style={{ marginTop: 14, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                        Read more →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {currentPage > 1 && (
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
                  >
                    ← Prev
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className="page-btn"
                    onClick={() => setCurrentPage(page)}
                    style={{
                      background: currentPage === page ? 'var(--accent)' : 'var(--surface)',
                      color: currentPage === page ? '#fff' : 'var(--text-primary)',
                      fontWeight: currentPage === page ? 700 : 400
                    }}
                  >
                    {page}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
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