'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingRow from '@/components/ui/ListingRow';
import ReportModal from '@/components/ui/ReportModal';
import { useGuardados } from '@/hooks/useGuardados';
import { Anuncio } from '@/types';

export default function GuardadosPage() {
  const { guardados, loading, toggleGuardado, limpiarGuardados } = useGuardados();
  const [anunciosGuardados, setAnunciosGuardados] = useState<Anuncio[]>([]);
  const [cargandoAnuncios, setCargandoAnuncios] = useState(true);
  const [reportandoId, setReportandoId] = useState<string | null>(null);
  const [reportandoLoading, setReportandoLoading] = useState(false);

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

  const reportar = async (id: string, motivo: string, descripcion: string) => {
    setReportandoLoading(true);
    try {
      const res = await fetch(`/api/anuncios/${id}/reportar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, descripcion })
      });
      if (res.ok) alert('Anuncio reportado. Será revisado por moderación.');
      else alert('No se pudo enviar el reporte.');
    } catch {
      alert('Error al enviar el reporte.');
    } finally {
      setReportandoLoading(false);
      setReportandoId(null);
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
            <div>
              <h2 className="font-serif text-xl font-bold text-black">Listado de anuncios guardados</h2>
              {!cargandoAnuncios && (
                <p className="font-sans text-sm text-gray-500 mt-1">
                  {anunciosGuardados.length} anuncio{anunciosGuardados.length !== 1 ? 's' : ''} disponible{anunciosGuardados.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {anunciosGuardados.length > 0 && (
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
          ) : anunciosGuardados.length === 0 ? (
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
            <div className="mt-6 space-y-1">
              {anunciosGuardados.map((anuncio) => (
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
                  esFavorito={true}
                  onFavorito={() => toggleGuardado(anuncio.id)}
                  onReportar={() => setReportandoId(anuncio.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ReportModal
        isOpen={!!reportandoId}
        onClose={() => setReportandoId(null)}
        onSubmit={(motivo, descripcion) => reportandoId && reportar(reportandoId, motivo, descripcion)}
        loading={reportandoLoading}
      />
      <Footer />
    </div>
  );
}
