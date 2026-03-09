/**
 * API Route: GET /api/auth/validate
 * Validates JWT token from HTTP-only cookie
 * Validates: Requirements 4.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SessionData } from '@/lib/auth/types';

// Secret key for JWT verification (should match login route)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

/**
 * Token payload interface
 */
interface TokenPayload {
  userId: number;
  username: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

/**
 * Validation response interface
 */
interface ValidateResponse {
  valid: boolean;
  session?: {
    sessionId: string;
    userId: number;
    role: string;
    startedAt: string;
    lastActivity: string;
  };
  message?: string;
}

/**
 * GET /api/auth/validate
 * Validates the JWT token from HTTP-only cookie
 * Returns session data if valid, or error if invalid/expired
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json<ValidateResponse>(
        {
          valid: false,
          message: 'التوكن غير موجود',
        },
        { status: 401 }
      );
    }

    // Verify JWT token
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const tokenData = payload as unknown as TokenPayload;

      // Token is valid, create session data
      const now = new Date();
      const startedAt = new Date(tokenData.iat * 1000); // Convert from seconds to milliseconds

      const sessionData: SessionData = {
        sessionId: tokenData.sessionId,
        userId: tokenData.userId,
        role: tokenData.role,
        startedAt,
        lastActivity: now, // Update to current time
      };

      return NextResponse.json<ValidateResponse>(
        {
          valid: true,
          session: {
            sessionId: sessionData.sessionId,
            userId: sessionData.userId,
            role: sessionData.role,
            startedAt: sessionData.startedAt.toISOString(),
            lastActivity: sessionData.lastActivity.toISOString(),
          },
        },
        { status: 200 }
      );
    } catch (jwtError) {
      // JWT verification failed (expired, invalid signature, etc.)
      console.error('JWT verification failed:', jwtError);

      // Clear the invalid cookie
      const response = NextResponse.json<ValidateResponse>(
        {
          valid: false,
          message: 'انتهت صلاحية الجلسة',
        },
        { status: 401 }
      );

      // Clear the invalid token cookie
      response.cookies.set({
        name: 'auth_token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      return response;
    }
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json<ValidateResponse>(
      {
        valid: false,
        message: 'حدث خطأ في الخادم',
      },
      { status: 500 }
    );
  }
}
