'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface CalItem {
  id: string | number;
  titulo: string;
  fecha: string;
  tipo: 'agenda' | 'tarea' | 'evento';
  color?: string;
  estado?: string;
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

        (j1.data || []).forEach((n: any) => list.push({ id: `a-${n.id}`, titulo: n.titulo, fecha: n.fecha, tipo: 'agenda', color: n.color }));
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

  const days = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lunes primero
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells: { day: number; items: CalItem[] }[] = [];

    for (let i = 0; i < 42; i++) {
      const d = i - startDay + 1;
      if (d > 0 && d <= totalDays) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        cells.push({ day: d, items: items.filter(it => it.fecha === iso) });
      } else {
        cells.push({ day: 0, items: [] });
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
                  <div key={i} className={`min-h-[90px] border rounded p-1.5 ${c.day ? 'bg-white' : 'bg-gray-100'}`}>
                    {c.day > 0 && <span className="text-sm font-medium text-gray-700">{c.day}</span>}
                    {c.items.map(it => (
                      <div
                        key={it.id}
                        className={`mt-1 text-[10px] px-1 py-0.5 rounded truncate ${
                          it.tipo === 'agenda' ? `bg-${it.color || 'orange'}-100 text-${it.color || 'orange'}-800` :
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
