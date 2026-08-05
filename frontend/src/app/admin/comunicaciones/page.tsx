'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Megaphone, Plus, Search, Eye, Send, FileText, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';

interface Comunicacion {
  id: number;
  asunto: string;
  cuerpo: string;
  estado: string;
  institucion: string | null;
  email_destino: string | null;
  provincia: string | null;
  creado_at: string;
  enviado_at: string | null;
  modo_envio: string | null;
  entidades?: { entidad_tipo: string; entidad_id: string; titulo: string | null }[];
}

export default function AdminComunicacionesPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [comunicaciones, setComunicaciones] = useState<Comunicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const fetchComunicaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comunicaciones?q=${encodeURIComponent(q)}`, { headers });
      const json = await res.json();
      if (json.success) setComunicaciones(json.data as Comunicacion[]);
    } catch {
      setError('Error cargando comunicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isAdmin) { router.replace('/admin'); return; }
    fetchComunicaciones();
  }, [user, q, isAdmin, router]);

  const marcarEnviada = async (id: number) => {
    if (!confirm('¿Marcar como enviada manualmente?')) return;
    try {
      const res = await fetch(`/api/admin/comunicaciones/${id}/enviado`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: 'manual' }),
      });
      if (!res.ok) throw new Error('Error actualizando');
      fetchComunicaciones();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const exportar = (id: number) => {
    window.open(`/api/admin/comunicaciones/${id}/exportar`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={isAdmin} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-7 h-7 text-orange-500" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black">Comunicaciones institucionales</h1>
            </div>
            <button
              onClick={() => router.push('/admin/comunicaciones/nueva')}
              className="inline-flex items-center gap-2 bg-black text-white border border-black px-4 py-2 text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva comunicación
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar comunicaciones..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-black bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-gray-600 bg-white border border-gray-200 rounded-xl">Cargando...</div>
            ) : comunicaciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">No hay comunicaciones registradas.</div>
            ) : (
              comunicaciones.map((c) => (
                <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-black">{c.asunto}</h3>
                        {c.estado === 'borrador' && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Borrador</span>}
                        {c.estado === 'enviado' && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Enviado</span>}
                        {c.estado === 'preparado' && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Preparado</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.institucion || c.email_destino || 'Sin destinatario'} · {c.provincia || 'Sin provincia'} · {new Date(c.creado_at).toLocaleString('es-ES')}
                      </p>
                      <p className="text-sm text-slate-700 mt-2 line-clamp-2">{c.cuerpo}</p>
                      {c.entidades && c.entidades.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.entidades.map((ent, idx) => (
                            <span key={idx} className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                              {ent.entidad_tipo}: {ent.titulo || ent.entidad_id}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/comunicaciones/${c.id}`}
                        title="Ver detalle"
                        className="p-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {c.estado !== 'enviado' && (
                        <button
                          onClick={() => marcarEnviada(c.id)}
                          title="Marcar como enviada"
                          className="p-2 text-emerald-600 hover:bg-emerald-50 border border-gray-200"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => exportar(c.id)}
                        title="Exportar .txt"
                        className="p-2 text-slate-600 hover:bg-slate-100 border border-gray-200"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
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
