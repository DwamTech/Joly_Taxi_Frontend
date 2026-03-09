# Authentication API Routes

This directory contains the authentication API routes for the Jolly Taxi Dashboard application.

## Overview

The authentication system uses JWT tokens stored in HTTP-only cookies for security, with non-sensitive session metadata stored in LocalStorage on the client side.

**Security Features:**
- HTTP-only cookies prevent JavaScript access to tokens
- Secure flag ensures HTTPS-only transmission in production
- SameSite=Strict prevents CSRF attacks
- JWT tokens with 24-hour expiration
- Server-side token validation

## API Endpoints

### POST /api/auth/login

Authenticates a user and creates an HTTP-only cookie with a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "sessionId": "1234567890-abc123",
  "userId": 1,
  "role": "admin",
  "startedAt": "2024-01-15T10:30:00.000Z",
  "lastActivity": "2024-01-15T10:30:00.000Z"
}
```

**Cookie Set:**
- Name: `auth_token`
- Value: JWT token
- HttpOnly: true
- Secure: true (in production)
- SameSite: Strict
- MaxAge: 86400 seconds (24 hours)
- Path: /

**Error Responses:**
- 400: Missing username or password
- 401: Invalid credentials
- 404: User not found
- 500: Server error

**Validates Requirements:** 2.1, 2.4

---

### POST /api/auth/logout

Logs out the user by clearing the HTTP-only cookie.

**Request:** No body required

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

**Cookie Cleared:**
- Name: `auth_token`
- Value: "" (empty)
- MaxAge: 0 (expires immediately)

**Error Response:**
- 500: Server error (cookie still cleared)

**Validates Requirements:** 2.6, 2.7

**Note:** Client is responsible for clearing LocalStorage data.

---

### GET /api/auth/validate

Validates the JWT token from the HTTP-only cookie and returns session data.

**Request:** No body required (token read from cookie)

**Success Response (200):**
```json
{
  "valid": true,
  "session": {
    "sessionId": "1234567890-abc123",
    "userId": 1,
    "role": "admin",
    "startedAt": "2024-01-15T10:30:00.000Z",
    "lastActivity": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**

401 - Token missing:
```json
{
  "valid": false,
  "message": "التوكن غير موجود"
}
```

401 - Token expired/invalid:
```json
{
  "valid": false,
  "message": "انتهت صلاحية الجلسة"
}
```

500 - Server error:
```json
{
  "valid": false,
  "message": "حدث خطأ في الخادم"
}
```

**Validates Requirements:** 4.5

**Note:** When validation fails, the invalid cookie is automatically cleared.

---

## Testing

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

**Validate:**
```bash
curl -X GET http://localhost:3000/api/auth/validate \
  -b cookies.txt
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

### Testing with Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to login page and submit credentials
4. Check the response headers for `Set-Cookie: auth_token=...`
5. Go to Application tab > Cookies to verify:
   - HttpOnly flag is checked
   - Secure flag is checked (in production)
   - SameSite is set to Strict

### Default Test Credentials

For development/testing purposes:
- Username: `admin`
- Password: `admin123`

**⚠️ Important:** Replace the placeholder authentication logic in production with actual database queries and password hashing (bcrypt).

---

## Security Considerations

1. **JWT Secret:** The JWT secret is currently using a default value. In production, set the `JWT_SECRET` environment variable to a strong, random secret.

2. **Password Hashing:** The current implementation uses placeholder authentication. In production, passwords must be hashed using bcrypt or similar.

3. **Database Integration:** Replace the placeholder user lookup functions with actual database queries.

4. **HTTPS Only:** In production, ensure the application runs over HTTPS so the Secure cookie flag works properly.

5. **Token Expiration:** Tokens expire after 24 hours. Implement refresh token logic if longer sessions are needed.

---

## Implementation Details

### Cookie Configuration

```typescript
{
  name: 'auth_token',
  value: token,
  httpOnly: true,              // Cannot be accessed via JavaScript
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'strict',          // CSRF protection
  maxAge: 86400,               // 24 hours in seconds
  path: '/',                   // Available for all routes
}
```

### JWT Token Payload

```typescript
{
  userId: number,
  username: string,
  role: string,
  sessionId: string,
  iat: number,                 // Issued at timestamp
  exp: number                  // Expiration timestamp
}
```

### Session Data (LocalStorage)

Only non-sensitive data is stored in LocalStorage:

```typescript
{
  sessionId: string,
  userId: number,
  role: string,
  startedAt: Date,
  lastActivity: Date
}
```

**Never stored in LocalStorage:**
- JWT tokens
- Passwords
- Sensitive user data

---

## Dependencies

- `jose`: Modern JWT library for Next.js (Edge Runtime compatible)
- `next`: Next.js framework with API routes support

---

## Related Files

- `/lib/auth/authContext.tsx` - Client-side authentication context
- `/lib/auth/authHelpers.ts` - Helper functions for session management
- `/lib/auth/types.ts` - TypeScript type definitions
- `/middleware.ts` - Route protection middleware

---

## Future Enhancements

1. Implement refresh token mechanism
2. Add rate limiting to prevent brute force attacks
3. Implement account lockout after failed attempts
4. Add two-factor authentication (2FA)
5. Implement session management (view/revoke active sessions)
6. Add audit logging for authentication events
