'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminActividadPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const isAdmin = user?.rol === 'admin';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) return;
    setLoading(true);
    fetch(`/api/admin/logs?page=${page}&limit=50`, { headers })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setLogs(json.data);
          setMeta(json.meta);
        }
      })
      .finally(() => setLoading(false));
  }, [user, router, isAdmin, accessToken, page]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Logs de actividad</h1>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600 border border-gray-200 bg-white rounded-xl">Cargando logs...</div>
          ) : (
            <>
              <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Usuario</th>
                      <th className="px-4 py-3 font-medium">Acción</th>
                      <th className="px-4 py-3 font-medium">Entidad</th>
                      <th className="px-4 py-3 font-medium">Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 whitespace-nowrap">{new Date(log.creado_at).toLocaleString('es-ES')}</td>
                        <td className="px-4 py-3">{log.nombre || log.email}</td>
                        <td className="px-4 py-3">{log.accion}</td>
                        <td className="px-4 py-3">{log.entidad}</td>
                        <td className="px-4 py-3">{log.detalle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {meta && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-black text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700">Página {page} de {Math.ceil((meta.total || 0) / meta.limit) || 1}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * meta.limit >= meta.total}
                    className="px-4 py-2 border border-black text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
