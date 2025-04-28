'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.user-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://padelgoats-images.s3.sa-east-1.amazonaws.com/LOGO+NARANJA.webp"
            alt="PadelGoats Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </Link>
        
        {/* Navegación */}
        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary">
            Inicio
          </Link>
          <Link href="/productos" className="text-sm font-medium text-gray-700 hover:text-primary">
            Paletas
          </Link>
          <Link href="/marcas" className="text-sm font-medium text-gray-700 hover:text-primary">
            Marcas
          </Link>
          <Link href="/nosotros" className="text-sm font-medium text-gray-700 hover:text-primary">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-gray-700 hover:text-primary">
            Contacto
          </Link>
        </nav>
        
        {/* Iconos de usuario y carrito */}
        <div className="flex items-center space-x-4">
          <div className="relative user-menu">
            {mounted && (
              <>
                {user ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className="flex items-center text-gray-700 hover:text-primary focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                ) : (
                  <Link href="/auth/signin" className="text-gray-700 hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}

                {/* Menú desplegable */}
                {isMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/cuenta"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <Link href="/carrito" className="text-gray-700 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
} 