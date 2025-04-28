import { Producto } from '../models/types';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

console.log('API_ENDPOINT:', API_ENDPOINT);

export async function getProductos(): Promise<Producto[]> {
  try {
    const url = `${API_ENDPOINT}/productos`;
    console.log('Fetching productos from:', url);

    // Simple fetch with minimal configuration
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

    // Simple fetch with minimal configuration
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