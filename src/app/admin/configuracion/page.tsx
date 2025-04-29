'use client';

import { useState, useEffect } from 'react';
import { withAdminAccess } from '@/components/withAdminAccess';

interface Config {
  id: string;
  key: string;
  value: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

function ConfigPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (!response.ok) {
        throw new Error('Error al cargar la configuración');
      }
      const data = await response.json();
      setConfigs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (config: Config) => {
    try {
      const response = await fetch(`/api/admin/config/${config.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: config.value }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la configuración');
      }

      setConfigs(configs.map(c => 
        c.id === config.id ? config : c
      ));
      setEditingConfig(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleInputChange = (config: Config, value: string) => {
    setEditingConfig({
      ...config,
      value,
    });
  };

  const renderConfigInput = (config: Config) => {
    if (config.type === 'boolean') {
      return (
        <select
          value={config.value}
          onChange={(e) => handleInputChange(config, e.target.value)}
          className="rounded-md border-gray-300 text-sm"
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (config.type === 'select' && config.options) {
      return (
        <select
          value={config.value}
          onChange={(e) => handleInputChange(config, e.target.value)}
          className="rounded-md border-gray-300 text-sm"
        >
          {config.options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={config.type === 'number' ? 'number' : 'text'}
        value={config.value}
        onChange={(e) => handleInputChange(config, e.target.value)}
        className="rounded-md border-gray-300 text-sm"
      />
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Configuración del Sistema</h1>

      <div className="space-y-6">
        {configs.map((config) => (
          <div key={config.id} className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{config.key}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              {renderConfigInput(config)}
              <button
                onClick={() => updateConfig(config)}
                className="rounded-md bg-primary px-3 py-1 text-sm text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAdminAccess(ConfigPage); 