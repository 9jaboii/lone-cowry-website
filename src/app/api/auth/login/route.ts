import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Demo user for development
const DEMO_USER = {
  id: 'demo-admin-001',
  email: 'admin@lonecowry.com',
  name: 'Benedict Mbakogu',
  role: 'admin',
};

// POST /api/auth/login - Login
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check demo credentials
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const isValidEmail = body.email.toLowerCase() === 'admin@lonecowry.com';
    const isValidPassword = await bcrypt.compare(body.password, hashedPassword);

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign(
      {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        role: DEMO_USER.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: { user: DEMO_USER },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

// GET /api/auth/login - Check session
export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        name: string;
        role: string;
      };

      return NextResponse.json({
        success: true,
        data: { user: decoded },
      });
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
