import AWS from 'aws-sdk';

// Configure AWS
const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

// Set AWS config
AWS.config.update(awsConfig);

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient(awsConfig);

export interface Product {
  ProductoID: string;
  Categoria: string;
  Descripcion: string;
  ImagenHoverURL: string;
  ImagenURL: string;
  Marca: string;
  Nombre: string;
  Precio: number;
  Stock: number;
}

export async function getProductos(): Promise<Product[]> {
  try {
    const response = await fetch('/api/productos');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/productos/${id}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'ProductoID'>): Promise<Product> {
  try {
    const response = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
} 