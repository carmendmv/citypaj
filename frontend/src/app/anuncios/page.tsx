'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';

interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  comunidad_autonoma: string;
  provincia: string;
  creado_at: string;
  usuario_nombre?: string;
  es_favorito?: boolean;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const COMUNIDADES = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
  'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunidad Valenciana',
  'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

const CATEGORIAS = ['todos', 'empleo', 'formacion', 'vivienda', 'ocio', 'servicios', 'comunidad', 'transporte', 'salud', 'tecnología', 'otros'];

const ORDEN = [
  { value: 'creado-desc', label: 'Más recientes' },
  { value: 'creado-asc', label: 'Más antiguos' },
  { value: 'vistas-desc', label: 'Más vistos' },
];

function AnunciosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoria = searchParams.get('categoria') || '';
  const comunidad = searchParams.get('comunidad') || '';
  const busqueda = searchParams.get('busqueda') || '';
  const orden = searchParams.get('ordenar') || 'creado-desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchAnuncios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      params.set('ordenar', orden);
      if (categoria && categoria !== 'todos') params.set('categoria', categoria);
      if (comunidad) params.set('comunidad_autonoma', comunidad);
      if (busqueda) params.set('busqueda', busqueda);

      const res = await fetch(`/api/anuncios?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnuncios(data.data);
        setMeta(data.meta);
      } else {
        setError(data.error || 'Error cargando anuncios');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, [categoria, comunidad, busqueda, orden, page]);

  useEffect(() => {
    fetchAnuncios();
  }, [fetchAnuncios]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'todos') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/anuncios?${params.toString()}`);
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

      <PageHeader titulo="Oportunidades cercanas" subtitulo="Explora anuncios de empleo, formación, vivienda y más.">
        <Link
          href="/publicar"
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          Publicar anuncio
        </Link>
      </PageHeader>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filtros */}
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => updateFilter('busqueda', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            />
            <select
              value={categoria}
              onChange={(e) => updateFilter('categoria', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            >
              <option value="todos">Todas las categorías</option>
              {CATEGORIAS.filter(c => c !== 'todos').map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <select
              value={comunidad}
              onChange={(e) => updateFilter('comunidad', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            >
              <option value="">Toda España</option>
              {COMUNIDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={orden}
              onChange={(e) => updateFilter('ordenar', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            >
              {ORDEN.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {meta ? `${meta.total} resultados` : 'Cargando...'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
          {loading ? (
            <LoadingRows count={5} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : anuncios.length === 0 ? (
            <EmptyState
              titulo="No hay anuncios"
              mensaje="Prueba con otros filtros o sé el primero en publicar."
              accion={{ label: 'Publicar anuncio', href: '/publicar' }}
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
                autor={anuncio.usuario_nombre || 'Anónimo'}
                url={`/anuncios/${anuncio.id}`}
                esFavorito={anuncio.es_favorito}
                onFavorito={() => guardar(anuncio.id)}
                onReportar={() => reportar(anuncio.id)}
              />
            ))
          )}
        </div>

        {/* Paginación */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(p) => updateFilter('page', p.toString())}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AnunciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AnunciosContent />
    </Suspense>
  );
}
