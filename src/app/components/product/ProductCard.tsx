'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { Producto } from '@/app/models/types';
import { useCart } from '@/app/context/CartContext';
import Toast from '@/app/components/ui/Toast';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  
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
      className={`flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative p-4 ${parseInt(producto.Stock) === 0 ? 'opacity-60 grayscale' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Heart icon */}
      <button
        className="absolute top-5 right-5 z-10 bg-white/90 rounded-full p-2 shadow hover:bg-primary/10 transition"
        onClick={e => { e.preventDefault(); setIsFavorite(f => !f); }}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {isFavorite ? (
          <FaHeart className="text-red-500 w-6 h-6" />
        ) : (
          <FaRegHeart className="text-gray-400 w-6 h-6" />
        )}
      </button>
      <Link href={`/productos/${producto.ProductoID}`} className="flex-1 flex flex-col">
        <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          <Image
            src={isHovered ? producto.ImagenHoverURL : producto.ImagenURL}
            alt={producto.Nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.67vw"
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {parseInt(producto.Stock) === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
              <span className="rounded-full bg-red-600 px-6 py-2 text-lg font-extrabold uppercase tracking-wider text-white shadow-lg">
                AGOTADO
              </span>
            </div>
          )}
        </div>
        <span className="text-xs uppercase text-gray-400 font-bold mb-1 tracking-widest">{producto.Marca}</span>
        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{producto.Nombre}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-gray-900 uppercase">{formatPrice(producto.Precio)}</span>
          {parseInt(producto.Stock) > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 border border-green-300 shadow-sm uppercase">Stock</span>
          )}
        </div>
      </Link>
      {parseInt(producto.Stock) > 0 && (
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-center font-semibold text-white text-sm shadow transition-all hover:bg-secondary hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/50"
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