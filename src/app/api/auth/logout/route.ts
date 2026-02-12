import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout - Logout
export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json({
      success: true,
      data: { loggedOut: true },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
