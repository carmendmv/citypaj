'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string;
  creado_at: string;
  categoria?: string;
  comunidad_autonoma?: string;
  provincia?: string;
  estado_moderacion?: string;
  visible?: number;
};

export default function MisAnunciosPage() {
  const router = useRouter();
    const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/acceder');
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/anuncios/mis-anuncios', {
          headers: { Authorization: `Bearer ${accessToken || ''}` },
        });
        const json = await res.json();
        setAnuncios(json?.data || []);
      } catch {
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;
    
    try {
      const res = await fetch(`/api/anuncios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken || ''}` },
      });
      if (res.ok) {
        setAnuncios(anuncios.filter(a => a.id !== id));
      } else {
        alert('No se pudo eliminar el anuncio');
      }
    } catch {
      alert('Error al eliminar el anuncio');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Mis Anuncios</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestión de tus publicaciones</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-black">Tus anuncios</h2>
            <Link
              href="/publicar"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
            >
              Publicar nuevo
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">Cargando...</div>
          ) : anuncios.length === 0 ? (
            <div className="mt-6 text-center py-10">
              <p className="font-sans text-sm text-black/80">
                No tienes anuncios publicados todavía.
              </p>
              <Link
                href="/publicar"
                className="inline-flex items-center justify-center mt-4 bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publicar mi primer anuncio
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {anuncios.map((anuncio) => {
                const estado = anuncio.estado_moderacion === 'approved' ? 'Aprobado' : anuncio.estado_moderacion === 'rejected' ? 'Rechazado' : anuncio.estado_moderacion === 'flagged' ? 'En revisión' : 'Pendiente';
                const estadoColor = anuncio.estado_moderacion === 'approved' ? 'bg-emerald-100 text-emerald-800' : anuncio.estado_moderacion === 'rejected' ? 'bg-red-100 text-red-800' : anuncio.estado_moderacion === 'flagged' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800';
                return (
                  <div key={anuncio.id} className="border border-black p-5 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-serif text-xl font-bold text-black">
                            {anuncio.titulo}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor}`}>
                            {estado}
                          </span>
                        </div>
                        <p className="font-sans text-sm text-gray-600 mb-3 leading-relaxed">
                          {anuncio.descripcion.length > 150
                            ? `${anuncio.descripcion.slice(0, 147)}...`
                            : anuncio.descripcion}
                        </p>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                          <span>{anuncio.categoria || 'Sin categoría'}</span>
                          <span>{anuncio.provincia ? `${anuncio.provincia}, ` : ''}{anuncio.comunidad_autonoma || 'Sin comunidad'}</span>
                          <span>{new Date(anuncio.creado_at).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2">
                        <Link
                          href={`/anuncios/${anuncio.id}`}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-sans"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>
                        <Link
                          href={`/anuncios/${anuncio.id}/editar`}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm font-sans"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(anuncio.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-black text-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-sm font-sans"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
