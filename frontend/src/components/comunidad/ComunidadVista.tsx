'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import ReportModal from '@/components/ui/ReportModal';
import NombreModal from './NombreModal';
import ComunidadSketch from '@/components/illustrations/ComunidadSketch';
import { TEMAS_COMUNIDAD, ORDENES_COMUNIDAD } from '@/lib/comunidad';
import { PROVINCIAS_POR_COMUNIDAD, COMUNIDADES, PROVINCIA_NORMALIZACION } from '@/lib/provinces';

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  provincia: string;
  tema: string;
  creado_at: string;
  usuario_nombre?: string;
  respuestas_count: number;
  likes_count: number;
}

const NOMBRE_STORAGE_KEY = 'citypaj_nombre_comunidad';

function provinciaAComunidad(provincia?: string): string | null {
  if (!provincia) return null;
  const normalizada = PROVINCIA_NORMALIZACION[provincia] || provincia;
  for (const [ccaa, lista] of Object.entries(PROVINCIAS_POR_COMUNIDAD)) {
    if (lista.includes(normalizada)) return ccaa;
  }
  return null;
}

export default function ComunidadVista({
  provinciaInicial,
  ccaaInicial
}: {
  provinciaInicial?: string;
  ccaaInicial?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportarId, setReportarId] = useState<number | null>(null);
  const [reportarLoading, setReportarLoading] = useState(false);
  const [pedirNombre, setPedirNombre] = useState(false);
  const [nombreGuardado, setNombreGuardado] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNombreGuardado(localStorage.getItem(NOMBRE_STORAGE_KEY));
    }
  }, []);

  const ccaaParam = searchParams.get('ccaa') || ccaaInicial || '';
  const provinciaParam = searchParams.get('provincia') || provinciaInicial || '';
  const tema = searchParams.get('tema') || '';
  const orden = searchParams.get('orden') || 'reciente';

  const ccaa = useMemo(() => ccaaParam, [ccaaParam]);
  const provincia = useMemo(() => provinciaParam, [provinciaParam]);

  useEffect(() => {
    if (!ccaa && provincia) {
      const derivada = provinciaAComunidad(provincia);
      if (derivada) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('ccaa', derivada);
        router.replace(`/comunidad/${encodeURIComponent(provincia)}?${params.toString()}`);
      }
    }
  }, [ccaa, provincia, searchParams, router]);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (provincia) params.set('provincia', provincia);
        else if (ccaa) params.set('comunidad_autonoma', ccaa);
        if (tema) params.set('tema', tema);
        if (orden) params.set('orden', orden);

        const res = await fetch(`/api/comunidad?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setPublicaciones(data.data || []);
        } else {
          setError(data.error || 'Error cargando conversaciones');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [ccaa, provincia, tema, orden]);

  const setFilter = (key: 'ccaa' | 'provincia' | 'tema' | 'orden', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'ccaa') {
      if (value && value !== 'todas') params.set('ccaa', value);
      else params.delete('ccaa');
      params.delete('provincia');
    } else if (key === 'provincia') {
      if (value && value !== 'todas') params.set('provincia', value);
      else params.delete('provincia');
    } else if (key === 'tema') {
      if (value && value !== 'todos') params.set('tema', value);
      else params.delete('tema');
    } else if (key === 'orden') {
      if (value) params.set('orden', value);
      else params.delete('orden');
    }
    const base = provinciaInicial ? `/comunidad/${encodeURIComponent(provinciaInicial)}` : '/comunidad';
    router.push(`${base}?${params.toString()}`);
  };

  const provinciasVisibles = ccaa ? PROVINCIAS_POR_COMUNIDAD[ccaa] || [] : [];

  const handleGuardarNombre = (nombre: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOMBRE_STORAGE_KEY, nombre);
    }
    setNombreGuardado(nombre);
    setPedirNombre(false);
  };

  const handleReportar = async (motivo: string, descripcion: string) => {
    if (!reportarId) return;
    setReportarLoading(true);
    try {
      const res = await fetch(`/api/comunidad/publicaciones/${reportarId}/reportar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, descripcion })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReportarId(null);
      } else {
        alert(data.error || 'No se pudo enviar el reporte.');
      }
    } catch {
      alert('Error al enviar el reporte.');
    } finally {
      setReportarLoading(false);
    }
  };

  const abrirCrear = () => {
    if (!nombreGuardado) {
      setPedirNombre(true);
    } else {
      router.push('/comunidad/crear');
    }
  };

  const provinciaDisplay = provincia ? (PROVINCIA_NORMALIZACION[provincia] || provincia) : null;
  const titulo = provinciaDisplay ? `Comunidad joven en ${provinciaDisplay}` : 'Comunidad';
  const subtitulo = provinciaDisplay
    ? 'Conversaciones, dudas y propuestas de jóvenes de tu provincia.'
    : 'Habla de lo que pasa cerca de ti. Comunidad es el espacio joven de CityPAJ para compartir dudas, ideas, problemas y propuestas por provincia.';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white px-6 py-12 sm:px-12 sm:py-16 mb-10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{titulo}</h1>
            <p className="text-base sm:text-lg text-slate-100 mb-6 leading-relaxed">{subtitulo}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={abrirCrear}
                className="inline-flex items-center px-5 py-2.5 bg-white text-slate-900 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors"
              >
                Crear conversación
              </button>
              {!provinciaInicial && (
                <button
                  onClick={() => document.getElementById('filtros')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-5 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-full hover:bg-slate-600 transition-colors"
                >
                  Explorar mi provincia
                </button>
              )}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-64 sm:w-80 md:w-96 opacity-10 text-white pointer-events-none z-0" aria-hidden="true">
            <ComunidadSketch />
          </div>
        </section>

        <section id="filtros" className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Comunidad autónoma</label>
                <select
                  value={ccaa}
                  onChange={(e) => setFilter('ccaa', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                  <option value="">Todas</option>
                  {COMUNIDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Provincia</label>
                <select
                  value={provincia}
                  onChange={(e) => setFilter('provincia', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-gray-100"
                  disabled={!ccaa}
                >
                  <option value="">{ccaa ? `Todas en ${ccaa}` : 'Elige primero una comunidad'}</option>
                  {provinciasVisibles.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tema</label>
                <select
                  value={tema}
                  onChange={(e) => setFilter('tema', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                  <option value="">Todos</option>
                  {TEMAS_COMUNIDAD.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ordenar por</label>
                <select
                  value={orden}
                  onChange={(e) => setFilter('orden', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                  {ORDENES_COMUNIDAD.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {provinciaInicial && (
              <button
                onClick={abrirCrear}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors lg:self-end"
              >
                Abrir conversación
              </button>
            )}
          </div>
        </section>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
          {loading ? (
            <LoadingRows count={4} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : publicaciones.length === 0 ? (
            <EmptyState
              titulo={provinciaDisplay ? `Aún no hay conversaciones en ${provinciaDisplay}` : 'Aún no hay conversaciones'}
              mensaje={provinciaDisplay
                ? 'Puedes ser la primera persona en abrir una.'
                : '¿Qué falta en tu ciudad? Abre una conversación y hazlo visible.'}
              accion={{ label: 'Crear conversación', href: '/comunidad/crear' }}
            />
          ) : (
            publicaciones.map((pub) => (
              <ListingRow
                key={pub.id}
                id={pub.id}
                titulo={pub.titulo}
                descripcion={pub.contenido}
                categoria={pub.tema}
                provincia={pub.provincia}
                fecha={pub.creado_at}
                autor={pub.usuario_nombre || 'Anónimo'}
                url={`/comunidad/publicacion/${pub.id}`}
                tipo="comunidad"
                metadatoExtra={`${pub.respuestas_count || 0} respuestas · ${pub.likes_count || 0} apoyos`}
                onReportar={() => setReportarId(pub.id)}
              />
            ))
          )}
        </div>
      </main>

      <Footer />

      <ReportModal
        isOpen={!!reportarId}
        onClose={() => setReportarId(null)}
        onSubmit={handleReportar}
        loading={reportarLoading}
      />

      <NombreModal
        isOpen={pedirNombre}
        onClose={() => setPedirNombre(false)}
        onSubmit={handleGuardarNombre}
      />
    </div>
  );
}
