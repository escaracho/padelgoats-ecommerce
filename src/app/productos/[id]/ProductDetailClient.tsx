'use client';

import { useCart } from '@/app/context/CartContext';
import { Producto } from '@/app/models/types';
import { useState } from 'react';

interface ProductDetailClientProps {
  producto: Producto;
}

export default function ProductDetailClient({ producto }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      ...producto,
      quantity,
    });
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <label htmlFor="quantity" className="mb-2 block font-semibold">
          Cantidad
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            id="quantity"
            min="1"
            max={producto.Stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), parseInt(producto.Stock)))}
            className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
          />
          <span className="text-sm text-gray-500">
            Disponible: {producto.Stock} unidades
          </span>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary"
        disabled={parseInt(producto.Stock) === 0}
      >
        {parseInt(producto.Stock) > 0 ? 'Agregar al carrito' : 'Agotado'}
      </button>
    </div>
  );
} 