'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div>
      {/* Admin Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                PadelGoats Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/admin')}`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/productos"
                className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/admin/productos')}`}
              >
                Productos
              </Link>
              <Link
                href="/admin/pedidos"
                className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/admin/pedidos')}`}
              >
                Pedidos
              </Link>
              <Link
                href="/admin/usuarios"
                className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/admin/usuarios')}`}
              >
                Usuarios
              </Link>
              <Link
                href="/admin/configuracion"
                className={`rounded-md px-3 py-2 text-sm font-medium ${isActive('/admin/configuracion')}`}
              >
                Configuración
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}
    </div>
  );
} 