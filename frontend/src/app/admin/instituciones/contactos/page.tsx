'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, X, Search, Check, Edit, Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Contacto {
  id: number;
  institucion: string;
  tipo: string;
  area_departamento: string | null;
  provincia: string | null;
  comunidad_autonoma: string | null;
  email_oficial: string | null;
  telefono: string | null;
  web: string | null;
  persona_contacto: string | null;
  estado: string;
  verificado: number;
  notas_internas: string | null;
}

const TIPOS = ['ayuntamiento', 'diputacion', 'area_juventud', 'area_cultura', 'area_participacion', 'oficina_comarcal', 'entidad_publica', 'otro'];

export default function AdminContactosPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Contacto>>({
    institucion: '',
    tipo: 'ayuntamiento',
    area_departamento: '',
    provincia: '',
    comunidad_autonoma: '',
    email_oficial: '',
    telefono: '',
    web: '',
    persona_contacto: '',
    notas_internas: '',
    estado: 'pendiente',
    verificado: 0,
  });
  const [mostrarForm, setMostrarForm] = useState(false);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchContactos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contactos-institucionales?q=${encodeURIComponent(q)}&limit=100`, { headers });
      const json = await res.json();
      if (json.success) setContactos(json.data as Contacto[]);
    } catch {
      setError('Error cargando contactos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/admin/acceder');
      return;
    }
    if (!isAdmin) {
      router.replace('/admin');
      return;
    }
    fetchContactos();
  }, [user, q, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/admin/contactos-institucionales', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          verificado: form.verificado ? 1 : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error guardando contacto');
      setForm({
        institucion: '',
        tipo: 'ayuntamiento',
        area_departamento: '',
        provincia: '',
        comunidad_autonoma: '',
        email_oficial: '',
        telefono: '',
        web: '',
        persona_contacto: '',
        notas_internas: '',
        estado: 'pendiente',
        verificado: 0,
      });
      setMostrarForm(false);
      fetchContactos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verificar = async (id: number) => {
    try {
      await fetch(`/api/admin/contactos-institucionales/${id}/verificar`, { method: 'PATCH', headers });
      fetchContactos();
    } catch {
      // ignore
    }
  };

  const desactivar = async (id: number) => {
    if (!confirm('¿Desactivar este contacto?')) return;
    try {
      await fetch(`/api/admin/contactos-institucionales/${id}`, { method: 'DELETE', headers });
      fetchContactos();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-7 h-7 text-orange-500" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Agenda institucional</h1>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="inline-flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              {mostrarForm ? 'Cerrar' : 'Nuevo contacto'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por institución, área, provincia, email..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white focus:outline-none"
            />
          </div>

          {mostrarForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institución *</label>
                  <input
                    value={form.institucion}
                    onChange={(e) => setForm({ ...form, institucion: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área / Departamento</label>
                  <input
                    value={form.area_departamento || ''}
                    onChange={(e) => setForm({ ...form, area_departamento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                  <input
                    value={form.provincia || ''}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comunidad autónoma</label>
                  <input
                    value={form.comunidad_autonoma || ''}
                    onChange={(e) => setForm({ ...form, comunidad_autonoma: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email oficial</label>
                  <input
                    type="email"
                    value={form.email_oficial || ''}
                    onChange={(e) => setForm({ ...form, email_oficial: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    value={form.telefono || ''}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
                  <input
                    type="url"
                    value={form.web || ''}
                    onChange={(e) => setForm({ ...form, web: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
                  <input
                    value={form.persona_contacto || ''}
                    onChange={(e) => setForm({ ...form, persona_contacto: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-black bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
                <textarea
                  value={form.notas_internas || ''}
                  onChange={(e) => setForm({ ...form, notas_internas: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="verificado"
                  type="checkbox"
                  checked={!!form.verificado}
                  onChange={(e) => setForm({ ...form, verificado: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label htmlFor="verificado" className="text-sm text-gray-700">Marcar como verificado</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-black text-white border border-black px-6 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
                >
                  Guardar contacto
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="px-6 py-2 text-sm border border-black bg-white hover:bg-slate-100"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Cargando contactos...</div>
            ) : contactos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay contactos institucionales registrados.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Institución</th>
                    <th className="px-4 py-3 text-left font-medium">Área</th>
                    <th className="px-4 py-3 text-left font-medium">Provincia</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-left font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((c) => (
                    <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{c.institucion}</td>
                      <td className="px-4 py-3">{c.area_departamento || '—'}</td>
                      <td className="px-4 py-3">{c.provincia || '—'}</td>
                      <td className="px-4 py-3">{c.email_oficial || '—'}</td>
                      <td className="px-4 py-3">
                        {c.verificado ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                            <Check className="w-3 h-3" /> Verificado
                          </span>
                        ) : (
                          <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                            {c.estado}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {!c.verificado && (
                            <button
                              onClick={() => verificar(c.id)}
                              title="Verificar"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 border border-gray-200"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => desactivar(c.id)}
                            title="Desactivar"
                            className="p-2 text-red-600 hover:bg-red-50 border border-gray-200"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
