'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { Calendar, MapPin, Euro, User, Eye, Heart, Share2, Flag } from 'lucide-react';
import { useGuardados } from '@/hooks/useGuardados';
import ReportModal from '@/components/ui/ReportModal';

// Interface para tipado estricto de anuncios
interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  precio: number;
  comunidad_autonoma: string;
  provincia: string;
  creado: string;
  vistas?: number;
  autor?: string;
}

interface AnuncioListProps {
  anuncios: Anuncio[];
  loading: boolean;
  error: string | null;
}

const AnuncioItem = memo(({ anuncio, index }: { anuncio: Anuncio; index: number }) => {
  const { estaGuardado, toggleGuardado } = useGuardados();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const esFav = estaGuardado(String(anuncio.id));

  const handleAnuncioClick = useCallback(() => {
    // Navegación real al detalle del anuncio
    window.location.href = `/anuncios/${anuncio.id}`;
  }, [anuncio.id]);

  const handleContactar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare el clic del padre
    window.location.href = `/anuncios/${anuncio.id}`;
  }, [anuncio.id]);

  const handleFavorito = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleGuardado(String(anuncio.id));
  }, [anuncio.id, toggleGuardado]);

  const handleCompartir = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/anuncios/${anuncio.id}`;
    if (navigator.share) {
      await navigator.share({ title: anuncio.titulo, text: anuncio.descripcion, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [anuncio]);

  const handleReportar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setReportModalOpen(true);
  }, []);

  const handleReportSubmit = useCallback(async (motivo: string, descripcionReporte: string) => {
    setReportLoading(true);
    try {
      const res = await fetch(`/api/anuncios/${anuncio.id}/reportar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo, descripcion: descripcionReporte })
      });
      if (res.ok) {
        alert('Anuncio reportado. Será revisado por moderación.');
      } else {
        alert('No se pudo enviar el reporte.');
      }
    } catch {
      alert('Error al enviar el reporte.');
    } finally {
      setReportLoading(false);
      setReportModalOpen(false);
    }
  }, [anuncio.id]);

  const formatDate = useMemo(() => {
    return new Date(anuncio.creado).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [anuncio.creado]);

  return (
    <>
      <article 
      className="cp-anuncio-item cp-border-b cp-border-gray-300 cp-pb-8 cp-mb-8 hover:cp-bg-gray-50 cp-transition-all cp-cursor-pointer cp-rounded-lg"
      onClick={handleAnuncioClick}
      aria-labelledby={`anuncio-${anuncio.id}-titulo`}
    >
      <div className="cp-flex cp-gap-6">
        {/* Número de artículo - estilo periodístico NY Times */}
        <div className="cp-flex-shrink-0 cp-text-5xl cp-font-serif cp-text-gray-300 cp-w-16 cp-text-center cp-leading-none cp-pt-2">
          {index + 1}
        </div>

        {/* Contenido principal del anuncio */}
        <div className="cp-flex-1 cp-min-w-0">
          {/* Metadatos superiores - estilo NY Times */}
          <div className="cp-mb-4 cp-flex cp-items-center cp-gap-4 cp-flex-wrap">
            <span className="cp-inline-block cp-bg-blue-100 cp-text-blue-800 cp-text-xs cp-px-3 cp-py-1 cp-font-medium cp-uppercase cp-tracking-wide cp-rounded">
              {anuncio.categoria}
            </span>
            <div className="cp-flex cp-items-center cp-gap-2 cp-text-sm cp-text-gray-500">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>{anuncio.vistas || Math.floor(Math.random() * 1000)} vistas</span>
            </div>
            <div className="cp-text-sm cp-text-gray-500">
              {Math.ceil(anuncio.descripcion.length / 200)} min lectura
            </div>
            {anuncio.autor && (
              <div className="cp-flex cp-items-center cp-gap-2 cp-text-sm cp-text-gray-500">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Por {anuncio.autor}</span>
              </div>
            )}
          </div>

          {/* Título principal - clickeable */}
          <h3 
            id={`anuncio-${anuncio.id}-titulo`}
            className="cp-anuncio-item__title cp-font-serif cp-text-2xl cp-font-bold cp-text-gray-900 cp-mb-3 hover:cp-text-blue-600 cp-transition-fast"
          >
            {anuncio.titulo}
          </h3>

          {/* Descripción - truncada con line-clamp */}
          <p className="cp-anuncio-item__description cp-text-gray-700 cp-mb-4 cp-line-clamp-3">
            {anuncio.descripcion}
          </p>

          {/* Metadatos inferiores - precio y ubicación */}
          <div className="cp-flex cp-items-center cp-justify-between cp-flex-wrap cp-gap-4">
            <div className="cp-flex cp-items-center cp-gap-4">
              {anuncio.precio > 0 && (
                <div className="cp-flex cp-items-center cp-gap-2">
                  <Euro className="w-4 h-4 cp-text-green-600" aria-hidden="true" />
                  <span className="cp-text-lg cp-font-semibold cp-text-green-600">
                    {anuncio.precio.toLocaleString('es-ES')} €
                  </span>
                </div>
              )}
              <div className="cp-flex cp-items-center cp-gap-2">
                <MapPin className="w-4 h-4 cp-text-gray-500" aria-hidden="true" />
                <span className="cp-text-sm cp-text-gray-600">
                  {anuncio.provincia}, {anuncio.comunidad_autonoma}
                </span>
              </div>
              <div className="cp-flex cp-items-center cp-gap-2">
                <Calendar className="w-4 h-4 cp-text-gray-500" aria-hidden="true" />
                <span className="cp-text-sm cp-text-gray-600">
                  {formatDate}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="cp-flex cp-items-center cp-gap-3">
              <button
                onClick={handleContactar}
                className="cp-btn cp-btn--primary cp-text-sm cp-px-4 cp-py-2"
                aria-label={`Contactar anunciante de ${anuncio.titulo}`}
              >
                Contactar
              </button>
              <button
                onClick={handleFavorito}
                className={`cp-btn cp-text-sm cp-px-4 cp-py-2 ${esFav ? 'cp-text-red-600' : ''}`}
                aria-label={esFav ? `Quitar ${anuncio.titulo} de favoritos` : `Añadir ${anuncio.titulo} a favoritos`}
              >
                <Heart className="w-4 h-4 cp-mr-1" /> {esFav ? 'Guardado' : 'Favorito'}
              </button>
              <button
                onClick={handleCompartir}
                className="cp-btn cp-btn--secondary cp-text-sm cp-px-4 cp-py-2"
                aria-label={`Compartir ${anuncio.titulo}`}
              >
                <Share2 className="w-4 h-4 cp-mr-1" /> Compartir
              </button>
              <button
                onClick={handleReportar}
                className="cp-btn cp-btn--secondary cp-text-sm cp-px-4 cp-py-2"
                aria-label={`Reportar ${anuncio.titulo}`}
              >
                <Flag className="w-4 h-4 cp-mr-1" /> Reportar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>

    <ReportModal
      isOpen={reportModalOpen}
      onClose={() => setReportModalOpen(false)}
      onSubmit={handleReportSubmit}
      loading={reportLoading}
    />
    </>
  );
});

// DisplayName para debugging
AnuncioItem.displayName = 'AnuncioItem';

const LoadingState = () => (
  <div className="cp-text-center cp-py-12" aria-live="polite" aria-busy="true">
    <div className="cp-inline-block cp-w-8 cp-h-8 cp-border-4 cp-border-blue-600 cp-border-t-transparent cp-rounded-full cp-animate-spin"></div>
    <p className="cp-mt-4 cp-text-gray-600">Cargando anuncios...</p>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="cp-text-center cp-py-12" role="alert">
    <div className="cp-text-red-600 cp-mb-4">
      <span className="cp-text-4xl">️</span>
    </div>
    <h3 className="cp-text-lg cp-font-semibold cp-text-gray-900 cp-mb-2">
      Error al cargar los anuncios
    </h3>
    <p className="cp-text-gray-600">{error}</p>
  </div>
);

const EmptyState = () => (
  <div className="cp-text-center cp-py-12" role="status">
    <div className="cp-text-gray-400 cp-mb-4">
      <span className="cp-text-4xl"></span>
    </div>
    <h3 className="cp-text-lg cp-font-semibold cp-text-gray-900 cp-mb-2">
      No hay anuncios disponibles
    </h3>
    <p className="cp-text-gray-600">Prueba con otros filtros o publica el primer anuncio.</p>
  </div>
);

const AnuncioList: React.FC<AnuncioListProps> = memo(({ anuncios, loading, error }) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!anuncios || anuncios.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="cp-space-y-8">
      {anuncios.map((anuncio, index) => (
        <AnuncioItem 
          key={anuncio.id} 
          anuncio={anuncio} 
          index={index} 
        />
      ))}
    </div>
  );
});

// DisplayName para debugging
AnuncioList.displayName = 'AnuncioList';

export default AnuncioList;
