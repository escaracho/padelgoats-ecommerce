import { fetchAuthSession } from 'aws-amplify/auth';
import { Product } from '../types/product';
import { Producto } from '../models/types';

// Ensure the API endpoint is properly configured
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://o2pex6f0uj.execute-api.sa-east-1.amazonaws.com/prod';

console.log('Using API endpoint:', API_ENDPOINT);

async function getAuthToken(): Promise<string> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const url = `${API_ENDPOINT}/productos`;
    console.log('Fetching productos from:', url);

    const response = await fetch(url);
    
    if (!response) {
      console.error('No response received from the server');
      return [];
    }
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error(`Error HTTP ${response.status}`);
      return [];
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('Parsed JSON response:', data);
    } else {
      const text = await response.text();
      console.log('Raw response:', text);
      
      try {
        // Try parsing as JSON even if content-type is not set correctly
        data = JSON.parse(text);
        console.log('Parsed JSON from text:', data);
      } catch (e) {
        console.log('Response is not JSON, trying CSV format');
        const lines = text.split('\n');
        console.log('Number of lines:', lines.length);
        
        if (lines.length < 2) {
          console.error('Not enough lines in response');
          return [];
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        console.log('Headers:', headers);

        data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
            return {
              ProductoID: values[0],
              Categoria: values[1],
              Descripcion: values[2],
              ImagenHoverURL: values[3],
              ImagenURL: values[4],
              Marca: values[5],
              Nombre: values[6],
              Precio: values[7],
              Stock: values[8]
            };
          });
      }
    }

    if (!Array.isArray(data)) {
      console.error('Response is not an array:', data);
      return [];
    }

    console.log('Number of productos:', data.length);
    console.log('First producto:', data[0]);
    
    return data;
  } catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Producto | null> {
  try {
    const productos = await getProductos();
    const producto = productos.find(p => p.ProductoID === id);
    console.log('Found producto by id:', producto);
    return producto || null;
  } catch (error) {
    console.error('Error fetching producto:', error);
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