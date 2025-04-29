'use client';

import { getProductos } from './services/api';
import ProductCard from './components/product/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Producto } from './models/types';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProductos();
        // Ordenar productos: primero los que tienen stock
        const productosOrdenados = data?.sort((a, b) => {
          const stockA = parseInt(a.Stock);
          const stockB = parseInt(b.Stock);
          if (stockA > 0 && stockB === 0) return -1;
          if (stockA === 0 && stockB > 0) return 1;
          return 0;
        });
        setProductos(productosOrdenados || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner principal con imagen de fondo */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://padelgoats-images.s3.sa-east-1.amazonaws.com/BANNER+FINAL+1+copy.webp"
            alt="Banner Padel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
            PadelGoats
          </h1>
          <p className="mb-8 text-xl text-white md:text-2xl">
            Las mejores paletas de padel al mejor precio
          </p>
          <Link 
            href="/productos" 
            className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-secondary hover:scale-105"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Sección de categorías populares */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Categorías Populares</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Link href="/productos?categoria=principiante" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="https://padelgoats-images.s3.sa-east-1.amazonaws.com/logos/nox.jpg"
                  alt="Nox"
                  width={400}
                  height={300}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            
            <Link href="/productos?categoria=intermedio" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="https://padelgoats-images.s3.sa-east-1.amazonaws.com/logos/bullpadel.jpg"
                  alt="Bullpadel"
                  width={400}
                  height={300}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            
            <Link href="/productos?categoria=avanzado" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="https://padelgoats-images.s3.sa-east-1.amazonaws.com/logos/adidas.jpg"
                  alt="Adidas"
                  width={400}
                  height={300}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-4xl font-bold">Productos Destacados</h2>
            <Link 
              href="/productos" 
              className="text-primary hover:text-secondary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {loading ? (
              // Loading skeleton
              [...Array(12)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
              ))
            ) : (
              productos.filter(p => parseInt(p.Stock) > 0).slice(0, 12).map(producto => (
                <ProductCard key={producto.ProductoID} producto={producto} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Banner de beneficios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-3">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Envío Rápido</h3>
              <p className="text-gray-600">Entrega en 24-48hs</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-3">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Garantía Oficial</h3>
              <p className="text-gray-600">Productos 100% originales</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-3">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Pago Seguro</h3>
              <p className="text-gray-600">Múltiples métodos de pago</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-3">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Soporte 24/7</h3>
              <p className="text-gray-600">Atención personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">¡Suscríbete a nuestro newsletter!</h2>
            <p className="mb-8 text-lg text-white/90">Recibe las últimas novedades y ofertas exclusivas</p>
            <form className="mx-auto max-w-md">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 rounded-l-full px-6 py-3 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-r-full bg-secondary px-8 py-3 font-semibold text-white transition-colors hover:bg-secondary/90"
                >
                  Suscribirse
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}