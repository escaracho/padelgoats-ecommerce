'use client';

import { useRouter } from 'next/navigation';
import { withAdminAccess } from '@/components/withAdminAccess';

function AdminPage() {
  const router = useRouter();

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

export default withAdminAccess(AdminPage); 