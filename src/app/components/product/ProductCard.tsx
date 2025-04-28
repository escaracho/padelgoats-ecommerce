'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Producto } from '@/app/models/types';
import { useCart } from '@/app/context/CartContext';
import Toast from '@/app/components/ui/Toast';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();
  
  const formatPrice = (price: string) => {
    const numericPrice = parseInt(price);
    return `$${numericPrice.toLocaleString('es')}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart(producto);
    setShowToast(true);
  };

  return (
    <div 
      className={`card group ${parseInt(producto.Stock) === 0 ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/productos/${producto.ProductoID}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={isHovered ? producto.ImagenHoverURL : producto.ImagenURL}
            alt={producto.Nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.67vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {parseInt(producto.Stock) === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                Agotado
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <span className="mb-1 inline-block text-sm font-medium text-primary">
            {producto.Marca}
          </span>
          <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900">
            {producto.Nombre}
          </h3>
          <div className="flex items-baseline justify-between">
            <p className="text-base font-bold text-gray-900">
              {formatPrice(producto.Precio)}
            </p>
            {parseInt(producto.Stock) > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Stock
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {parseInt(producto.Stock) > 0 && (
        <button 
          onClick={handleAddToCart}
          className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white transition-colors hover:bg-secondary"
        >
          Agregar al carrito
        </button>
      )}

      {showToast && (
        <Toast 
          message="¡Producto agregado al carrito!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}