'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Plus, Trash, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Nota {
  id: number;
  titulo: string;
  cuerpo: string;
  fecha: string;
  color: string;
  usuario_id: string;
}

const COLORS = [
  { value: 'orange', label: 'Naranja', class: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'blue', label: 'Azul', class: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'green', label: 'Verde', class: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'red', label: 'Rojo', class: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'purple', label: 'Morado', class: 'bg-purple-100 text-purple-700 border-purple-300' },
];

function toISO(d: Date) {
  return d.toISOString().split('T')[0];
}

function monthData(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

export default function AgendaPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: 0, titulo: '', cuerpo: '', color: 'orange' });

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const inicio = useMemo(() => {
    const d = monthData(current)[0];
    return toISO(d);
  }, [current]);
  const fin = useMemo(() => {
    const days = monthData(current);
    return toISO(days[days.length - 1]);
  }, [current]);

  const fetchNotas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/agenda?inicio=${inicio}&fin=${fin}`, { headers });
      const json = await res.json();
      if (json.success) setNotas(json.data as Nota[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isStaff) { router.replace('/admin'); return; }
    fetchNotas();
  }, [user, isStaff, router, accessToken, inicio, fin]);

  const notasPorFecha = useMemo(() => {
    const map: Record<string, Nota[]> = {};
    notas.forEach((n) => {
      const d = n.fecha.split('T')[0];
      if (!map[d]) map[d] = [];
      map[d].push(n);
    });
    return map;
  }, [notas]);

  const notasSeleccionadas = notasPorFecha[toISO(selected)] || [];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = form.id ? `/api/admin/agenda/${form.id}` : '/api/admin/agenda';
    const method = form.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, fecha: toISO(selected) }),
    });
    if (res.ok) {
      setForm({ id: 0, titulo: '', cuerpo: '', color: 'orange' });
      fetchNotas();
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    await fetch(`/api/admin/agenda/${id}`, { method: 'DELETE', headers });
    fetchNotas();
  };

  const cambiarMes = (inc: number) => {
    const next = new Date(current.getFullYear(), current.getMonth() + inc, 1);
    setCurrent(next);
  };

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthName = current.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const days = monthData(current);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={user?.rol === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Agenda</h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => cambiarMes(-1)} className="p-2 border border-gray-200 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
              <button onClick={() => cambiarMes(1)} className="p-2 border border-gray-200 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
              {dayNames.map((d) => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                const iso = toISO(d);
                const hoy = iso === toISO(new Date());
                const sel = iso === toISO(selected);
                const nCount = notasPorFecha[iso]?.length || 0;
                const otroMes = d.getMonth() !== current.getMonth();
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(d)}
                    className={`min-h-[64px] p-1 text-left text-sm border rounded flex flex-col justify-between transition-colors ${
                      sel ? 'bg-orange-100 border-orange-500' : hoy ? 'bg-gray-100 border-gray-400' : 'border-gray-100 hover:bg-gray-50'
                    } ${otroMes ? 'text-gray-400' : 'text-gray-900'}`}
                  >
                    <span className="block px-1">{d.getDate()}</span>
                    {nCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 self-center mb-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">
                Notas del {selected.toLocaleDateString('es-ES')}
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500">Cargando...</p>
              ) : notasSeleccionadas.length === 0 ? (
                <p className="text-sm text-gray-500">No hay notas para este día.</p>
              ) : (
                <div className="space-y-3">
                  {notasSeleccionadas.map((n) => {
                    const color = COLORS.find((c) => c.value === n.color) || COLORS[0];
                    return (
                      <div key={n.id} className={`border rounded-lg p-3 ${color.class}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">{n.titulo}</p>
                            {n.cuerpo && <p className="text-sm mt-1 whitespace-pre-wrap">{n.cuerpo}</p>}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setForm({ id: n.id, titulo: n.titulo, cuerpo: n.cuerpo, color: n.color })}
                              className="p-1 hover:opacity-70"
                              title="Editar"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminar(n.id)}
                              className="p-1 hover:opacity-70"
                              title="Eliminar"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                {form.id ? 'Editar nota' : 'Nueva nota'}
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  value={form.cuerpo}
                  onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-black bg-white"
                >
                  {COLORS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {form.id ? 'Actualizar' : 'Añadir'}
                </button>
                {form.id !== 0 && (
                  <button
                    type="button"
                    onClick={() => setForm({ id: 0, titulo: '', cuerpo: '', color: 'orange' })}
                    className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
