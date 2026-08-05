'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Search, Megaphone, CheckSquare, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Necesidad {
  provincia: string;
  tema: string;
  sugerencias: number;
  propuestas: number;
  publicaciones: number;
  apoyos: number;
  reportes: number;
  prioridad: string;
  ultima_actividad: string;
}

export default function AdminNecesidadesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [provincia, setProvincia] = useState('');
  const [tema, setTema] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchNecesidades = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (provincia) params.set('provincia', provincia);
      if (tema) params.set('tema', tema);
      const res = await fetch(`/api/admin/necesidades?${params.toString()}`, { headers });
      const json = await res.json();
      if (json.success) setNecesidades(json.data as Necesidad[]);
    } catch {
      setNecesidades([]);
    } finally {
      setLoading(false);
    }
  };

  const crearTarea = async (n: Necesidad) => {
    if (!isAdmin) return;
    try {
      const res = await fetch('/api/admin/tareas', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: `Seguimiento: ${n.provincia} — ${n.tema}`,
          descripcion: `Necesidad juvenil agrupada en ${n.provincia} sobre ${n.tema}. Prioridad ${n.prioridad}.`,
          prioridad: n.prioridad,
          entidad_tipo: 'necesidad',
          entidad_id: `${n.provincia}|${n.tema}`,
          estado: 'pendiente',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMensaje('Tarea creada correctamente.');
      } else {
        setMensaje(json.data?.error || 'Error creando la tarea');
      }
    } catch {
      setMensaje('Error de conexión al crear la tarea');
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isAdmin) { router.replace('/admin'); return; }
    fetchNecesidades();
  }, [user, isAdmin, router, provincia, tema]);

  const prioridadClase: Record<string, string> = {
    critica: 'bg-red-100 text-red-700',
    alta: 'bg-orange-100 text-orange-700',
    media: 'bg-amber-100 text-amber-700',
    baja: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Necesidades juveniles detectadas</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                placeholder="Filtrar por provincia"
                className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Filtrar por tema"
                className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
          ) : necesidades.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">No se han detectado necesidades con los filtros aplicados.</div>
          ) : (
            <>
              {mensaje && (
                <div className="mb-4 p-3 text-sm border border-black bg-white text-black">
                  {mensaje}
                </div>
              )}
              <div className="space-y-3">
              {necesidades.map((n, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-lg font-bold text-black">{n.provincia} — {n.tema}</h3>
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${prioridadClase[n.prioridad] || 'bg-slate-100'}`}>
                          Prioridad {n.prioridad}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        {n.sugerencias} sugerencias · {n.propuestas} propuestas · {n.publicaciones} publicaciones · {n.apoyos} apoyos · {n.reportes} reportes
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Última actividad: {n.ultima_actividad ? new Date(n.ultima_actividad).toLocaleString('es-ES') : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/comunicaciones/nueva?entidad_tipo=sugerencia&entidad_id=${encodeURIComponent('agrupado-' + n.provincia + '-' + n.tema)}`)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors"
                      >
                        <Megaphone className="w-3 h-3" />
                        Generar comunicación
                      </button>
                      <button
                        onClick={() => crearTarea(n)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white text-black border border-black hover:bg-slate-100"
                      >
                        <CheckSquare className="w-3 h-3" />
                        Tarea
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
