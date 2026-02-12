'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  icon: string;
  gradient: string;
  date: string;
  author: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

const FILTERS = [
  { key: 'all', label: 'All Posts' },
  { key: 'ai-ml', label: 'AI & ML' },
  { key: 'defense', label: 'Defense' },
  { key: 'quantum', label: 'Quantum' },
  { key: 'data', label: 'Data Engineering' },
  { key: 'cybersecurity', label: 'Cybersecurity' },
  { key: 'telecom', label: 'Telecom' },
];

export default function BlogGrid({ posts }: BlogGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPosts =
    activeFilter === 'all' ? posts : posts.filter((post) => post.category === activeFilter);

  return (
    <>
      {/* Filter Bar */}
      <div className="container">
        <div className="filter-bar">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <section className="blog-section">
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No posts found in this category.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="blog-card">
                  <div className="card-hero" style={{ background: post.gradient }}>
                    <span className="card-icon">{post.icon}</span>
                  </div>
                  <div className="card-body">
                    <span className="card-category" style={{ color: post.categoryColor }}>
                      {post.categoryLabel}
                    </span>
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-excerpt">{post.excerpt}</p>
                    <div className="card-meta">
                      <span>{post.date}</span>
                      <span className="meta-dot">·</span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .filter-btn {
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 3px;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--gold);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: rgba(245, 200, 66, 0.1);
          border-color: var(--gold);
          color: var(--gold);
        }

        .blog-section {
          padding-bottom: 5rem;
          position: relative;
          z-index: 1;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .blog-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
          animation: fadeInUp 0.4s ease-out forwards;
        }

        .blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(245, 200, 66, 0.4);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-hero {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon {
          font-size: 3.5rem;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        .card-body {
          padding: 1.5rem;
        }

        .card-category {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.75rem;
        }

        .card-title {
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 1.1rem;
          line-height: 1.35;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .card-excerpt {
          font-size: 0.85rem;
          line-height: 1.65;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .card-meta {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .meta-dot {
          opacity: 0.5;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
