'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import PageHeader from '@/components/ui/PageHeader';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  fecha_inicio: string;
  precio: number;
  ubicacion?: string;
  url?: string;
}

const CATEGORIAS = ['todos', 'Concierto', 'Taller', 'Festival', 'Exposición', 'Deporte', 'Teatro'];

function EventosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoria = searchParams.get('categoria') || '';

  useEffect(() => {
    cargarEventos();
  }, [categoria]);

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria && categoria !== 'todos') params.set('categoria', categoria);
      const res = await fetch(`/api/eventos?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEventos(data.data || []);
      } else {
        setError(data.error || 'Error cargando eventos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'todos') {
      params.set('categoria', value);
    } else {
      params.delete('categoria');
    }
    router.push(`/eventos?${params.toString()}`);
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHeader titulo="Eventos y cultura" subtitulo="Descubre actividades, conciertos, talleres y eventos en tu provincia.">
        <Link
          href="/eventos/nuevo"
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          Añadir evento
        </Link>
      </PageHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8">
          <select
            value={categoria}
            onChange={(e) => updateFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
          >
            <option value="todos">Todas las categorías</option>
            {CATEGORIAS.filter(c => c !== 'todos').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
          {loading ? (
            <LoadingRows count={4} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : eventos.length === 0 ? (
            <EmptyState
              titulo="Aún no hay eventos"
              mensaje="Descubre próximamente eventos en tu provincia o añade el tuyo."
              accion={{ label: 'Añadir evento', href: '/eventos/nuevo' }}
            />
          ) : (
            eventos.map((evento) => (
              <div
                key={evento.id}
                className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-100 text-amber-800 border-amber-200">
                        {evento.categoria}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {evento.precio === 0 ? 'Gratis' : `${evento.precio}€`}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{evento.titulo}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{evento.descripcion}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatFecha(evento.fecha_inicio)}
                      </span>
                      <span>{evento.provincia}</span>
                      {evento.ubicacion && <span>{evento.ubicacion}</span>}
                    </div>
                  </div>
                  {evento.url && (
                    <a
                      href={evento.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors shrink-0"
                    >
                      Más info
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function EventosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EventosContent />
    </Suspense>
  );
}
