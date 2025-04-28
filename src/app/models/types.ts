export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  brand: string;
  category: string;
}

export interface CartItem {
  productoId: string;
  cantidad: number;
  producto: Producto;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
  direccionEnvio: DireccionEnvio;
  fechaCreacion: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  direcciones: DireccionEnvio[];
}

export interface Producto {
  ProductoID: string;
  Categoria: string;
  Descripcion: string;
  ImagenHoverURL: string;
  ImagenURL: string;
  Marca: string;
  Nombre: string;
  Precio: string;
  Stock: string;
}

export interface DireccionEnvio {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
} 