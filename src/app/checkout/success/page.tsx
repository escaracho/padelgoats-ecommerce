'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h1 className="mb-4 text-3xl font-bold text-green-600">¡Pago Exitoso!</h1>
        <p className="mb-8 text-gray-600">
          Gracias por tu compra. Te enviaremos un correo con los detalles de tu pedido.
        </p>
        <Link
          href="/productos"
          className="inline-block rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary"
        >
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
} 