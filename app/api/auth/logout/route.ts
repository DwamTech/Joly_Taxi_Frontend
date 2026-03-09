/**
 * API Route: POST /api/auth/logout
 * Handles user logout and clears HTTP-only cookie
 * Validates: Requirements 2.6, 2.7
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout response interface
 */
interface LogoutResponse {
  success: boolean;
  message?: string;
}

/**
 * POST /api/auth/logout
 * Clears the HTTP-only auth cookie
 * Client is responsible for clearing LocalStorage
 */
export async function POST(_request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json<LogoutResponse>(
      {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
      },
      { status: 200 }
    );

    // Clear the HTTP-only cookie by setting maxAge to 0
    // Validates: Requirements 2.6
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear the cookie
    const response = NextResponse.json<LogoutResponse>(
      {
        success: false,
        message: 'حدث خطأ أثناء تسجيل الخروج',
      },
      { status: 500 }
    );

    // Clear cookie anyway
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
}
