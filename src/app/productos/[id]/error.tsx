'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product detail page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-bold">Algo salió mal</h2>
        <p className="text-gray-600">
          Lo sentimos, hubo un problema al cargar los detalles del producto.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
} 