import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Demo posts for development
const DEMO_POSTS = [
  {
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
  {
    id: '2',
    slug: 'edge-ai-drone-solutions',
    title: 'Edge-AI Drone Solutions: The New Paradigm for Autonomous Surveillance',
    excerpt: 'How Lone Cowry Labs is advancing ISR capabilities with edge-deployed AI.',
    content: '<h2>The New Era of Autonomous Systems</h2><p>Defense technology is evolving...</p>',
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
  {
    id: '3',
    slug: 'quantum-fintech-cryptography',
    title: 'Quantum Mechanics Meets Fintech: Why Banks Need Post-Quantum Cryptography Now',
    excerpt: 'The quantum threat to financial systems is real. Here\'s how to prepare.',
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
];

// GET /api/posts - Get all posts
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const stats = searchParams.get('stats') === 'true';

    // If requesting stats
    if (stats) {
      const dashboardStats = {
        totalPosts: DEMO_POSTS.length,
        publishedPosts: DEMO_POSTS.filter(p => p.status === 'published').length,
        draftPosts: DEMO_POSTS.filter(p => p.status === 'draft').length,
        scheduledPosts: DEMO_POSTS.filter(p => p.status === 'scheduled').length,
      };
      return NextResponse.json({ success: true, data: dashboardStats });
    }

    // Filter posts
    let posts = [...DEMO_POSTS];

    // For public access, only return published posts unless authenticated
    const session = await getSession();
    if (!session && !status) {
      posts = posts.filter(p => p.status === 'published');
    } else if (status) {
      posts = posts.filter(p => p.status === status);
    }

    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In demo mode, just return success with a fake post
    const newPost = {
      id: `demo-${Date.now()}`,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...body,
      author: session.user.name,
      authorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
      readTime: Math.ceil((body.content?.split(/\s+/).length || 100) / 200),
    };

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
