import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Decode the JWT token
    const [header, payload] = token.split('.').map(part => {
      const decoded = Buffer.from(part, 'base64').toString('utf8');
      return JSON.parse(decoded);
    });

    // Get the user's groups from the token
    const groups = payload['cognito:groups'] as string[] || [];

    // Check if user is in the admins group
    const isAdmin = groups.includes('admins');
    if (!isAdmin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // If we reach here, the user is an admin
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 