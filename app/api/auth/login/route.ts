/**
 * API Route: POST /api/auth/login
 * Handles user authentication and creates HTTP-only cookie
 * Validates: Requirements 2.1, 2.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { SessionData } from '@/lib/auth/types';

// Secret key for JWT signing (should be in environment variables)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Token expiration time (24 hours)
const TOKEN_EXPIRATION = '24h';
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

/**
 * Login request body interface
 */
interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
interface LoginResponse {
  success: boolean;
  sessionId: string;
  userId: number;
  role: string;
  startedAt: string;
  lastActivity: string;
  message?: string;
}

/**
 * POST /api/auth/login
 * Authenticates user and creates HTTP-only cookie with JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database authentication
    // This is a placeholder for demonstration
    const isValidCredentials = await authenticateUser(username, password);

    if (!isValidCredentials) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Get user data (placeholder - replace with actual database query)
    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Generate session ID
    const sessionId = generateSessionId();
    const now = new Date();

    // Create JWT token payload
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      sessionId,
      iat: Math.floor(now.getTime() / 1000),
    };

    // Sign JWT token using jose library
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(TOKEN_EXPIRATION)
      .setIssuedAt()
      .sign(JWT_SECRET);

    // Create session data for response (to be stored in LocalStorage)
    const sessionData: SessionData = {
      sessionId,
      userId: user.id,
      role: user.role,
      startedAt: now,
      lastActivity: now,
    };

    // Create response with session data
    const response = NextResponse.json<LoginResponse>(
      {
        success: true,
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        role: sessionData.role,
        startedAt: sessionData.startedAt.toISOString(),
        lastActivity: sessionData.lastActivity.toISOString(),
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with secure attributes
    // Validates: Requirements 2.1, 2.4
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: TOKEN_MAX_AGE, // 24 hours
      path: '/', // Available for all routes
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Authenticate user credentials
 * TODO: Replace with actual database authentication
 */
async function authenticateUser(
  username: string,
  password: string
): Promise<boolean> {
  // Placeholder implementation
  // In production, this should:
  // 1. Query the database for the user
  // 2. Compare hashed passwords using bcrypt
  // 3. Return true if credentials are valid
  
  // For now, accept a test user
  return username === 'admin' && password === 'admin123';
}

/**
 * Get user by username
 * TODO: Replace with actual database query
 */
async function getUserByUsername(username: string): Promise<{
  id: number;
  username: string;
  role: string;
} | null> {
  // Placeholder implementation
  // In production, this should query the database
  
  if (username === 'admin') {
    return {
      id: 1,
      username: 'admin',
      role: 'admin',
    };
  }
  
  return null;
}
