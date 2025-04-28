import { fetchAuthSession } from 'aws-amplify/auth';
import { Product } from '../types/product';
import { Producto } from '../models/types';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

console.log('API_ENDPOINT:', API_ENDPOINT);

async function getAuthToken(): Promise<string> {
  const session = await fetchAuthSession();
  return session.tokens?.accessToken?.toString() || '';
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const url = `${API_ENDPOINT}/productos`;
    console.log('Fetching productos from:', url);

    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Productos received:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error(`Error HTTP ${response.status}:`, errorText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Producto | null> {
  try {
    const url = `${API_ENDPOINT}/productos/${id}`;
    console.log('Fetching producto by id from:', url);

    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Producto received:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error(`Error HTTP ${response.status}:`, errorText);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    return null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const token = await getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const token = await getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const token = await getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/productos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}