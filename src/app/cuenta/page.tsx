"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { updateUserAttributes, fetchUserAttributes } from 'aws-amplify/auth';

interface UserForm {
  name: string;
  email: string;
  address: string;
  phone_number: string;
}

export default function Cuenta() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    address: '',
    phone_number: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadUserAttributes() {
      if (user) {
        try {
          const attributes = await fetchUserAttributes();
          console.log('User attributes:', attributes);
          setForm({
            name: attributes.name || '',
            email: attributes.email || '',
            address: attributes.address || '',
            phone_number: attributes.phone_number || '',
          });
        } catch (error) {
          console.error('Error fetching user attributes:', error);
        }
      }
    }
    if (isClient) {
      loadUserAttributes();
    }
  }, [user, isClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    // Validate required fields
    if (!form.address.trim()) {
      setError('La dirección es obligatoria');
      setSaving(false);
      return;
    }

    if (!form.phone_number.trim()) {
      setError('El teléfono es obligatorio');
      setSaving(false);
      return;
    }

    // Validate phone number format (E.164 format required by Cognito)
    if (!form.phone_number.startsWith('+')) {
      setError('El teléfono debe incluir el código de país (ej: +54)');
      setSaving(false);
      return;
    }

    try {
      const attributes = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone_number: form.phone_number.trim(),
      };

      // Only include non-empty attributes
      const updateAttributes = Object.entries(attributes).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      await updateUserAttributes({
        userAttributes: updateAttributes
      });

      // Refresh user attributes
      const updatedAttributes = await fetchUserAttributes();
      setForm(prev => ({
        ...prev,
        ...updatedAttributes,
      }));

      setSuccess('Datos actualizados correctamente.');
      setEditMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar los datos';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isClient || loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-64">Debes iniciar sesión para ver tu cuenta.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Mi cuenta</h1>
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editMode}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              disabled={!editMode}
              required
              placeholder="+541112345678"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
            />
            {editMode && (
              <p className="mt-1 text-sm text-gray-500">
                Incluye el código de país (ej: +54 para Argentina)
              </p>
            )}
          </div>
        </div>
        
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <form onSubmit={handleSave} className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </form>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 