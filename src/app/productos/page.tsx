'use client';

import { getProductos } from '@/app/services/api';
import ProductCard from '@/app/components/product/ProductCard';
import ProductFilters from '@/app/components/product/ProductFilters';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  Forma?: string;
}

const BRANDS = [
  'Adidas', 'Nox', 'Bullpadel', 'Head', 'Vertex', 'AT10', 'Hack', 'Metalbone'
];
const SHAPES = ['Diamante', 'Redonda', 'Lágrima', 'Híbrida'];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('destacados');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrandsSidebar, setSelectedBrandsSidebar] = useState<string[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProductos();
        if (!data || data.length === 0) {
          setError('No se pudieron cargar los productos');
          return;
        }
        setProductos(data);
        setError(null);
      } catch (error) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Unified filtering logic
  useEffect(() => {
    let filtered = [...productos];
    if (inStockOnly) {
      filtered = filtered.filter(p => parseInt(p.Stock) > 0);
    }
    if (selectedBrand) {
      filtered = filtered.filter(p => p.Marca === selectedBrand);
    }
    if (selectedBrandsSidebar.length > 0) {
      filtered = filtered.filter(p => selectedBrandsSidebar.includes(p.Marca));
    }
    if (selectedShape) {
      filtered = filtered.filter(p => p.Forma === selectedShape);
    }
    // Sort: in-stock first, out-of-stock last
    filtered = filtered.sort((a, b) => {
      const stockA = parseInt(a.Stock);
      const stockB = parseInt(b.Stock);
      if (stockA > 0 && stockB === 0) return -1;
      if (stockA === 0 && stockB > 0) return 1;
      return 0;
    });
    setFilteredProducts(filtered);
  }, [productos, inStockOnly, selectedBrand, selectedBrandsSidebar, selectedShape]);

  // Brand/category pill filter
  const handleBrandPill = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedBrandsSidebar([]); // Clear sidebar brands when using pill
  };

  // Shape filter
  const handleShapeFilter = (shape: string) => {
    setSelectedShape(shape);
  };

  // Sort handler
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    let sorted = [...filteredProducts];
    switch (e.target.value) {
      case 'a-z':
        sorted.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        break;
      case 'z-a':
        sorted.sort((a, b) => b.Nombre.localeCompare(a.Nombre));
        break;
      case 'precio-asc':
        sorted.sort((a, b) => parseFloat(a.Precio) - parseFloat(b.Precio));
        break;
      case 'precio-desc':
        sorted.sort((a, b) => parseFloat(b.Precio) - parseFloat(a.Precio));
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBrand(null);
    setSelectedShape(null);
    setSelectedBrandsSidebar([]);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner/Header */}
      <div className="relative bg-gray-300 pb-10 pt-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/padel-banner.jpg)' }} />
        <div className="relative container mx-auto">
          <nav className="mb-2 text-xs text-gray-700 flex gap-2 items-center">
            <Link href="/" className="font-semibold">INICIO</Link>
            <span>/</span>
            <Link href="/productos" className="font-semibold">TIENDA</Link>
            <span>/</span>
            <span className="font-bold">PALAS</span>
          </nav>
          <h1 className="text-6xl font-extrabold tracking-tight text-white mb-8 uppercase drop-shadow">PALAS</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                className={`border border-white text-white px-5 py-2 rounded-md font-semibold uppercase tracking-wide hover:bg-white hover:text-gray-800 transition ${selectedBrand === brand ? 'bg-white text-gray-800' : ''}`}
                onClick={() => handleBrandPill(brand)}
              >
                {brand}
              </button>
            ))}
            <button
              className="ml-2 px-4 py-2 rounded-md border border-white text-white font-semibold hover:bg-white hover:text-gray-800 transition"
              onClick={resetFilters}
            >
              Limpiar filtros
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {SHAPES.map((shape) => (
              <button
                key={shape}
                className={`border border-white text-white px-4 py-1 rounded-md font-semibold uppercase tracking-wide hover:bg-white hover:text-gray-800 transition ${selectedShape === shape ? 'bg-white text-gray-800' : ''}`}
                onClick={() => handleShapeFilter(shape)}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-72 lg:w-80 shrink-0 order-1 md:order-none">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-8">
                <ProductFilters
                  productos={productos}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  selectedBrands={selectedBrandsSidebar}
                  setSelectedBrands={setSelectedBrandsSidebar}
                />
              </div>
            </div>
          </aside>
          {/* Product grid and sort */}
          <main className="flex-1 order-2 md:order-none">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-gray-700 font-bold text-lg uppercase tracking-wider">
                {filteredProducts.length} PRODUCTOS
              </div>
              <select
                value={sortBy}
                onChange={handleSort}
                className="border border-gray-300 rounded px-4 py-2 text-base font-semibold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="destacados">DESTACADOS</option>
                <option value="a-z">Alfabéticamente, A-Z</option>
                <option value="z-a">Alfabéticamente, Z-A</option>
                <option value="precio-asc">Precio, menor a mayor</option>
                <option value="precio-desc">Precio, mayor a menor</option>
              </select>
            </div>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No se encontraron productos</p>
                <p className="mt-2 text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {filteredProducts.map((producto) => (
                  <ProductCard key={producto.ProductoID} producto={producto} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
} 