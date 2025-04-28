import { Producto } from '../models/types';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

console.log('API_ENDPOINT:', API_ENDPOINT); // Debug log

export async function getProductos(): Promise<Producto[]> {
  try {
    console.log('Fetching productos from:', `${API_ENDPOINT}/productos`); // Debug log
    const response = await fetch(`${API_ENDPOINT}/productos`);
    
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      console.error('Response:', await response.text()); // Debug log
      return [];
    }
    
    const data = await response.json();
    console.log('Productos data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

export async function getProductoById(id: string): Promise<Producto | null> {
  try {
    console.log('Fetching producto by id from:', `${API_ENDPOINT}/productos/${id}`); // Debug log
    const response = await fetch(`${API_ENDPOINT}/productos/${id}`);
    
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status}`);
      console.error('Response:', await response.text()); // Debug log
      return null;
    }
    
    const data = await response.json();
    console.log('Producto data:', data); // Debug log
    return data;
  } catch (error) {
    console.error(`Error obteniendo producto ${id}:`, error);
    return null;
  }
}