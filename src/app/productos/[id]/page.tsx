import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductoById, getProductos } from '@/app/services/api';
import { Producto } from '@/app/models/types';
import ProductDetailClient from './ProductDetailClient';

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
  try {
    const { id } = await params;
    const producto = await getProductoById(id);
    
    if (!producto) {
      notFound();
    }

    const productoData: Producto = producto;
    
    // Get related products (same category, different product)
    const allProducts = await getProductos();
    const relatedProducts = allProducts
      .filter(p => p.Categoria === productoData.Categoria && p.ProductoID !== productoData.ProductoID)
      .slice(0, 4);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/productos" className="text-primary hover:underline">
            ← Volver a productos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
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
            {productoData.ImagenHoverURL && (
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={productoData.ImagenHoverURL}
                  alt={`${productoData.Nombre} - Vista adicional`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <p className="mb-2 text-sm text-gray-500">{productoData.Marca}</p>
            <h1 className="mb-4 text-3xl font-bold">{productoData.Nombre}</h1>
            <p className="mb-6 text-4xl font-bold">{formatPrice(productoData.Precio)}</p>
            
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Descripción</h2>
              <p className="text-gray-700">{productoData.Descripcion.replace(/"/g, '')}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Características</h2>
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                <li>Marca: {productoData.Marca}</li>
                <li>Categoría: {productoData.Categoria}</li>
                <li>Stock disponible: {productoData.Stock} unidades</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <p className={`font-semibold ${parseInt(productoData.Stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseInt(productoData.Stock) > 0 ? 'En stock' : 'Agotado'}
              </p>
            </div>
            
            <ProductDetailClient producto={productoData} />
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Productos Relacionados</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <Link
                  key={product.ProductoID}
                  href={`/productos/${product.ProductoID}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.ImagenURL}
                      alt={product.Nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">{product.Nombre}</h3>
                    <p className="text-xl font-bold">{formatPrice(product.Precio)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    throw error; // This will trigger the Next.js error page
  }
} 