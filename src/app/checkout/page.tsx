'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { stripePromise } from '@/app/lib/stripe';
import { toast } from 'react-hot-toast';
import ShippingForm, { ShippingData } from '../components/checkout/ShippingForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems } = useCart();
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (totalItems === 0) {
      router.push('/carrito');
    }
  }, [totalItems, router]);

  const handleShippingCostChange = (cost: number) => {
    setShippingCost(cost);
  };

  const handleShippingDataChange = (data: ShippingData) => {
    setShippingData(data);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      if (!shippingData) {
        toast.error('Por favor, complete los datos de envío');
        return;
      }

      // Crear sesión de Stripe con el costo de envío incluido
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingCost,
          shippingData
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Error al procesar el pago');
      }

      // Redirigir a Stripe
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseInt(item.Precio) * item.quantity);
    }, 0);
  };

  const totalConEnvio = calculateTotal() + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="space-y-8">
          {/* Resumen del carrito */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Resumen del Pedido</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.ProductoID} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.Nombre}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(parseInt(item.Precio) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="font-medium">${calculateTotal().toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p>Envío</p>
                  <p className="font-medium">${shippingCost.toLocaleString()}</p>
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-semibold">${totalConEnvio.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de envío */}
          <div className="rounded-lg bg-white p-6 shadow">
            <ShippingForm
              onShippingCostChange={handleShippingCostChange}
              onShippingDataChange={handleShippingDataChange}
              productos={items.map(item => ({
                alto: 10, // Ajustar según las dimensiones reales del producto
                ancho: 20,
                largo: 30,
                peso: 1, // Ajustar según el peso real del producto
                precio: parseInt(item.Precio)
              }))}
            />
          </div>

          {/* Botón de pago */}
          <div className="flex justify-end">
            <button
              onClick={handleCheckout}
              disabled={loading || !shippingData || shippingCost === 0}
              className="rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                `Pagar $${totalConEnvio.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 