import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductoById } from '@/app/services/api';
import { Producto } from '@/app/models/types';

const formatPrice = (price: string) => {
  const numericPrice = parseInt(price);
  return `$${numericPrice.toLocaleString('es')}`;
};

interface PageProps {
  params: {
    id: string;
  };
}

// Generate static paths for all products
export async function generateStaticParams() {
  // For static export, we'll use a fixed list of product IDs
  const productIds = ['1', '2', '3', '4', '5']; // Add all your product IDs here
  return productIds.map((id) => ({
    id: id,
  }));
}

export default async function ProductoDetalle({ params }: PageProps) {
  const id = params.id;
  const producto = await getProductoById(id);
  
  if (!producto) {
    notFound();
  }

  const productoData: Producto = producto;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-primary hover:underline">
          ← Volver a productos
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={productoData.ImagenURL}
            alt={productoData.Nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
        
        <div>
          <p className="mb-2 text-sm text-gray-500">{productoData.Marca}</p>
          <h1 className="mb-4 text-3xl font-bold">{productoData.Nombre}</h1>
          <p className="mb-6 text-4xl font-bold">{formatPrice(productoData.Precio)}</p>
          
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Descripción</h2>
            <p className="text-gray-700">{productoData.Descripcion.replace(/"/g, '')}</p>
          </div>
          
          <div className="mb-6">
            <p className={`font-semibold ${parseInt(productoData.Stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseInt(productoData.Stock) > 0 ? 'En stock' : 'Agotado'}
            </p>
          </div>
          
          {parseInt(productoData.Stock) > 0 && (
            <button className="w-full rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-secondary">
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
      
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Productos Relacionados</h2>
        {/* Aquí irían productos relacionados */}
      </section>
    </div>
  );
} 