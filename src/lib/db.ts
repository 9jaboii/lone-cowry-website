import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { TABLES, awsConfig } from './amplify-config';
import type { Post, CreatePostInput, UpdatePostInput, DashboardStats } from '@/types';

// Initialize DynamoDB client
const client = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Posts CRUD operations
export async function getAllPosts(
  status?: string,
  category?: string,
  limit: number = 50
): Promise<Post[]> {
  try {
    let command;

    if (status) {
      // Use GSI for status filtering
      command = new QueryCommand({
        TableName: TABLES.POSTS,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
        Limit: limit,
        ScanIndexForward: false, // Sort by publishedAt DESC
      });
    } else {
      command = new ScanCommand({
        TableName: TABLES.POSTS,
        Limit: limit,
      });
    }

    const response = await docClient.send(command);
    let posts = (response.Items || []) as Post[];

    // Filter by category if specified
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    // Sort by publishedAt or createdAt
    posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const command = new GetCommand({
      TableName: TABLES.POSTS,
      Key: { id },
    });

    const response = await docClient.send(command);
    return (response.Item as Post) || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const command = new QueryCommand({
      TableName: TABLES.POSTS,
      IndexName: 'SlugIndex',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug,
      },
      Limit: 1,
    });

    const response = await docClient.send(command);
    return (response.Items?.[0] as Post) || null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const now = new Date().toISOString();
  const id = uuidv4();
  const slug = generateSlug(input.title);

  const post: Post = {
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category,
    categoryLabel: input.categoryLabel,
    status: input.status,
    author: input.author,
    authorId: input.authorId,
    featuredImage: input.featuredImage,
    publishedAt: input.status === 'published' ? now : undefined,
    scheduledFor: input.scheduledFor,
    createdAt: now,
    updatedAt: now,
    readTime: input.readTime || Math.ceil(input.content.split(/\s+/).length / 200),
    tags: input.tags || [],
    icon: input.icon,
    gradient: input.gradient,
  };

  try {
    const command = new PutCommand({
      TableName: TABLES.POSTS,
      Item: post,
    });

    await docClient.send(command);
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(input: UpdatePostInput): Promise<Post> {
  const existing = await getPostById(input.id);
  if (!existing) {
    throw new Error('Post not found');
  }

  const now = new Date().toISOString();
  const updatedPost: Post = {
    ...existing,
    ...input,
    slug: input.title ? generateSlug(input.title) : existing.slug,
    updatedAt: now,
    publishedAt:
      input.status === 'published' && !existing.publishedAt
        ? now
        : existing.publishedAt,
  };

  // Recalculate read time if content changed
  if (input.content) {
    updatedPost.readTime = Math.ceil(input.content.split(/\s+/).length / 200);
  }

  try {
    const command = new PutCommand({
      TableName: TABLES.POSTS,
      Item: updatedPost,
    });

    await docClient.send(command);
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const command = new DeleteCommand({
      TableName: TABLES.POSTS,
      Key: { id },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const command = new ScanCommand({
      TableName: TABLES.POSTS,
      ProjectionExpression: '#status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    });

    const response = await docClient.send(command);
    const posts = response.Items || [];

    return {
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => p.status === 'published').length,
      draftPosts: posts.filter((p) => p.status === 'draft').length,
      scheduledPosts: posts.filter((p) => p.status === 'scheduled').length,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}
