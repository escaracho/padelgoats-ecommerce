'use client';

import { Producto } from '@/app/models/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Producto;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.ImagenURL}
          alt={product.Nombre}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/productos/${product.ProductoID}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.Nombre}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.Marca}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.Precio.toFixed(2)}</p>
      </div>
      <div className="mt-2">
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          product.Stock > 0 
            ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
            : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
        }`}>
          {product.Stock > 0 ? 'En stock' : 'Agotado'}
        </span>
      </div>
    </div>
  );
} 