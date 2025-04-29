'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
        const hasAdminAccess = groups.includes('admins');

        if (!hasAdminAccess) {
          console.log('User is not an admin, redirecting to home');
          router.push('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Productos</h2>
          <p className="mb-4 text-gray-600">Gestiona los productos de la tienda</p>
          <button
            onClick={() => router.push('/admin/productos')}
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
          >
            Gestionar Productos
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Usuarios</h2>
          <p className="mb-4 text-gray-600">Administra los usuarios del sistema</p>
          <button
            onClick={() => router.push('/admin/usuarios')}
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
          >
            Gestionar Usuarios
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Pedidos</h2>
          <p className="mb-4 text-gray-600">Revisa y gestiona los pedidos</p>
          <button
            onClick={() => router.push('/admin/pedidos')}
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
          >
            Gestionar Pedidos
          </button>
        </div>
      </div>
    </div>
  );
} 