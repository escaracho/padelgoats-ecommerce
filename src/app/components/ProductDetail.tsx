import { Producto } from '@/app/models/types';
import Image from 'next/image';

interface ProductDetailProps {
  producto: Producto;
}

export default function ProductDetail({ producto }: ProductDetailProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Imagen del producto */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <Image
              src={producto.ImagenURL}
              alt={producto.Nombre}
              width={500}
              height={500}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {producto.Nombre}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Información del producto</h2>
            <p className="text-3xl text-gray-900">${producto.Precio.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Descripción</h3>
            <div className="text-base text-gray-700 space-y-6">
              <p>{producto.Descripcion}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <p className="text-sm text-gray-500">
                {producto.Stock > 0 ? 'En stock' : 'Agotado'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={producto.Stock === 0}
              className={`w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                producto.Stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {producto.Stock > 0 ? 'Añadir al carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 