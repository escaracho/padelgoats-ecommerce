'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
        
        if (groups.includes('admins')) {
          setIsAuthorized(true);
        } else {
          router.push('/'); // Redirect to home if not admin
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/'); // Redirect to home on error
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect anyway
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">Panel de Administración</h1>
        
        {/* Admin Navigation */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Gestión de Productos</h2>
            <div className="space-y-2">
              <button className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                Agregar Producto
              </button>
              <button className="w-full rounded bg-secondary px-4 py-2 text-white hover:bg-secondary/90">
                Listar Productos
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Gestión de Pedidos</h2>
            <div className="space-y-2">
              <button className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                Ver Pedidos
              </button>
              <button className="w-full rounded bg-secondary px-4 py-2 text-white hover:bg-secondary/90">
                Pedidos Pendientes
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Configuración</h2>
            <div className="space-y-2">
              <button className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
                Ajustes Generales
              </button>
              <button className="w-full rounded bg-secondary px-4 py-2 text-white hover:bg-secondary/90">
                Gestionar Usuarios
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Total Productos</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Ventas del Mes</h3>
            <p className="text-3xl font-bold text-primary">$0</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">Usuarios Registrados</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Actividad Reciente</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4">-</td>
                  <td className="whitespace-nowrap px-6 py-4">-</td>
                  <td className="whitespace-nowrap px-6 py-4">-</td>
                  <td className="whitespace-nowrap px-6 py-4">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 