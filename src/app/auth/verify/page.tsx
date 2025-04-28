'use client';

import { useState, useEffect } from 'react';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'Error verifying email');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      alert('Verification code has been resent to your email');
    } catch (err: any) {
      setError(err.message || 'Error resending code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificar email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por favor, ingresa el código de verificación enviado a tu email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="code" className="sr-only">
                Código de verificación
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Código de verificación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Verificar email
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="font-medium text-primary hover:text-primary-dark"
            >
              Reenviar código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 