import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getPostById } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Post | Lone Cowry Admin',
};

// Demo posts for local development
const DEMO_POSTS: Record<string, any> = {
  '1': {
    id: '1',
    slug: 'agentic-ai-software-architecture',
    title: 'The Future of Agentic AI in Enterprise',
    excerpt: 'Exploring how autonomous AI agents are transforming business operations...',
    content: '<h2>Introduction</h2><p>Agentic AI represents a paradigm shift...</p>',
    category: 'ai-ml',
    categoryLabel: 'AI & ML',
    status: 'published',
    author: 'Benedict Mbakogu',
    authorId: 'demo-admin-001',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    readTime: 8,
    tags: ['AI', 'Agentic AI', 'Enterprise'],
  },
  '2': {
    id: '2',
    slug: 'drone-innovation-2026',
    title: 'Defense Tech: Drone Innovation in 2026',
    excerpt: 'How Lone Cowry Labs is advancing ISR capabilities...',
    content: '<h2>The New Era of Autonomous Systems</h2><p>Defense technology...</p>',
    category: 'defense',
    categoryLabel: 'Defense',
    status: 'draft',
    author: 'Benedict Mbakogu',
    authorId: 'demo-admin-001',
    createdAt: '2026-02-08T00:00:00Z',
    updatedAt: '2026-02-08T00:00:00Z',
    readTime: 10,
    tags: ['Defense', 'Drones', 'ISR'],
  },
  '3': {
    id: '3',
    slug: 'cloud-migration-comparison',
    title: 'Cloud Migration: AWS vs Azure vs GCP',
    excerpt: 'A comprehensive comparison guide for enterprise cloud strategy...',
    content: '<h2>Choosing the Right Cloud Provider</h2><p>When migrating to the cloud...</p>',
    category: 'data',
    categoryLabel: 'Data Engineering',
    status: 'published',
    author: 'Benedict Mbakogu',
    authorId: 'demo-admin-001',
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
    readTime: 12,
    tags: ['Cloud', 'AWS', 'Azure', 'GCP'],
  },
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  // Check for demo mode
  const DEMO_MODE = !process.env.AWS_ACCESS_KEY_ID;

  let post;
  if (DEMO_MODE) {
    post = DEMO_POSTS[id];
  } else {
    post = await getPostById(id);
  }

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/admin/posts" className="back-link">
            <svg
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Posts
          </Link>
          <h1 className="page-title">Edit Post</h1>
        </div>
      </div>

      <PostEditor mode="edit" post={post} />
    </div>
  );
}
