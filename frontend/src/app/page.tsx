'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';
import { COMUNIDADES, PROVINCIAS_POR_COMUNIDAD } from '@/lib/provinces';

interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  creado_at: string;
  usuario_nombre?: string;
  nombre?: string;
  es_favorito?: boolean;
}

interface Estadisticas {
  anuncios_publicados: number;
  usuarios_registrados: number;
  sugerencias_recibidas: number;
  comunidades_activas: number;
}

const CATEGORIAS = [
  { id: 'empleo', label: 'Empleo', href: '/anuncios?categoria=empleo' },
  { id: 'formacion', label: 'Formación', href: '/anuncios?categoria=formacion' },
  { id: 'vivienda', label: 'Vivienda', href: '/anuncios?categoria=vivienda' },
  { id: 'ocio', label: 'Ocio', href: '/anuncios?categoria=ocio' },
  { id: 'ayudas', label: 'Ayudas', href: '/anuncios?categoria=servicios&busqueda=ayudas' },
  { id: 'voluntariado', label: 'Voluntariado', href: '/anuncios?categoria=servicios&busqueda=voluntariado' },
];

export default function HomePage() {
  const { t } = useCustomTranslation();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comunidad, setComunidad] = useState('');
  const [provincia, setProvincia] = useState('');

  const fetchAnuncios = useCallback(async (comunidadFiltro = '', provinciaFiltro = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('limit', '10');
      params.set('ordenar', 'creado-desc');
      if (comunidadFiltro) params.set('comunidad_autonoma', comunidadFiltro);
      if (provinciaFiltro) params.set('provincia', provinciaFiltro);

      const res = await fetch(`/api/anuncios?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnuncios(data.data || []);
      } else {
        setError(data.error || 'Error cargando anuncios');
      }
    } catch (err) {
      setError('No se pudieron cargar los anuncios');
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const statsRes = await fetch('/api/estadisticas/home');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setEstadisticas(statsData.data);
      }
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  useEffect(() => {
    fetchAnuncios(comunidad, provincia);
  }, [comunidad, provincia, fetchAnuncios]);

  const guardar = async (id: string) => {
    try {
      await fetch(`/api/anuncios/${id}/guardar`, { method: 'POST' });
    } catch (err) {
      console.error('Error guardando:', err);
    }
  };

  const reportar = async (id: string) => {
    try {
      await fetch(`/api/anuncios/${id}/reportar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: 'Contenido inapropiado' })
      });
      alert('Anuncio reportado. Será revisado por moderación.');
    } catch (err) {
      console.error('Error reportando:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-4 sm:px-6 py-16 sm:py-24 border-b border-gray-200">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black leading-tight mb-8 tracking-tight">
            Encuentra tu lugar en la ciudad.
          </h1>
          <div className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 space-y-4">
            <p>
              CityPAJ es el punto de encuentro joven donde descubrir oportunidades, recursos, anuncios y comunidad en tu provincia.
            </p>
            <p>
              Aquí puedes buscar empleo, formación, vivienda, cultura o ayudas, pero también compartir lo que falta, proponer ideas y conectar con otras personas jóvenes que quieren vivir su ciudad de una forma más activa, útil y cercana.
            </p>
          </div>
        </div>
      </section>

      {/* Últimos anuncios */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex flex-wrap items-center gap-2">
                <span>Últimos anuncios de</span>
                <select
                  value={comunidad}
                  onChange={(e) => { setComunidad(e.target.value); setProvincia(''); }}
                  className="font-sans text-base sm:text-lg border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Toda España</option>
                  {COMUNIDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {comunidad ? (
                  <>
                    <span className="hidden sm:inline text-gray-400">/</span>
                    <select
                      value={provincia}
                      onChange={(e) => setProvincia(e.target.value)}
                      className="font-sans text-base sm:text-lg border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Toda {comunidad}</option>
                      {PROVINCIAS_POR_COMUNIDAD[comunidad]?.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </>
                ) : null}
              </h2>
              <p className="text-gray-600">Anuncios recientes de jóvenes y recursos cercanos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => fetchAnuncios(comunidad, provincia)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white text-sm font-medium border border-black hover:bg-orange-500 hover:text-black transition-colors"
              >
                Buscar
              </button>
              <Link
                href="/anuncios"
                className="inline-flex items-center justify-center px-5 py-2.5 border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                Ver todos
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading && anuncios.length === 0 ? (
              <LoadingRows count={3} />
            ) : error ? (
              <div className="p-8 text-center text-red-600">{error}</div>
            ) : anuncios.length === 0 ? (
              <EmptyState
                titulo={t('home.no_ads', 'Aún no hay anuncios')}
                mensaje={t('home.no_ads_text', 'Sé el primero en publicar una oportunidad en tu provincia.')}
                accion={{ label: t('common.publish_ad', 'Publicar anuncio'), href: '/publicar' }}
              />
            ) : (
              anuncios.map((anuncio) => (
                <ListingRow
                  key={anuncio.id}
                  id={anuncio.id}
                  titulo={anuncio.titulo}
                  descripcion={anuncio.descripcion}
                  categoria={anuncio.categoria}
                  provincia={anuncio.provincia}
                  fecha={anuncio.creado_at}
                  autor={anuncio.usuario_nombre || anuncio.nombre || 'Anónimo'}
                  url={`/anuncios/${anuncio.id}`}
                  esFavorito={anuncio.es_favorito}
                  onFavorito={() => guardar(anuncio.id)}
                  onReportar={() => reportar(anuncio.id)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Voz ciudadana */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Tu provincia también se construye <span className="text-blue-600">escuchándote</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Comparte necesidades, propuestas y oportunidades en tu comunidad. CityPAJ ayuda a que tu voz llegue más lejos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buzon-sugerencias"
                  className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-blue-600 transition-colors text-center"
                >
                  Enviar necesidad
                </Link>
                <Link
                  href="/comunidad"
                  className="px-6 py-3 border-2 border-black text-black font-medium rounded-full hover:bg-gray-100 transition-colors text-center"
                >
                  Entrar en comunidad
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-8 sm:p-12">
              <div className="text-5xl mb-4">🗣️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tu voz importa</h3>
              <p className="text-gray-600 mb-6">
                Miles de jóvenes ya participan para mejorar sus provincias. Envía sugerencias y propuestas reales.
              </p>
              <div className="text-3xl font-bold text-blue-600">
                {estadisticas?.sugerencias_recibidas || 0}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Sugerencias recibidas</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
