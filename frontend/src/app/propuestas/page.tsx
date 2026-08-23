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

interface Propuesta {
  id: number;
  titulo: string;
  descripcion: string;
  provincia: string;
  categoria: string;
  apoyos: number;
  creado_at: string;
  usuario_nombre?: string;
}

const CATEGORIAS = ['todos', 'Empleo y Formación', 'Vivienda', 'Cultura y Ocio', 'Transporte', 'Medio Ambiente', 'Salud y Bienestar', 'Participación Ciudadana'];

function PropuestasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoria = searchParams.get('categoria') || '';

  useEffect(() => {
    cargarPropuestas();
  }, [categoria]);

  const cargarPropuestas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria && categoria !== 'todos') params.set('categoria', categoria);
      const res = await fetch(`/api/propuestas?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPropuestas(data.data || []);
      } else {
        setError(data.error || 'Error cargando propuestas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const apoyar = async (id: number) => {
    try {
      await fetch(`/api/propuestas/${id}/apoyar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: 'usuario-anonimo' })
      });
      cargarPropuestas();
    } catch (err) {
      console.error('Error apoyando:', err);
    }
  };

  const updateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'todos') {
      params.set('categoria', value);
    } else {
      params.delete('categoria');
    }
    router.push(`/propuestas?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PageHeader titulo="Propuestas ciudadanas" subtitulo="Ideas y propuestas para mejorar tu provincia. Apoya las que más te gusten.">
        <Link
          href="/propuestas/nueva"
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          Nueva propuesta
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
          ) : propuestas.length === 0 ? (
            <EmptyState
              titulo="Aún no hay propuestas"
              mensaje="Sé el primero en lanzar una propuesta para tu comunidad."
              accion={{ label: 'Crear propuesta', href: '/propuestas/nueva' }}
            />
          ) : (
            propuestas.map((prop) => (
              <ListingRow
                key={prop.id}
                id={prop.id}
                titulo={prop.titulo}
                descripcion={prop.descripcion}
                categoria={prop.categoria}
                provincia={prop.provincia}
                fecha={prop.creado_at}
                autor={prop.usuario_nombre || 'Anónimo'}
                url={`/propuestas/${prop.id}`}
                metadatoExtra={`${prop.apoyos} apoyos`}
                tipo="propuesta"
                onFavorito={() => apoyar(prop.id)}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PropuestasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PropuestasContent />
    </Suspense>
  );
}
