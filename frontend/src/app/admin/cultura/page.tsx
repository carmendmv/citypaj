'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/admin/AdminNav';
import { Check, X, Trash, Calendar, Image } from 'lucide-react';

interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  estado_moderacion: string;
  creado_at: string;
  usuario_nombre: string;
  cartel_url?: string;
}

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  fecha_inicio: string;
  creado_at: string;
}

export default function AdminCulturaPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [tab, setTab] = useState<'anuncios' | 'eventos'>('anuncios');
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isStaff = user?.rol === 'admin' || user?.rol === 'moderador';

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const [resA, resE] = await Promise.all([
        fetch('/api/admin/anuncios?categoria=Cultura&limit=100', { headers }),
        fetch('/api/eventos?categoria=Cultura&limit=100'),
      ]);

      const jsonA = await resA.json();
      const jsonE = await resE.json();

      if (jsonA.success) setAnuncios(jsonA.data as Anuncio[]);
      if (jsonE.success) setEventos(jsonE.data as Evento[]);
    } catch (e) {
      setError('Error cargando datos de cultura.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { router.replace('/admin/acceder'); return; }
    if (!isStaff) { router.replace('/admin'); return; }
    fetchData();
  }, [user, isStaff, accessToken, router]);

  const moderar = async (id: string, accion: 'aprobar' | 'rechazar', motivo?: string) => {
    const res = await fetch(`/api/anuncios/${id}/moderar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ accion, motivo }),
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminNav isAdmin={user?.rol === 'admin'} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-6">Gestión de Cultura</h1>

          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setTab('anuncios')}
              className={`pb-2 font-sans text-sm ${tab === 'anuncios' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            >
              Anuncios culturales
            </button>
            <button
              onClick={() => setTab('eventos')}
              className={`pb-2 font-sans text-sm ${tab === 'eventos' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
            >
              Eventos culturales
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : tab === 'anuncios' ? (
            <div className="space-y-3">
              {anuncios.length === 0 && <p className="text-sm text-gray-500">No hay anuncios culturales.</p>}
              {anuncios.map((a) => (
                <div key={a.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{a.titulo}</p>
                      <p className="text-sm text-gray-600 mt-1">{a.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {a.comunidad_autonoma} · {a.provincia} · {a.estado_moderacion} · {new Date(a.creado_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {a.cartel_url && <Image className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {a.estado_moderacion !== 'approved' && (
                      <button
                        onClick={() => moderar(a.id, 'aprobar')}
                        className="inline-flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                      >
                        <Check className="w-3 h-3" /> Aprobar
                      </button>
                    )}
                    {a.estado_moderacion !== 'rejected' && (
                      <button
                        onClick={() => moderar(a.id, 'rechazar', 'No cumple con las normas de cultura')}
                        className="inline-flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1.5 rounded hover:bg-red-700"
                      >
                        <X className="w-3 h-3" /> Rechazar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {eventos.length === 0 && <p className="text-sm text-gray-500">No hay eventos culturales.</p>}
              {eventos.map((e) => (
                <div key={e.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{e.titulo}</p>
                      <p className="text-sm text-gray-600 mt-1">{e.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {e.provincia} · <Calendar className="w-3 h-3 inline" /> {new Date(e.fecha_inicio).toLocaleDateString('es-ES')} · {new Date(e.creado_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
