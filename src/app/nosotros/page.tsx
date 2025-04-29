'use client';

import Image from 'next/image';

const values = [
  {
    title: 'Calidad',
    description: 'Ofrecemos productos de la más alta calidad, seleccionados cuidadosamente para satisfacer las necesidades de nuestros clientes.',
    icon: '✨'
  },
  {
    title: 'Pasión por el Pádel',
    description: 'Somos apasionados del pádel y nos esforzamos por compartir esta pasión con nuestra comunidad.',
    icon: '🎾'
  },
  {
    title: 'Servicio al Cliente',
    description: 'Nuestro compromiso es brindar la mejor experiencia de compra y atención al cliente.',
    icon: '🤝'
  },
  {
    title: 'Innovación',
    description: 'Siempre estamos buscando las últimas tendencias y tecnologías en el mundo del pádel.',
    icon: '🚀'
  }
];

const team = [
  {
    name: 'Juan Pérez',
    role: 'Fundador & CEO',
    image: '/team/juan.jpg',
    description: 'Apasionado del pádel con más de 15 años de experiencia en el sector.'
  },
  {
    name: 'María García',
    role: 'Directora de Marketing',
    image: '/team/maria.jpg',
    description: 'Experta en marketing digital y estrategias de crecimiento.'
  },
  {
    name: 'Carlos López',
    role: 'Especialista en Productos',
    image: '/team/carlos.jpg',
    description: 'Conocedor experto de equipamiento y accesorios de pádel.'
  }
];

export default function NosotrosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Sobre Nosotros</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          En PadelGoats, nos dedicamos a proporcionar el mejor equipamiento de pádel
          y una experiencia de compra excepcional para todos los amantes de este deporte.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Nuestra Misión</h2>
            <p className="mb-4 text-lg text-gray-600">
              Nuestra misión es hacer que el pádel sea accesible para todos,
              proporcionando productos de calidad y un servicio excepcional.
            </p>
            <p className="text-lg text-gray-600">
              Creemos en el poder del deporte para unir a las personas y mejorar
              su calidad de vida.
            </p>
          </div>
          <div className="relative aspect-video">
            <Image
              src="/about/mission.jpg"
              alt="Nuestra Misión"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Nuestros Valores</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-6 text-center"
            >
              <div className="mb-4 text-4xl">{value.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <div className="relative aspect-square">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-2 text-primary">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 