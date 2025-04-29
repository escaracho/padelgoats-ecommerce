'use client';

import { useState } from 'react';

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
}

interface ProductFiltersProps {
  productos: Producto[];
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

export default function ProductFilters({ productos, inStockOnly, setInStockOnly, selectedBrands, setSelectedBrands }: ProductFiltersProps) {
  const [showBestsellers, setShowBestsellers] = useState(true);
  const [showBrands, setShowBrands] = useState(true);

  // Get unique brands from productos
  const brands = Array.from(new Set(productos.map(p => p.Marca)));

  // Handle brand checkbox
  const handleBrandChange = (brand: string) => {
    let updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
  };

  return (
    <div className="space-y-8">
      {/* EN STOCK */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="rounded border-gray-300"
          />
          En stock
        </label>
        <hr className="my-4 border-gray-200" />
      </div>
      {/* BESTSELLERS */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left uppercase font-bold text-xs text-gray-700 mb-3 tracking-widest hover:text-primary"
          onClick={() => setShowBestsellers(v => !v)}
        >
          <span>BESTSELLERS</span>
          <span className="text-base font-normal">{showBestsellers ? '-' : '+'}</span>
        </button>
        {showBestsellers && (
          <div className="pl-2 space-y-2 pb-2">
            <label className="flex items-center gap-2 text-gray-600 text-sm hover:text-primary cursor-pointer">
              <input type="checkbox" disabled className="rounded border-gray-300" />
              Palas más vendidas
            </label>
          </div>
        )}
        <hr className="my-4 border-gray-200" />
      </div>
      {/* MARCA */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left uppercase font-bold text-xs text-gray-700 mb-3 tracking-widest hover:text-primary"
          onClick={() => setShowBrands(v => !v)}
        >
          <span>MARCA</span>
          <span className="text-base font-normal">{showBrands ? '-' : '+'}</span>
        </button>
        {showBrands && (
          <div className="pl-2 space-y-2 max-h-56 overflow-y-auto pr-2 pb-2">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 text-gray-600 text-sm hover:text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="rounded border-gray-300"
                />
                {brand}
              </label>
            ))}
          </div>
        )}
        <hr className="my-4 border-gray-200" />
      </div>
    </div>
  );
} 