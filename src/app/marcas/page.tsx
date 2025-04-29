'use client';

import Image from 'next/image';
import Link from 'next/link';

const brands = [
  {
    id: 'bullpadel',
    name: 'Bullpadel',
    description: 'Líder en innovación y diseño en el mundo del pádel.',
    image: '/brands/bullpadel.png',
    link: '/productos?marca=Bullpadel'
  },
  {
    id: 'head',
    name: 'HEAD',
    description: 'Tecnología de vanguardia para el rendimiento máximo.',
    image: '/brands/head.png',
    link: '/productos?marca=HEAD'
  },
  {
    id: 'adidas',
    name: 'Adidas',
    description: 'Fusión perfecta entre estilo y rendimiento.',
    image: '/brands/adidas.png',
    link: '/productos?marca=Adidas'
  },
  {
    id: 'nox',
    name: 'NOX',
    description: 'Calidad y tradición en cada pala.',
    image: '/brands/nox.png',
    link: '/productos?marca=NOX'
  },
  {
    id: 'siux',
    name: 'Siux',
    description: 'Innovación y potencia en cada golpe.',
    image: '/brands/siux.png',
    link: '/productos?marca=Siux'
  },
  {
    id: 'varlion',
    name: 'Varlion',
    description: 'Tecnología avanzada para jugadores exigentes.',
    image: '/brands/varlion.png',
    link: '/productos?marca=Varlion'
  }
];

export default function MarcasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Nuestras Marcas</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={brand.link}
            className="group block overflow-hidden rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex h-32 items-center justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                width={200}
                height={100}
                className="object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <h2 className="mb-2 text-xl font-semibold">{brand.name}</h2>
            <p className="text-gray-600">{brand.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 