import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { AuthSession, User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d';
const COOKIE_NAME = 'auth_token';

// For development/demo - In production, this comes from Cognito/DynamoDB
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@lonecowry.com': {
    password: '$2a$10$XKrpOB.LKqwQB4j1q9DZXeJHKLKNxhPgQTpKwWZxWZ7Qz5V5xV5V5', // 'admin123' hashed
    user: {
      id: 'demo-admin-001',
      email: 'admin@lonecowry.com',
      name: 'Benedict Mbakogu',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  },
};

// Initialize demo user password (run once)
export async function initDemoUsers() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  DEMO_USERS['admin@lonecowry.com'].password = hashedPassword;
}

// Verify credentials and return user
export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  // Initialize demo users
  await initDemoUsers();

  const record = DEMO_USERS[email.toLowerCase()];
  if (!record) {
    return null;
  }

  const isValid = await bcrypt.compare(password, record.password);
  if (!isValid) {
    return null;
  }

  return record.user;
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthSession['user'] | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
    return decoded;
  } catch {
    return null;
  }
}

// Get current session from cookies (server-side)
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const user = verifyToken(token);
  if (!user) {
    return null;
  }

  // Decode to get expiry
  const decoded = jwt.decode(token) as { exp: number } | null;
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 86400000;

  return {
    user,
    accessToken: token,
    expiresAt,
  };
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return;
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

// Check if user has required role
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  // Admin has all permissions
  if (session.user.role === 'admin') return true;

  return session.user.role === requiredRole;
}

// Login function
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const user = await verifyCredentials(email, password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = generateToken(user);
  await setAuthCookie(token);

  return { success: true };
}

// Logout function
export async function logout(): Promise<void> {
  await clearAuthCookie();
}
