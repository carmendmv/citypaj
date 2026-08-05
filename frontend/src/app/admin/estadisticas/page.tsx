'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminEstadisticasPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.rol === 'admin';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) return;
    fetch('/api/admin/estadisticas', { headers })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error || 'Error');
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setLoading(false));
  }, [user, router, isAdmin, accessToken]);

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-700 mb-6">Solo administradores.</p>
        </div>
      </div>
    );
  }

  const Table = ({ rows, cols }: { rows: any[]; cols: { key: string; label: string }[] }) => (
    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            {cols.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(rows || []).map((row, i) => (
            <tr key={i} className="border-t border-gray-100">
              {cols.map((c) => (
                <td key={c.key} className="px-4 py-3">{row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Estadísticas</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-600 border border-gray-200 bg-white rounded-xl">Cargando estadísticas...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section>
                <h2 className="text-lg font-bold text-black mb-4">Anuncios por estado</h2>
                <Table rows={data?.anuncios_por_estado} cols={[{ key: 'estado', label: 'Estado' }, { key: 'total', label: 'Total' }]} />
              </section>
              <section>
                <h2 className="text-lg font-bold text-black mb-4">Usuarios por rol</h2>
                <Table rows={data?.usuarios_por_rol} cols={[{ key: 'rol', label: 'Rol' }, { key: 'total', label: 'Total' }]} />
              </section>
              <section>
                <h2 className="text-lg font-bold text-black mb-4">Categorías más usadas</h2>
                <Table rows={data?.anuncios_por_categoria} cols={[{ key: 'categoria', label: 'Categoría' }, { key: 'total', label: 'Total' }]} />
              </section>
              <section>
                <h2 className="text-lg font-bold text-black mb-4">Provincias con más anuncios</h2>
                <Table rows={data?.anuncios_por_provincia} cols={[{ key: 'provincia', label: 'Provincia' }, { key: 'total', label: 'Total' }]} />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
