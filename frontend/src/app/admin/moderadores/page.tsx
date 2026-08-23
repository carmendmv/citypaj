'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminModeradoresPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [moderadores, setModeradores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [creando, setCreando] = useState(false);

  const isAdmin = user?.rol === 'admin';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/moderadores?rol=moderador', { headers });
      const json = await res.json();
      if (json.success) setModeradores(json.data || []);
      else setError(json.error || 'Error');
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/moderadores', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error creando moderador');
      setForm({ nombre: '', email: '', password: '' });
      await cargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreando(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) return;
    cargar();
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Moderadores</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
          )}

          <form onSubmit={crear} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={creando}
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creando ? 'Creando...' : 'Crear moderador'}
            </button>
          </form>

          {loading ? (
            <div className="p-8 text-center text-gray-600 border border-gray-200 bg-white rounded-xl">Cargando...</div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">Nombre</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {moderadores.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-black">{u.nombre}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.creado_at ? new Date(u.creado_at).toLocaleDateString('es-ES') : '—'}</td>
                    </tr>
                  ))}
                  {moderadores.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay moderadores.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
