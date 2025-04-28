'use client';

import { useState, useEffect } from 'react';

interface Product {
  ProductoID: string;
  Nombre: string;
  Marca: string;
  Precio: string;
  Stock: string;
  Categoria: string;
  Descripcion: string;
  ImagenURL: string;
  ImagenHoverURL: string;
}

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export default function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const [sortBy, setSortBy] = useState('');
  const [brand, setBrand] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Get unique brands
  const brands = [...new Set(products?.map(p => p.Marca))];

  useEffect(() => {
    let filtered = [...products];

    // Filter by brand
    if (brand) {
      filtered = filtered.filter(p => p.Marca === brand);
    }

    // Filter by availability
    if (availableOnly) {
      filtered = filtered.filter(p => parseInt(p.Stock) > 0);
    }

    // Sort products
    switch (sortBy) {
      case 'precio-asc':
        filtered.sort((a, b) => parseFloat(a.Precio) - parseFloat(b.Precio));
        break;
      case 'precio-desc':
        filtered.sort((a, b) => parseFloat(b.Precio) - parseFloat(a.Precio));
        break;
      case 'nombre':
        filtered.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        break;
      default:
        // Default sort: available products first
        filtered.sort((a, b) => {
          const stockA = parseInt(a.Stock);
          const stockB = parseInt(b.Stock);
          if (stockA > 0 && stockB === 0) return -1;
          if (stockA === 0 && stockB > 0) return 1;
          return 0;
        });
    }

    onFilterChange(filtered);
  }, [sortBy, brand, availableOnly, products, onFilterChange]);

  return (
    <div className="flex justify-end">
      <div className="flex flex-wrap items-center gap-4">
        <select 
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
          <option value="nombre">Nombre</option>
        </select>

        <select 
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {brands.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 hover:cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary hover:cursor-pointer"
          />
          <span className="text-sm text-gray-700">Solo productos disponibles</span>
        </label>
      </div>
    </div>
  );
} 