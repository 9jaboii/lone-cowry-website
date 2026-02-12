'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types';

export default function PostsListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? '' : filter;
      const response = await fetch(`/api/posts${status ? `?status=${status}` : ''}`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blog Posts</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">
          <PlusIcon />
          New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'published', 'draft', 'scheduled'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="content-section">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found</p>
            <Link href="/admin/posts/new" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-title-cell">
                      <span className="post-title">{post.title}</span>
                      <span className="post-excerpt">{post.excerpt}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="category-badge"
                      style={{ borderColor: getCategoryColor(post.category) }}
                    >
                      {post.categoryLabel}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.author}</td>
                  <td>{formatDate(post.publishedAt || post.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="action-btn"
                        title="Edit"
                      >
                        <EditIcon />
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="action-btn"
                        title="View"
                        target="_blank"
                      >
                        <ViewIcon />
                      </Link>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                      >
                        {deleting === post.id ? <LoadingIcon /> : <DeleteIcon />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-family: var(--font-ui);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tab:hover {
          border-color: var(--gold);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: rgba(245, 200, 66, 0.1);
          border-color: var(--gold);
          color: var(--gold);
        }

        .category-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          border: 1px solid;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'ai-ml': '#F5C842',
    defense: '#D43F2F',
    quantum: '#2A2F8F',
    data: '#2DB87C',
    cybersecurity: '#E8912A',
    telecom: '#3BBFEF',
  };
  return colors[category] || '#F5C842';
}

function PlusIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
    </svg>
  );
}
