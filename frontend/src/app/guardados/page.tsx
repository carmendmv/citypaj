'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGuardados } from '@/hooks/useGuardados';
import { useComunidad } from '@/hooks/useComunidad';
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

      try {
        // Aquí iría la lógica para cargar los anuncios desde el backend
        // Por ahora, simulamos con datos de ejemplo
        const ids = guardados.map(g => g.anuncioId);
        console.log('Anuncios guardados:', ids);
        
        // Simulación de carga
        setTimeout(() => {
          setAnunciosGuardados([]); // Vacío por ahora
          setCargandoAnuncios(false);
        }, 500);
      } catch (error) {
        console.error('Error al cargar anuncios guardados:', error);
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
            <div className="mt-8 space-y-4">
              {anunciosGuardados.map((anuncio) => (
                <div key={anuncio.id} className="border border-black p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-black mb-2">
                        {anuncio.titulo}
                      </h3>
                      <p className="font-sans text-sm text-gray-600 mb-3">
                        {anuncio.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs font-sans text-gray-500">
                        <span className="border border-gray-300 px-2 py-1">
                          {anuncio.categoria}
                        </span>
                        <span className="border border-gray-300 px-2 py-1">
                          {anuncio.comunidad_autonoma}
                        </span>
                      </div>
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
