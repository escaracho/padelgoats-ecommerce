import { Producto } from '../models/types';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

console.log('API_ENDPOINT:', API_ENDPOINT);

export async function getProductos(): Promise<Producto[]> {
  try {
    const url = `${API_ENDPOINT}/productos`;
    console.log('Fetching productos from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', {
      'cors': response.headers.get('access-control-allow-origin'),
      'content-type': response.headers.get('content-type')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error HTTP: ${response.status}`);
      console.error('Error response:', errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('Productos received:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Producto | null> {
  try {
    const url = `${API_ENDPOINT}/productos/${id}`;
    console.log('Fetching producto by id from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error HTTP: ${response.status}`);
      console.error('Error response:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Producto data:', data);
    return data;
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    return null;
  }
}