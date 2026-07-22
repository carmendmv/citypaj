'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import PageHeader from '@/components/ui/PageHeader';

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  provincia: string;
  tema: string;
  creado_at: string;
  usuario_nombre?: string;
}

interface ComunidadData {
  id: number;
  nombre: string;
  provincias: string[];
}

const TEMAS = ['todos', 'general', 'empleo', 'vivienda', 'ocio', 'cultura', 'participacion'];

function ComunidadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [comunidades, setComunidades] = useState<ComunidadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ccaa = searchParams.get('ccaa') || '';
  const provincia = searchParams.get('provincia') || '';
  const tema = searchParams.get('tema') || '';

  useEffect(() => {
    const cargarComunidades = async () => {
      try {
        const res = await fetch('/api/comunidad/provincias');
        const data = await res.json();
        if (data.success) setComunidades(data.data || []);
      } catch (err) {
        console.error('Error cargando comunidades:', err);
      }
    };
    cargarComunidades();
  }, []);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (provincia) params.set('provincia', provincia);
        else if (ccaa) params.set('comunidad_autonoma', ccaa);
        if (tema && tema !== 'todos') params.set('tema', tema);

        const res = await fetch(`/api/comunidad?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setPublicaciones(data.data || []);
        } else {
          setError(data.error || 'Error cargando publicaciones');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    cargarPublicaciones();
  }, [ccaa, provincia, tema]);

  const setFilter = (key: 'ccaa' | 'provincia' | 'tema', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'ccaa') {
      if (value && value !== 'todas') {
        params.set('ccaa', value);
      } else {
        params.delete('ccaa');
      }
      params.delete('provincia');
    } else if (key === 'provincia') {
      if (value && value !== 'todas') {
        const parent = comunidades.find((c) => c.provincias.includes(value));
        if (parent) params.set('ccaa', parent.nombre);
        params.set('provincia', value);
      } else {
        params.delete('provincia');
      }
    } else {
      if (value && value !== 'todos') {
        params.set('tema', value);
      } else {
        params.delete('tema');
      }
    }
    router.push(`/comunidad?${params.toString()}`);
  };

  const provinciasVisibles = comunidades.find((c) => c.nombre === ccaa)?.provincias || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHeader titulo="Comunidad" subtitulo="Foros por comunidad autónoma y provincia para que la juventud converse.">
        <Link
          href="/comunidad/nuevo"
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          Nueva publicación
        </Link>
      </PageHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Foros por comunidad autónoma</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('ccaa', 'todas')}
              className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${
                !ccaa ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {comunidades.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter('ccaa', c.nombre)}
                className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${
                  ccaa === c.nombre ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          {ccaa && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Provincias de {ccaa}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFilter('provincia', 'todas')}
                  className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                    !provincia ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {provinciasVisibles.map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter('provincia', p)}
                    className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                      provincia === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <select
              value={ccaa}
              onChange={(e) => setFilter('ccaa', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            >
              <option value="">Todas las comunidades</option>
              {comunidades.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            <select
              value={tema}
              onChange={(e) => setFilter('tema', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            >
              <option value="todos">Todos los temas</option>
              {TEMAS.filter((t) => t !== 'todos').map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {ccaa && (
            <div className="mt-4">
              <select
                value={provincia}
                onChange={(e) => setFilter('provincia', e.target.value)}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                <option value="">Todas las provincias de {ccaa}</option>
                {provinciasVisibles.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
          {loading ? (
            <LoadingRows count={4} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : publicaciones.length === 0 ? (
            <EmptyState
              titulo="Aún no hay publicaciones"
              mensaje="Sé el primero en compartir algo en tu comunidad."
              accion={{ label: 'Crear publicación', href: '/comunidad/nuevo' }}
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
                url={`/comunidad/${pub.id}`}
                tipo="comunidad"
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ComunidadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ComunidadContent />
    </Suspense>
  );
}
