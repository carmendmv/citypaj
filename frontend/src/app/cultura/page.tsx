'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ImageOff, Ticket, Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { COMUNIDADES, PROVINCIAS_POR_COMUNIDAD } from '@/lib/provinces';

interface EventoCultura {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  creado_at: string;
  cartel_url?: string | null;
  precio?: number | null;
  usuario_nombre?: string;
}

const provincias = Object.values(PROVINCIAS_POR_COMUNIDAD).flat().sort();

export default function CulturaPage() {
  const [eventos, setEventos] = useState<EventoCultura[]>([]);
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [provincia, setProvincia] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEventos = async (ccaa: string, provinciaFiltro: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('categoria', 'Cultura');
      params.set('limit', '60');
      if (ccaa) params.set('comunidad_autonoma', ccaa);
      if (provinciaFiltro) params.set('provincia', provinciaFiltro);
      const res = await fetch(`/api/anuncios?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEventos(data.data || []);
      } else {
        setError(data.error || 'Error cargando eventos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos(comunidadAutonoma, provincia);
  }, [comunidadAutonoma, provincia]);

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const precioTexto = (precio?: number | null) => {
    if (precio === null || precio === undefined) return 'Gratis';
    if (Number(precio) === 0) return 'Gratis';
    return `${Number(precio).toFixed(2)} €`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHeader
        titulo="Eventos de cultura"
        subtitulo="Descubre conciertos, eventos, quedadas grupales y planes culturales en tu provincia."
      >
        <Link
          href="/publicar/cultura"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Publicar evento
        </Link>
      </PageHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="border border-black p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-sm font-medium text-gray-700 mb-2">Comunidad autónoma</label>
            <select
              value={comunidadAutonoma}
              onChange={(e) => { setComunidadAutonoma(e.target.value); setProvincia(''); }}
              className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Todas</option>
              {COMUNIDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-gray-700 mb-2">Provincia</label>
            <select
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              disabled={!comunidadAutonoma}
              className={`w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 ${!comunidadAutonoma ? 'bg-gray-100 text-gray-400' : ''}`}
            >
              <option value="">Todas las provincias</option>
              {(comunidadAutonoma ? PROVINCIAS_POR_COMUNIDAD[comunidadAutonoma] || [] : []).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 bg-gray-50 h-80 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 border border-black">{error}</div>
        ) : eventos.length === 0 ? (
          <EmptyState
            titulo="Aún no hay eventos culturales"
            mensaje="Sé el primero en publicar un evento cultural en tu provincia."
            accion={{ label: 'Publicar evento', href: '/publicar/cultura' }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="group border border-black bg-white hover:border-orange-500 transition-all duration-200 flex flex-col h-full"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-white">
                  {evento.cartel_url ? (
                    <img
                      src={evento.cartel_url}
                      alt={evento.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white border-b border-black">
                      <div className="text-center p-4">
                        <ImageOff className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-sans">Se espera imagen</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium bg-black text-white border border-black">
                      <Ticket className="w-3 h-3" />
                      {precioTexto(evento.precio)}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="font-serif text-lg font-bold text-black mb-2 group-hover:text-orange-500 transition-colors leading-tight">
                    {evento.titulo}
                  </h3>
                  <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {evento.descripcion}
                  </p>
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{evento.provincia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <time dateTime={evento.creado_at}>
                        {formatFecha(evento.creado_at)}
                      </time>
                    </div>
                  </div>
                  <Link
                    href={`/anuncios/${evento.id}`}
                    className="mt-auto w-full text-center px-4 py-2.5 bg-black text-white text-sm font-sans hover:bg-orange-500 hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Ver evento
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
