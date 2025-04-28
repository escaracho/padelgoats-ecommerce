import { Producto } from '../models/types';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || '';

console.log('API_ENDPOINT:', API_ENDPOINT);

async function getAuthToken() {
  try {
    console.log('Fetching auth session...');
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken.toString();
    console.log('Auth token obtained:', token ? 'Token present' : 'No token');
    return token;
  } catch (error) {
    console.error('Error getting auth session:', error);
    return null;
  }
}

export async function getProductos(): Promise<Producto[]> {
  try {
    console.log('Getting auth token for productos request...');
    const token = await getAuthToken();
    if (!token) {
      console.error('Authentication required: No token available');
      throw new Error('User needs to be authenticated');
    }

    const url = `${API_ENDPOINT}/productos`;
    console.log('Fetching productos from:', url);
    console.log('Request headers:', {
      'Authorization': 'Bearer [token hidden]',
      'Content-Type': 'application/json'
    });

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User needs to be authenticated');
    }

    console.log('Fetching producto by id from:', `${API_ENDPOINT}/productos/${id}`); // Debug log
    const response = await fetch(`${API_ENDPOINT}/productos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
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