'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface CalItem {
  id: string | number;
  titulo: string;
  fecha: string;
  cuerpo?: string;
  tipo: 'agenda' | 'tarea' | 'evento';
  color?: string;
  estado?: string;
  notaId?: string | number;
}

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['L','M','X','J','V','S','D'];

export default function AdminCalendarioPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const [current, setCurrent] = useState(() => new Date());
  const [items, setItems] = useState<CalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ titulo: '', cuerpo: '', fecha: '', color: 'orange' });
  const [editando, setEditando] = useState<string | null>(null);

  const authHeaders: Record<string, string> = {};
  if (accessToken) authHeaders.Authorization = `Bearer ${accessToken}`;

  const COLORES = ['orange', 'blue', 'green', 'purple', 'red'];

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isStaff) { router.replace('/admin'); return; }

    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const inicio = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01`;
    const fin = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate()}`;

    Promise.all([
      fetch(`/api/admin/agenda?inicio=${inicio}&fin=${fin}`, { headers }),
      fetch('/api/admin/tareas?limit=100', { headers }),
      fetch(`/api/eventos?categoria=Cultura&limit=100`),
    ])
      .then(async ([r1, r2, r3]) => {
        const j1 = await r1.json();
        const j2 = await r2.json();
        const j3 = await r3.json();
        const list: CalItem[] = [];

        (j1.data || []).forEach((n: any) => list.push({ id: `a-${n.id}`, titulo: n.titulo, cuerpo: n.cuerpo, fecha: n.fecha, tipo: 'agenda', color: n.color, notaId: n.id }));
        (j2.data || []).forEach((t: any) => {
          if (t.vencimiento) list.push({ id: `t-${t.id}`, titulo: t.titulo, fecha: t.vencimiento.slice(0, 10), tipo: 'tarea', estado: t.estado });
        });
        (j3.data || []).forEach((e: any) => {
          if (e.fecha_inicio) list.push({ id: `e-${e.id}`, titulo: e.titulo, fecha: e.fecha_inicio.slice(0, 10), tipo: 'evento' });
        });

        setItems(list);
      })
      .finally(() => setLoading(false));
  }, [user, isStaff, accessToken, router, current]);

  const guardarNota = async () => {
    if (!form.titulo.trim() || !form.fecha) return;
    setError(null);
    const url = editando ? `/api/admin/agenda/${editando}` : '/api/admin/agenda';
    const method = editando ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.titulo,
        cuerpo: form.cuerpo,
        fecha: form.fecha,
        color: form.color,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Error guardando la nota');
      return;
    }
    setForm({ titulo: '', cuerpo: '', fecha: '', color: 'orange' });
    setEditando(null);
    setCurrent(new Date(current));
  };

  const eliminarNota = async () => {
    if (!editando) return;
    await fetch(`/api/admin/agenda/${editando}`, { method: 'DELETE', headers: authHeaders });
    setForm({ titulo: '', cuerpo: '', fecha: '', color: 'orange' });
    setEditando(null);
    setCurrent(new Date(current));
  };

  const days = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lunes primero
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: { day: number; items: CalItem[]; fecha: string }[] = [];

    for (let i = 0; i < 42; i++) {
      const d = i - startDay + 1;
      if (d > 0 && d <= totalDays) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({ day: d, items: items.filter(it => it.fecha === iso), fecha: iso });
      } else {
        cells.push({ day: 0, items: [], fecha: '' });
      }
    }
    return cells;
  }, [current, items]);

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={user?.rol === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Calendario de moderación</h1>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="px-3 py-1.5 border border-gray-300 rounded hover:bg-white">←</button>
              <span className="px-3 py-1.5 font-medium">{MONTH_NAMES[current.getMonth()]} {current.getFullYear()}</span>
              <button onClick={nextMonth} className="px-3 py-1.5 border border-gray-300 rounded hover:bg-white">→</button>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (c.day) {
                        setEditando(null);
                        setForm({ titulo: '', cuerpo: '', fecha: c.fecha, color: 'orange' });
                      }
                    }}
                    className={`min-h-[90px] border rounded p-1.5 ${c.day ? 'bg-white cursor-pointer hover:bg-orange-50' : 'bg-gray-100'}`}
                  >
                    {c.day > 0 && <span className="text-sm font-medium text-gray-700">{c.day}</span>}
                    {c.items.map(it => (
                      <div
                        key={it.id}
                        onClick={(e) => {
                          if (it.tipo === 'agenda' && it.notaId) {
                            e.stopPropagation();
                            setEditando(String(it.notaId));
                            setForm({
                              titulo: it.titulo,
                              cuerpo: it.cuerpo || '',
                              fecha: it.fecha,
                              color: it.color || 'orange',
                            });
                          }
                        }}
                        className={`mt-1 text-[10px] px-1 py-0.5 rounded truncate ${
                          it.tipo === 'agenda' ? `bg-${it.color || 'orange'}-100 text-${it.color || 'orange'}-800 cursor-pointer hover:ring-1 hover:ring-black` :
                          it.tipo === 'tarea' ? (it.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800') :
                          'bg-purple-100 text-purple-800'
                        }`}
                        title={it.titulo}
                      >
                        {it.titulo}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-100" /> Evento</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-100" /> Tarea</span>
                <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-100" /> Agenda</span>
              </div>

              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-serif text-lg font-bold text-black mb-4">
                  {editando ? 'Editar nota de agenda' : 'Añadir nota a la agenda'}
                </h2>
                {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={form.fecha}
                      onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Color</label>
                    <select
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                    >
                      {COLORES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Título</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Título de la nota"
                    className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Cuerpo (opcional)</label>
                  <textarea
                    value={form.cuerpo}
                    onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-black bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={guardarNota}
                    className="px-5 py-2 bg-black text-white text-sm hover:bg-orange-500 transition-colors"
                  >
                    {editando ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editando && (
                    <>
                      <button
                        onClick={eliminarNota}
                        className="px-5 py-2 bg-red-500 text-white text-sm hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => { setEditando(null); setForm({ titulo: '', cuerpo: '', fecha: '', color: 'orange' }); }}
                        className="px-5 py-2 border border-black text-sm hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
