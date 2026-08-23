'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, Plus, Search, Check, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: string;
  prioridad: string;
  asignado_nombre: string | null;
  creador_nombre: string | null;
  vencimiento: string | null;
}

const ESTADOS = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];

export default function AdminTareasPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(''));
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ titulo: '', descripcion: '', estado: 'pendiente', prioridad: 'media', vencimiento: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const entidad_tipo = searchParams.get('entidad_tipo') || '';
  const entidad_id = searchParams.get('entidad_id') || '';

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchTareas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tareas?q=${encodeURIComponent(q)}`, { headers });
      const json = await res.json();
      if (json.success) setTareas(json.data as Tarea[]);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    fetchTareas();
  }, [user, q, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/tareas', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          entidad_tipo: entidad_tipo || null,
          entidad_id: entidad_id || null,
        }),
      });
      if (!res.ok) throw new Error('Error creando tarea');
      setForm({ titulo: '', descripcion: '', estado: 'pendiente', prioridad: 'media', vencimiento: '' });
      setMostrarForm(false);
      fetchTareas();
    } catch { /* ignore */ }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(`/api/admin/tareas/${id}/estado`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error('Error actualizando');
      fetchTareas();
    } catch { /* ignore */ }
  };

  const prioridadClase: Record<string, string> = {
    baja: 'bg-slate-100 text-slate-700',
    media: 'bg-amber-100 text-amber-700',
    alta: 'bg-orange-100 text-orange-700',
    critica: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-7 h-7 text-orange-500" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Tareas de seguimiento</h1>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="inline-flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              {mostrarForm ? 'Cerrar' : 'Nueva tarea'}
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar tareas..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white focus:outline-none"
            />
          </div>

          {mostrarForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6">
              <input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título"
                required
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-black bg-white"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="px-3 py-2 text-sm border border-black bg-white"
                >
                  {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
                <select
                  value={form.prioridad}
                  onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
                  className="px-3 py-2 text-sm border border-black bg-white"
                >
                  {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                  type="date"
                  value={form.vencimiento}
                  onChange={(e) => setForm({ ...form, vencimiento: e.target.value })}
                  className="px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-black text-white px-6 py-2 text-sm border border-black hover:bg-orange-500 hover:text-black transition-colors">Guardar</button>
                <button type="button" onClick={() => setMostrarForm(false)} className="px-6 py-2 text-sm border border-black bg-white hover:bg-slate-100">Cancelar</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
            ) : tareas.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">No hay tareas pendientes.</div>
            ) : (
              tareas.map((t) => (
                <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-black">{t.titulo}</h3>
                      <p className="text-sm text-slate-600 mt-1">{t.descripcion || '—'}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className={`rounded px-2 py-0.5 ${prioridadClase[t.prioridad] || 'bg-slate-100'}`}>{t.prioridad}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{t.estado}</span>
                        {t.vencimiento && <span>Vence: {new Date(t.vencimiento).toLocaleDateString('es-ES')}</span>}
                        <span>{t.asignado_nombre || t.creador_nombre}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.estado !== 'completada' && (
                        <button
                          onClick={() => cambiarEstado(t.id, 'completada')}
                          title="Completar"
                          className="p-2 text-emerald-600 hover:bg-emerald-50 border border-gray-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {t.estado === 'completada' && (
                        <button
                          onClick={() => cambiarEstado(t.id, 'pendiente')}
                          title="Reabrir"
                          className="p-2 text-slate-600 hover:bg-slate-100 border border-gray-200"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
