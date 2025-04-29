import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth';

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware - Admin route detected');
    
    try {
      const session = await fetchAuthSession();
      console.log('Middleware - Session:', session);

      if (!session) {
        console.log('Middleware - No session found, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Get user groups from the Cognito token
      const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
      console.log('Middleware - User groups:', groups);

      // Check if user is in the admins group
      const isAdmin = groups.includes('admins');
      console.log('Middleware - Is admin:', isAdmin);

      if (!isAdmin) {
        console.log('Middleware - User is not an admin, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('Middleware - Admin access granted');
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware - Error checking admin access:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 