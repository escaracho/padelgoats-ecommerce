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
    Forma: '' as const,
  });
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

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
        Forma: product.Forma || '',
      });
      // Load additional attributes if present
      const extraAttrs = Object.entries(product)
        .filter(([k]) => !['Nombre','Marca','Precio','Stock','Categoria','Descripcion','ImagenURL','ImagenHoverURL','Estado','ProductoID','Forma'].includes(k))
        .map(([key, value]) => ({ key, value: String(value) }));
      setAttributes(extraAttrs);
    } else {
      setAttributes([]);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttrChange = (idx: number, field: 'key' | 'value', value: string) => {
    setAttributes(attrs => attrs.map((attr, i) => i === idx ? { ...attr, [field]: value } : attr));
  };

  const handleAddAttr = () => {
    setAttributes(attrs => [...attrs, { key: '', value: '' }]);
  };

  const handleRemoveAttr = (idx: number) => {
    setAttributes(attrs => attrs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Merge additional attributes into formData
    const extraAttrs = attributes.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    onSubmit({ ...formData, ...extraAttrs });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl" onClick={onCancel} type="button">✕</button>
        <h2 className="text-lg font-bold mb-4 text-center">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <div>
              <label htmlFor="Nombre" className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" id="Nombre" name="Nombre" value={formData.Nombre} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Marca" className="block text-xs font-medium text-gray-700 mb-1">Marca</label>
              <input type="text" id="Marca" name="Marca" value={formData.Marca} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Precio" className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
              <input type="text" id="Precio" name="Precio" value={formData.Precio} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Stock" className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
              <input type="text" id="Stock" name="Stock" value={formData.Stock} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Categoria" className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
              <input type="text" id="Categoria" name="Categoria" value={formData.Categoria} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Estado" className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
              <select id="Estado" name="Estado" value={formData.Estado} onChange={handleChange} className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label htmlFor="ImagenURL" className="block text-xs font-medium text-gray-700 mb-1">URL de la Imagen Principal</label>
              <input type="url" id="ImagenURL" name="ImagenURL" value={formData.ImagenURL} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="ImagenHoverURL" className="block text-xs font-medium text-gray-700 mb-1">URL de la Imagen Hover</label>
              <input type="url" id="ImagenHoverURL" name="ImagenHoverURL" value={formData.ImagenHoverURL} onChange={handleChange} required className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Descripcion" className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
              <textarea id="Descripcion" name="Descripcion" value={formData.Descripcion} onChange={handleChange} required rows={2} className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="Forma" className="block text-xs font-medium text-gray-700 mb-1">Forma</label>
              <select
                id="Forma"
                name="Forma"
                value={formData.Forma || ''}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Seleccionar forma</option>
                <option value="Diamante">Diamante</option>
                <option value="Redonda">Redonda</option>
                <option value="Lágrima">Lágrima</option>
                <option value="Híbrida">Híbrida</option>
              </select>
            </div>
          </div>
          {/* Additional Attributes */}
          <div className="pt-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Atributos adicionales</span>
              <button type="button" onClick={handleAddAttr} className="text-primary text-xs font-bold hover:underline">+ Añadir atributo</button>
            </div>
            {attributes.map((attr, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input type="text" placeholder="Clave" value={attr.key} onChange={e => handleAttrChange(idx, 'key', e.target.value)} className="w-1/3 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-primary focus:ring-primary" />
                <input type="text" placeholder="Valor" value={attr.value} onChange={e => handleAttrChange(idx, 'value', e.target.value)} className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-primary focus:ring-primary" />
                <button type="button" onClick={() => handleRemoveAttr(idx)} className="text-xs text-red-500 font-bold px-2">✕</button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Cancelar</button>
            <button type="submit" className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
} 