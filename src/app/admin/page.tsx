import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getAllPosts, getDashboardStats } from '@/lib/db';

// For demo/local development without DynamoDB
const DEMO_MODE = !process.env.AWS_ACCESS_KEY_ID;

async function getStats() {
  if (DEMO_MODE) {
    return {
      totalPosts: 6,
      publishedPosts: 4,
      draftPosts: 2,
      scheduledPosts: 0,
    };
  }
  return await getDashboardStats();
}

async function getRecentPosts() {
  if (DEMO_MODE) {
    return [
      {
        id: '1',
        title: 'The Future of Agentic AI in Enterprise',
        excerpt: 'Exploring how autonomous AI agents are transforming...',
        status: 'published',
        author: 'Benedict M.',
        createdAt: '2026-02-10T00:00:00Z',
      },
      {
        id: '2',
        title: 'Defense Tech: Drone Innovation in 2026',
        excerpt: 'How Lone Cowry Labs is advancing ISR capabilities...',
        status: 'draft',
        author: 'Benedict M.',
        createdAt: '2026-02-08T00:00:00Z',
      },
      {
        id: '3',
        title: 'Cloud Migration: AWS vs Azure vs GCP',
        excerpt: 'A comprehensive comparison guide for enterprise...',
        status: 'published',
        author: 'Benedict M.',
        createdAt: '2026-02-05T00:00:00Z',
      },
    ];
  }
  const posts = await getAllPosts(undefined, undefined, 5);
  return posts;
}

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const [stats, recentPosts] = await Promise.all([getStats(), getRecentPosts()]);

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
        <h1 className="page-title">Content Dashboard</h1>
        <Link href="/admin/posts/new" className="btn btn-primary">
          <PlusIcon />
          New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Posts</div>
          <div className="stat-value">{stats.totalPosts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Published</div>
          <div className="stat-value">{stats.publishedPosts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Drafts</div>
          <div className="stat-value">{stats.draftPosts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">{stats.scheduledPosts}</div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="content-section">
        <div className="content-header">
          <h2 className="content-title">Recent Posts</h2>
          <Link href="/admin/posts" className="btn btn-secondary">
            View All
          </Link>
        </div>
        <table className="content-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post: any) => (
              <tr key={post.id}>
                <td>
                  <div className="post-title-cell">
                    <span className="post-title">{post.title}</span>
                    <span className="post-excerpt">{post.excerpt}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>{post.author}</td>
                <td>{formatDate(post.createdAt)}</td>
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
                      href={`/blog/${post.slug || post.id}`}
                      className="action-btn"
                      title="View"
                      target="_blank"
                    >
                      <ViewIcon />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {DEMO_MODE && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(245,200,66,0.1)',
            border: '1px solid rgba(245,200,66,0.25)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: 'var(--gold)',
          }}
        >
          <strong>Demo Mode:</strong> Running without AWS/DynamoDB connection.
          Configure AWS credentials to enable full functionality.
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}
