'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Shield, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';
import Pagination from '@/components/ui/Pagination';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  verificado: number;
  rol: string;
  creado_at: string;
}

const ROLES = [
  { value: 'user', label: 'Usuario' },
  { value: 'moderador', label: 'Moderador' },
  { value: 'admin', label: 'Administrador' },
];

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const isAdmin = user?.rol === 'admin';

  const cargar = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (rolFiltro) params.set('rol', rolFiltro);

      const res = await fetch(`/api/admin/usuarios?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      const json = await res.json();
      if (json.success) {
        setUsuarios(json.data || []);
        setMeta(json.meta || { page: 1, limit: 20, total: 0 });
      } else {
        setError(json.error || 'Error cargando usuarios');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (id: string, nuevoRol: string) => {
    try {
      const res = await fetch(`/api/admin/usuarios/${id}/rol`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      const json = await res.json();
      if (json.success) {
        await cargar();
      } else {
        setError(json.error || 'Error actualizando rol');
      }
    } catch (err) {
      setError('Error de conexión al actualizar rol');
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) return;
    cargar();
  }, [user, isAdmin, page, debouncedSearch, rolFiltro, accessToken, router]);

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso denegado</h1>
          <p className="text-sm text-gray-700 mb-6">Esta sección es solo para administradores.</p>
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 text-sm hover:bg-orange-500 hover:text-black transition-colors"
          >
            Volver al panel
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
              <Users className="w-7 h-7" />
              Gestión de usuarios
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <select
                value={rolFiltro}
                onChange={(e) => { setRolFiltro(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm border border-black bg-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Todos los roles</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">
              Cargando usuarios...
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700">Nombre</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Verificado</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Rol</th>
                      <th className="px-4 py-3 font-medium text-gray-700">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-black">{u.nombre || 'Sin nombre'}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          {u.verificado ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Sí
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={u.rol}
                              onChange={(e) => cambiarRol(u.id, e.target.value)}
                              className="px-2 py-1 text-xs border border-black bg-white focus:border-orange-500 focus:outline-none"
                            >
                              {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                              ))}
                            </select>
                            {u.rol === 'admin' && <Shield className="w-4 h-4 text-orange-500" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {u.creado_at ? new Date(u.creado_at).toLocaleDateString('es-ES') : '—'}
                        </td>
                      </tr>
                    ))}
                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No se encontraron usuarios.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
