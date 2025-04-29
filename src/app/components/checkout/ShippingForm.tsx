'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/app/context/CartContext';

interface ShippingFormProps {
  onShippingCostChange: (cost: number) => void;
  onShippingDataChange: (data: ShippingData) => void;
  productos: Array<{
    alto: number;
    ancho: number;
    largo: number;
    peso: number;
    precio: number;
  }>;
}

export interface ShippingData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  codigoPostal: string;
  provincia: string;
  localidad: string;
  calle: string;
  numero: string;
  departamento?: string;
  piso?: string;
}

export default function ShippingForm({ onShippingCostChange, onShippingDataChange, productos }: ShippingFormProps) {
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    codigoPostal: '',
    provincia: '',
    localidad: '',
    calle: '',
    numero: '',
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...shippingData, [name]: value };
    setShippingData(newData);
    onShippingDataChange(newData);

    // Si cambia el código postal, validar y cotizar
    if (name === 'codigoPostal' && value.length === 4) {
      await validateAndQuoteShipping(value);
    }
  };

  const validateAndQuoteShipping = async (codigoPostal: string) => {
    setLoading(true);
    try {
      // Validar código postal
      const isValid = await andreaniService.validarCodigoPostal(codigoPostal);
      if (!isValid) {
        toast.error('Código postal no válido');
        onShippingCostChange(0);
        return;
      }

      // Cotizar envío
      const quote = await andreaniService.cotizarEnvio(codigoPostal, productos);
      onShippingCostChange(quote.tarifa);
      toast.success(`Costo de envío calculado: $${quote.tarifa}`);
    } catch (error) {
      console.error('Error al calcular envío:', error);
      toast.error('Error al calcular el costo de envío');
      onShippingCostChange(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCodigoPostalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigoPostal = e.target.value;
    setShippingData(prev => ({ ...prev, codigoPostal }));
    
    if (codigoPostal.length === 4) {
      try {
        // Simulate shipping cost calculation
        const shippingCost = 1000; // Replace with your own shipping cost calculation
        onShippingCostChange(shippingCost);
      } catch (error) {
        console.error('Error calculating shipping:', error);
        toast.error('Error al calcular el costo de envío');
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Información de Envío</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={shippingData.nombre}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={shippingData.apellido}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={shippingData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={shippingData.telefono}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Código Postal</label>
          <input
            type="text"
            name="codigoPostal"
            value={shippingData.codigoPostal}
            onChange={handleCodigoPostalChange}
            maxLength={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Provincia</label>
          <input
            type="text"
            name="provincia"
            value={shippingData.provincia}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Localidad</label>
          <input
            type="text"
            name="localidad"
            value={shippingData.localidad}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Calle</label>
          <input
            type="text"
            name="calle"
            value={shippingData.calle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Número</label>
          <input
            type="text"
            name="numero"
            value={shippingData.numero}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Departamento (opcional)</label>
          <input
            type="text"
            name="departamento"
            value={shippingData.departamento || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Piso (opcional)</label>
          <input
            type="text"
            name="piso"
            value={shippingData.piso || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Calculando costo de envío...</p>
        </div>
      )}
    </div>
  );
} 