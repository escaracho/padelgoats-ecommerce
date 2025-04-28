'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { confirmSignUp, resendConfirmationCode } from '@/app/services/auth';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await confirmSignUp(email, code);
      router.push('/auth/signin');
    } catch (error: any) {
      setError(error.message || 'Error al confirmar cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setResendSuccess(false);
    setIsResending(true);

    try {
      await resendConfirmationCode(email);
      setResendSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Error al reenviar código');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Confirmar cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Te hemos enviado un código de confirmación a tu email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-700">
                  Se ha enviado un nuevo código a tu email
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código de confirmación
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-gray-400"
              >
                {isLoading ? 'Confirmando...' : 'Confirmar cuenta'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="flex w-full justify-center text-sm font-medium text-primary hover:text-secondary"
            >
              {isResending ? 'Reenviando...' : 'Reenviar código'}
            </button>
          </div>

          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="flex w-full justify-center text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 