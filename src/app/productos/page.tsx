'use client';

import { getProductos } from '@/app/services/api';
import ProductCard from '@/app/components/product/ProductCard';
import ProductFilters from '@/app/components/product/ProductFilters';
import { useState, useEffect } from 'react';

interface Producto {
  ProductoID: string;
  Nombre: string;
  Marca: string;
  Precio: string;
  Stock: string;
  Categoria: string;
  Descripcion: string;
  ImagenURL: string;
  ImagenHoverURL: string;
  // Add other product fields as needed
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProductos();
        setProductos(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
          <p className="mt-2 text-gray-600">
            Encuentra la paleta perfecta para tu juego
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtros y contador de productos */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredProducts?.length || 0} productos encontrados
          </p>
          <ProductFilters 
            products={productos} 
            onFilterChange={setFilteredProducts}
          />
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredProducts?.map(producto => (
              <ProductCard 
                key={producto.ProductoID} 
                producto={producto}
              />
            ))}
          </div>
        )}

        {/* Mensaje si no hay productos */}
        {(!loading && (!filteredProducts || filteredProducts.length === 0)) && (
          <div className="mt-8 rounded-lg bg-white p-8 text-center shadow">
            <p className="text-xl text-gray-600">No se encontraron productos</p>
            <p className="mt-2 text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
} 