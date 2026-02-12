import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Demo posts for development
const DEMO_POSTS: Record<string, any> = {
  '1': {
    id: '1',
    slug: 'agentic-ai-software-architecture',
    title: 'Why Agentic AI Is the Last Software Architecture You\'ll Ever Need',
    excerpt: 'The era of static software is ending. Agentic AI promises self-evolving, goal-oriented systems.',
    content: '<h2>Introduction</h2><p>The era of static software is ending...</p>',
    category: 'ai-ml',
    categoryLabel: 'AI & ML',
    status: 'published',
    author: 'Benedict Mbakogu',
    authorId: 'demo-admin-001',
    publishedAt: '2026-02-10T00:00:00Z',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z',
    readTime: 8,
    tags: ['AI', 'Agentic AI', 'Enterprise'],
  },
  '2': {
    id: '2',
    slug: 'edge-ai-drone-solutions',
    title: 'Edge-AI Drone Solutions: The New Paradigm for Autonomous Surveillance',
    excerpt: 'How Lone Cowry Labs is advancing ISR capabilities with edge-deployed AI.',
    content: '<h2>The New Era</h2><p>Defense technology is evolving...</p>',
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
    slug: 'quantum-fintech-cryptography',
    title: 'Quantum Mechanics Meets Fintech',
    excerpt: 'The quantum threat to financial systems is real.',
    content: '<h2>The Quantum Threat</h2><p>Quantum computing is advancing...</p>',
    category: 'quantum',
    categoryLabel: 'Quantum',
    status: 'published',
    author: 'Benedict Mbakogu',
    authorId: 'demo-admin-001',
    publishedAt: '2026-02-05T00:00:00Z',
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
    readTime: 12,
    tags: ['Quantum', 'Fintech', 'Cryptography'],
  },
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const bySlug = searchParams.get('bySlug') === 'true';

    let post;
    if (bySlug) {
      post = Object.values(DEMO_POSTS).find(p => p.slug === id);
    } else {
      post = DEMO_POSTS[id];
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user can view unpublished posts
    const session = await getSession();
    if (post.status !== 'published' && !session) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = DEMO_POSTS[id];
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // In demo mode, return the updated post
    const updatedPost = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
      publishedAt: body.status === 'published' && !existing.publishedAt
        ? new Date().toISOString()
        : existing.publishedAt,
    };

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!DEMO_POSTS[id]) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
