'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/app/services/dynamodb';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    Nombre: '',
    Marca: '',
    Precio: '',
    Stock: '',
    Categoria: '',
    Descripcion: '',
    ImagenURL: '',
    ImagenHoverURL: '',
    Estado: 'activo' as const,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        Nombre: product.Nombre || '',
        Marca: product.Marca || '',
        Precio: product.Precio || '',
        Stock: product.Stock || '',
        Categoria: product.Categoria || '',
        Descripcion: product.Descripcion || '',
        ImagenURL: product.ImagenURL || '',
        ImagenHoverURL: product.ImagenHoverURL || '',
        Estado: product.Estado || 'activo',
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="Nombre"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="Marca" className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            id="Marca"
            name="Marca"
            value={formData.Marca}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="Precio" className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <input
            type="text"
            id="Precio"
            name="Precio"
            value={formData.Precio}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="Stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="text"
            id="Stock"
            name="Stock"
            value={formData.Stock}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="Categoria" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            id="Categoria"
            name="Categoria"
            value={formData.Categoria}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="Estado" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="Estado"
            name="Estado"
            value={formData.Estado}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ImagenURL" className="block text-sm font-medium text-gray-700">
            URL de la Imagen Principal
          </label>
          <input
            type="url"
            id="ImagenURL"
            name="ImagenURL"
            value={formData.ImagenURL}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ImagenHoverURL" className="block text-sm font-medium text-gray-700">
            URL de la Imagen Hover
          </label>
          <input
            type="url"
            id="ImagenHoverURL"
            name="ImagenHoverURL"
            value={formData.ImagenHoverURL}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="Descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="Descripcion"
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
} 