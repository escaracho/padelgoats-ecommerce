export interface Product {
  ProductoID: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  marca: string;
  estado: 'activo' | 'inactivo';
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
} 