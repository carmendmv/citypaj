'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import { useCustomTranslation } from '@/contexts/CustomTranslationContext';

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

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [anunciosRes, statsRes] = await Promise.all([
        fetch('/api/anuncios?limit=10&ordenar=creado-desc'),
        fetch('/api/estadisticas/home')
      ]);

      if (anunciosRes.ok) {
        const anunciosData = await anunciosRes.json();
        if (anunciosData.success) {
          setAnuncios(anunciosData.data || []);
        } else {
          setError(anunciosData.error || 'Error cargando anuncios');
        }
      } else {
        setError('No se pudieron cargar los anuncios');
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setEstadisticas(statsData.data);
      }
    } catch (err) {
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 sm:px-6 py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Todo lo que necesitas, <span className="text-blue-600">cerca de ti</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            CityPAJ conecta a jóvenes con recursos, anuncios y participación en su provincia.
          </p>

          {estadisticas && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
              {[
                { label: 'Anuncios', value: estadisticas.anuncios_publicados },
                { label: 'Usuarios', value: estadisticas.usuarios_registrados },
                { label: 'Sugerencias', value: estadisticas.sugerencias_recibidas },
                { label: 'Provincias', value: estadisticas.comunidades_activas },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Explora por categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-1">{cat.label}</div>
                <div className="text-sm text-gray-500 group-hover:text-blue-500">Ver →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos anuncios */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('home.latest_ads', 'Últimos anuncios')}</h2>
              <p className="text-gray-600">{t('home.latest_ads', 'Anuncios recientes de jóvenes y recursos cercanos')}</p>
            </div>
            <Link
              href="/anuncios"
              className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
            >
              Ver todos
            </Link>
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

      {/* Instituciones */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Una herramienta útil para instituciones</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Ayuntamientos, diputaciones y áreas de juventud pueden escuchar, ordenar y comprender las necesidades reales de la juventud por territorio.
          </p>
          <Link
            href="/instituciones"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Más información para instituciones
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 sm:px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Empieza por tu provincia</h2>
          <p className="text-gray-300 text-lg mb-8">
            Únete a miles de jóvenes que ya encuentran oportunidades y hacen oír su voz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/anuncios"
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors text-center"
            >
              Explorar oportunidades
            </Link>
            <Link
              href="/publicar"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-center"
            >
              Publicar anuncio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
