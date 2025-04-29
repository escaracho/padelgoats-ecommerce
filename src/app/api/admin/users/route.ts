import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock users data
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockUsers);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, role, status } = await request.json();
    
    // In a real application, you would update the user in your database
    const updatedUser = mockUsers.find(user => user.id === id);
    if (updatedUser) {
      if (role) updatedUser.role = role;
      if (status) updatedUser.status = status;
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
} 