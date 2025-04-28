'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = async () => {
    setLoading(true);
    // Aquí irá la lógica para agregar al carrito con AWS
    console.log(`Agregando producto ${productId} al carrito, cantidad: ${quantity}`);
    
    // Simular tiempo de carga
    setTimeout(() => {
      setLoading(false);
      alert('¡Producto agregado al carrito!');
    }, 800);
  };
  
  return (
    <button 
      className="w-full rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      onClick={handleAddToCart}
      disabled={loading || stock <= 0}
    >
      {loading ? 'Agregando...' : 'Agregar al carrito'}
    </button>
  );
} 