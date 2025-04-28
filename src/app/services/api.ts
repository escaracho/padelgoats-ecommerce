import { Producto } from '../models/types';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

export async function getProductos(): Promise<Producto[]> {
  try {
    const response = await fetch(`${API_ENDPOINT}/productos`);
    
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Producto | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}/productos/${id}`);
    
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo producto ${id}:`, error);
    return null;
  }
}