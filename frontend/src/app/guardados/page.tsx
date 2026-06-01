'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGuardados } from '@/hooks/useGuardados';
import { useComunidad } from '@/hooks/useComunidad';
import HeartButton from '@/components/ui/HeartButton';
import { Anuncio } from '@/types';

export default function GuardadosPage() {
  const { guardados, loading, limpiarGuardados } = useGuardados();
  const { comunidadAutonoma } = useComunidad();
  const [anunciosGuardados, setAnunciosGuardados] = useState<Anuncio[]>([]);
  const [cargandoAnuncios, setCargandoAnuncios] = useState(true);

  // Cargar anuncios guardados
  useEffect(() => {
    const cargarAnunciosGuardados = async () => {
      if (guardados.length === 0) {
        setAnunciosGuardados([]);
        setCargandoAnuncios(false);
        return;
      }

      setCargandoAnuncios(true);
      try {
        // Cargar los anuncios guardados desde el backend
        const ids = guardados.map(g => g.anuncioId);
        
        // Hacer petición para obtener los anuncios completos
        const response = await fetch('/api/anuncios/guardados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAnunciosGuardados(data.data);
          } else {
            setAnunciosGuardados([]);
          }
        } else {
          // Si el endpoint no existe, cargar anuncios individuales
          const anunciosCompletos = [];
          for (const id of ids) {
            try {
              const res = await fetch(`/api/anuncios/${id}`);
              if (res.ok) {
                const anuncioData = await res.json();
                if (anuncioData.success && anuncioData.data) {
                  anunciosCompletos.push(anuncioData.data);
                }
              }
            } catch (error) {
              console.error(`Error al cargar anuncio ${id}:`, error);
            }
          }
          setAnunciosGuardados(anunciosCompletos);
        }
      } catch (error) {
        console.error('Error al cargar anuncios guardados:', error);
        setAnunciosGuardados([]);
      } finally {
        setCargandoAnuncios(false);
      }
    };

    cargarAnunciosGuardados();
  }, [guardados]);

  const handleLimpiarGuardados = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos tus anuncios guardados?')) {
      limpiarGuardados();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-[90%] sm:w-[80%] max-w-6xl mx-auto px-6 py-16">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">
            Mis Anuncios Guardados
          </h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">
            Anuncios que has guardado para consultar más tarde
          </p>
        </div>

        <section className="mt-10 border border-black p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-black">
              Anuncios guardados ({guardados.length})
            </h2>
            
            {guardados.length > 0 && (
              <button
                onClick={handleLimpiarGuardados}
                className="inline-flex items-center justify-center border border-black px-4 py-2 font-sans text-sm text-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                Limpiar todos
              </button>
            )}
          </div>

          {loading || cargandoAnuncios ? (
            <div className="mt-6 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">
              Cargando...
            </div>
          ) : guardados.length === 0 ? (
            <div className="mt-6">
              <p className="font-sans text-sm text-black/80">
                No tienes anuncios guardados todavía.
              </p>
              <p className="font-sans text-sm text-black/60 mt-2">
                Haz clic en el corazón de cualquier anuncio para guardarlo aquí.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center mt-4 border border-black bg-black text-white px-4 py-2 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-colors"
              >
                Explorar anuncios
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {anunciosGuardados.map((anuncio) => (
                <div key={anuncio.id} className="border border-black p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-xl font-bold text-black hover:text-orange-500 transition-colors">
                          <Link href={`/anuncios/${anuncio.id}`}>
                            {anuncio.titulo}
                          </Link>
                        </h3>
                        <HeartButton anuncioId={anuncio.id} size="sm" showLabel={false} />
                      </div>
                      <p className="font-sans text-sm text-gray-600 mb-4 leading-relaxed">
                        {anuncio.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="font-sans text-xs text-gray-500 mb-1">Categoría</p>
                      <span className="inline-block border border-black px-2 py-1 font-sans text-xs">
                        {anuncio.categoria}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-gray-500 mb-1">Ubicación</p>
                      <p className="font-sans text-sm text-black">
                        {anuncio.provincia}, {anuncio.comunidad_autonoma}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-gray-500 mb-1">Publicado</p>
                      <p className="font-sans text-sm text-black">
                        {new Date(anuncio.creado).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Por: {anuncio.usuario_nombre || 'Anónimo'}</span>
                      {anuncio.email && (
                        <a 
                          href={`mailto:${anuncio.email}`}
                          className="hover:text-orange-500 transition-colors"
                        >
                          Contactar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
