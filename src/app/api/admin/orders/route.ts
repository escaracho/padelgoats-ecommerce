import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    customerEmail: 'customer@example.com',
    total: 99.99,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z',
    shippingData: {
      nombre: 'John',
      apellido: 'Doe',
      email: 'customer@example.com',
      telefono: '123456789',
      codigoPostal: '28001',
      provincia: 'Madrid',
      localidad: 'Madrid',
      calle: 'Calle Mayor',
      numero: '1'
    }
  },
  {
    id: '2',
    customerEmail: 'another@example.com',
    total: 149.99,
    status: 'processing',
    createdAt: '2024-01-02T00:00:00Z',
    shippingData: {
      nombre: 'Jane',
      apellido: 'Smith',
      email: 'another@example.com',
      telefono: '987654321',
      codigoPostal: '08001',
      provincia: 'Barcelona',
      localidad: 'Barcelona',
      calle: 'Passeig de Gràcia',
      numero: '2'
    }
  }
];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockOrders);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    
    // In a real application, you would update the order in your database
    const updatedOrder = mockOrders.find(order => order.id === id);
    if (updatedOrder) {
      updatedOrder.status = status;
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
} 