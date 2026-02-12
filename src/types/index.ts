// Blog Post types
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  categoryLabel: string;
  status: PostStatus;
  author: string;
  authorId: string;
  featuredImage?: string;
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  icon?: string;
  gradient?: string;
}

export type PostCategory =
  | 'ai-ml'
  | 'defense'
  | 'quantum'
  | 'data'
  | 'cybersecurity'
  | 'telecom';

export type PostStatus = 'draft' | 'published' | 'scheduled';

export interface CreatePostInput {
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  categoryLabel: string;
  status: PostStatus;
  author: string;
  authorId: string;
  featuredImage?: string;
  scheduledFor?: string;
  readTime?: number;
  tags?: string[];
  icon?: string;
  gradient?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'admin' | 'editor';

// Auth types
export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  accessToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}

// Dashboard stats
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
}

// Category info for UI
export const CATEGORY_INFO: Record<PostCategory, { label: string; color: string }> = {
  'ai-ml': { label: 'AI & ML', color: '#F5C842' },
  'defense': { label: 'Defense', color: '#D43F2F' },
  'quantum': { label: 'Quantum', color: '#2A2F8F' },
  'data': { label: 'Data Engineering', color: '#2DB87C' },
  'cybersecurity': { label: 'Cybersecurity', color: '#E8912A' },
  'telecom': { label: 'Telecom', color: '#3BBFEF' },
};
