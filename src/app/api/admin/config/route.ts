import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock configuration data
const mockConfigs = [
  {
    id: '1',
    key: 'store_name',
    value: 'PadelGoats',
    description: 'Nombre de la tienda',
    type: 'text'
  },
  {
    id: '2',
    key: 'shipping_cost',
    value: '5.99',
    description: 'Costo de envío',
    type: 'number'
  },
  {
    id: '3',
    key: 'enable_reviews',
    value: 'true',
    description: 'Habilitar reseñas de productos',
    type: 'boolean'
  },
  {
    id: '4',
    key: 'default_currency',
    value: 'EUR',
    description: 'Moneda por defecto',
    type: 'select',
    options: ['EUR', 'USD', 'GBP']
  }
];

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockConfigs);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, value } = await request.json();
    
    // In a real application, you would update the configuration in your database
    const updatedConfig = mockConfigs.find(config => config.id === id);
    if (updatedConfig) {
      updatedConfig.value = value;
    }

    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating configuration' }, { status: 500 });
  }
} 