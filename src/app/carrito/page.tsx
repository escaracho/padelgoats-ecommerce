'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Toast from '@/app/components/ui/Toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const formatPrice = (price: string) => {
  const numericPrice = parseInt(price);
  return `$${numericPrice.toLocaleString('es')}`;
};

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseInt(item.Precio) * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!data.url) {
        setError('Error al crear la sesión de pago');
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Carrito de Compras</h1>
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <h2 className="mb-4 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mb-6 text-gray-600">Agrega productos para verlos aquí</p>
          <Link 
            href="/productos"
            className="inline-block rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Carrito de Compras</h1>
      
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.ProductoID} className="flex gap-4 rounded-lg bg-white p-4 shadow">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.ImagenURL}
                    alt={item.Nombre}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.Nombre}</h3>
                      <p className="text-sm text-gray-500">{item.Marca}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.Precio)}</p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.ProductoID, item.quantity - 1)}
                        className="rounded-md bg-gray-100 px-2 py-1 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.ProductoID, item.quantity + 1)}
                        className="rounded-md bg-gray-100 px-2 py-1 text-gray-600 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
                        disabled={isLoading}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.ProductoID)}
                      className="text-sm text-red-600 hover:text-red-800 disabled:text-red-300"
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Resumen del Pedido</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateTotal().toString())}</span>
              </div>
              
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatPrice(calculateTotal().toString())}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-4 w-full rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Procesando...' : 'Proceder al Pago'}
              </button>
              
              <Link
                href="/productos"
                className="mt-2 block text-center text-sm text-primary hover:underline"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 