'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckSquare, FileText, Megaphone, MessageSquare, RefreshCw, Send, Shield, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DashboardData {
  acciones_rapidas: {
    anuncios_pendientes: { id: string; titulo: string }[];
    reportes_pendientes: { id: number; motivo: string; titulo: string }[];
  };
  sugerencias_sin_trasladar: { id: number; titulo: string; provincia: string; categoria: string; prioridad: string }[];
  propuestas_sin_trasladar: { id: number; titulo: string; provincia: string; apoyos: number }[];
  tareas_pendientes: { id: number; titulo: string; estado: string; prioridad: string }[];
}

export default function DashboardAcciones() {
  const { accessToken, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', { headers });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [accessToken]);

  const isAdmin = user?.rol === 'admin';

  if (loading) return <div className="p-4 text-sm text-slate-500">Cargando acciones...</div>;
  if (!data) return null;

  const prioridadClase: Record<string, string> = {
    baja: 'bg-slate-100 text-slate-700',
    media: 'bg-amber-100 text-amber-700',
    alta: 'bg-orange-100 text-orange-700',
    critica: 'bg-red-100 text-red-700',
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Acciones pendientes
        </h2>
        <button onClick={fetchDashboard} className="p-2 hover:bg-slate-100" aria-label="Actualizar">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card title="Anuncios pendientes" icon={FileText} link="/admin/anuncios" data={data.acciones_rapidas.anuncios_pendientes} />
        <Card title="Reportes pendientes" icon={MessageSquare} link="/admin/comunidad" data={data.acciones_rapidas.reportes_pendientes.map((r) => ({ id: r.id, titulo: `${r.titulo || r.motivo}` }))} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.sugerencias_sin_trasladar.slice(0, 3).map((s) => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="font-medium text-sm text-black line-clamp-1">{s.titulo}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">{s.provincia} · {s.categoria}</p>
            <span className={`inline-block rounded px-2 py-0.5 text-xs ${prioridadClase[s.prioridad] || 'bg-slate-100'}`}>{s.prioridad}</span>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/comunicaciones/nueva?entidad_tipo=sugerencia&entidad_id=${s.id}`} className="text-xs bg-black text-white px-3 py-1.5 hover:bg-orange-500 hover:text-black transition-colors">
                Comunicación
              </Link>
              <Link href={`/admin/tareas?entidad_tipo=sugerencia&entidad_id=${s.id}`} className="text-xs bg-white text-black border border-black px-3 py-1.5 hover:bg-slate-100">
                Tarea
              </Link>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/comunicaciones/nueva" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors">
            <Megaphone className="w-6 h-6 text-orange-500 mb-2" />
            <h3 className="font-medium text-sm text-black">Nueva comunicación</h3>
            <p className="text-xs text-slate-500">Preparar borrador institucional</p>
          </Link>
          <Link href="/admin/instituciones/contactos" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-medium text-sm text-black">Agenda institucional</h3>
            <p className="text-xs text-slate-500">Gestionar contactos oficiales</p>
          </Link>
          <Link href="/admin/plantillas" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors">
            <FileText className="w-6 h-6 text-purple-500 mb-2" />
            <h3 className="font-medium text-sm text-black">Plantillas</h3>
            <p className="text-xs text-slate-500">Editar comunicaciones oficiales</p>
          </Link>
          <Link href="/admin/necesidades" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
            <h3 className="font-medium text-sm text-black">Necesidades</h3>
            <p className="text-xs text-slate-500">Ver necesidades juveniles</p>
          </Link>
        </div>
      )}
    </section>
  );
}

function Card({ title, icon: Icon, link, data }: { title: string; icon: React.ElementType; link: string; data: { id: number | string; titulo: string }[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-black flex items-center gap-2">
          <Icon className="w-4 h-4 text-orange-500" />
          {title}
        </h3>
        <Link href={link} className="text-xs text-orange-600 hover:underline">Ver todo</Link>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">Sin pendientes</p>
      ) : (
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.id} className="text-sm text-slate-700 border-b border-slate-100 last:border-0 pb-1 last:pb-0 line-clamp-1">
              {d.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
