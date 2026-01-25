'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useAITranslation } from '@/lib/ai-translation';

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string;
  creado: string;
  categoria?: string;
  comunidad_autonoma?: string;
};

export default function MisAnunciosPage() {
  const router = useRouter();
  const { t } = useAITranslation();
  const { user } = useAuth();
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
        const res = await fetch(`/api/anuncios?email=${encodeURIComponent(user.email)}&orden=fecha_desc&limite=50`);
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
      const res = await fetch(`/api/anuncios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnuncios(anuncios.filter(a => a.id !== id));
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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">{t('my_ads.title')}</h1>
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
            <div className="mt-6 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">{t('common.loading')}</div>
          ) : anuncios.length === 0 ? (
            <div className="mt-6">
              <p className="font-sans text-sm text-black/80">
                {t('my_ads.no_ads')}
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="border border-black p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-black mb-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="font-sans text-sm text-gray-600 mb-3">
                        {anuncio.descripcion.length > 150 
                          ? `${anuncio.descripcion.slice(0, 147)}...` 
                          : anuncio.descripcion}
                      </p>
                      <div className="text-xs text-gray-500">
                        <span>{anuncio.categoria || 'Sin categoría'}</span> • 
                        <span> {anuncio.comunidad_autonoma || 'Sin comunidad'}</span> • 
                        <span> {new Date(anuncio.creado).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <Link
                        href={`/anuncios/${anuncio.id}/editar`}
                        className="flex items-center gap-2 text-black hover:text-orange-500 hover:underline transition-colors text-sm font-sans"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t('my_ads.edit')}
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(anuncio.id)}
                        className="flex items-center gap-2 text-black hover:text-orange-500 hover:underline transition-colors text-sm font-sans"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('my_ads.delete')}
                      </button>
                      
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        {t('my_ads.code')} {anuncio.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
