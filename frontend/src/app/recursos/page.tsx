'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EmptyState from '@/components/ui/EmptyState';
import LoadingRows from '@/components/ui/LoadingRows';
import PageHeader from '@/components/ui/PageHeader';

interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  provincia: string;
  url?: string;
  verificado: boolean;
  creado_at: string;
}

const CATEGORIAS = ['todos', 'Oficinas de Juventud', 'Ayudas Municipales', 'Becas', 'Cursos Públicos', 'Vivienda', 'Orientación Laboral'];

function RecursosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoria = searchParams.get('categoria') || '';

  useEffect(() => {
    cargarRecursos();
  }, [categoria]);

  const cargarRecursos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria && categoria !== 'todos') params.set('categoria', categoria);
      const res = await fetch(`/api/recursos?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecursos(data.data || []);
      } else {
        setError(data.error || 'Error cargando recursos');
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
    router.push(`/recursos?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHeader titulo="Recursos" subtitulo="Enlaces, servicios y recursos verificados para jóvenes.">
        <Link
          href="/recursos/nuevo"
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          Añadir recurso
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
          ) : recursos.length === 0 ? (
            <EmptyState
              titulo="Aún no hay recursos"
              mensaje="Pronto añadiremos recursos verificados para jóvenes."
              accion={{ label: 'Añadir recurso', href: '/recursos/nuevo' }}
            />
          ) : (
            recursos.map((recurso) => (
              <div
                key={recurso.id}
                className="border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-cyan-100 text-cyan-800 border-cyan-200">
                        {recurso.categoria}
                      </span>
                      {recurso.verificado && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Verificado
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{recurso.titulo}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{recurso.descripcion}</p>
                    <p className="text-xs text-gray-500">{recurso.provincia}</p>
                  </div>
                  {recurso.url && (
                    <a
                      href={recurso.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors shrink-0"
                    >
                      Visitar <ExternalLink className="w-4 h-4" />
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

export default function RecursosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <RecursosContent />
    </Suspense>
  );
}
