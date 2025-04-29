import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only run middleware on admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
      
      if (!groups.includes('admins')) {
        // Redirect to home if user is not in admin group
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error: unknown) {
      // Log the error for debugging purposes
      console.error('Authentication error:', error);
      // Redirect to home if there's any error (including not being authenticated)
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}; 