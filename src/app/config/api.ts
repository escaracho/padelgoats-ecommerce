const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not set. Using default API URL.');
}

export const API_CONFIG = {
  baseUrl: API_URL || 'http://localhost:3000/api',
  endpoints: {
    productos: '/getProductos',
    productoById: (id: string) => `/getProductoById/${id}`,
  },
}; 