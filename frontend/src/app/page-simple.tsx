'use client';

import { useState } from 'react';

export default function SimplePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/anuncios');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
      // Also log to console for debugging
      console.log('API Response:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-4">CityPAJ</h1>
      <p className="text-lg text-gray-700 mb-8">Tu ciudad, tus anuncios, tu comunidad</p>
      
      <div className="mt-8 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">API Test</h2>
        
        <button 
          onClick={testAPI}
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Cargando...' : 'Test API'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <h3 className="font-semibold mb-2">✅ API Response:</h3>
            <div className="text-sm">
              <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
              <p><strong>Total anuncios:</strong> {result.data?.anuncios?.length || 0}</p>
              {result.data?.pagination && (
                <p><strong>Pagination:</strong> Page {result.data.pagination.page} of {result.data.pagination.totalPages}</p>
              )}
            </div>
            
            {result.data?.anuncios?.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer font-semibold">Ver detalles de anuncios ({result.data.anuncios.length} recibidos)</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
                  {JSON.stringify(result.data.anuncios, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <h3 className="font-semibold mb-2">📋 Información del sistema:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Frontend:</strong> http://localhost:3003</p>
            <p><strong>Backend:</strong> http://localhost:3002</p>
            <p><strong>API Proxy:</strong> /api/anuncios</p>
            <p><strong>Base de datos:</strong> citypaj_db</p>
          </div>
        </div>
      </div>
    </div>
  );
}
