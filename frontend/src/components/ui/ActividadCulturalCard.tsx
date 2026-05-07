'use client';

import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react';

interface ActividadCultural {
  id: string;
  title: string;
  short_description: string;
  start: string;
  end?: string;
  location: {
    ccaa: string;
    provincia: string;
    municipio: string;
    coords?: { lat: number; lng: number };
  };
  organizer?: string;
  categories: string[];
  cost?: string;
  image_url?: string;
  source_url: string;
  last_updated: string;
}

interface ActividadCulturalCardProps {
  actividad: ActividadCultural;
  className?: string;
}

export default function ActividadCulturalCard({ actividad, className = '' }: ActividadCulturalCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadge = (categories: string[]) => {
    if (categories.some(cat => cat.toLowerCase().includes('cultur'))) {
      return { text: 'Cultura', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (categories.some(cat => cat.toLowerCase().includes('formacion') || cat.toLowerCase().includes('taller'))) {
      return { text: 'Formación', color: 'bg-green-100 text-green-800 border-green-200' };
    }
    if (categories.some(cat => cat.toLowerCase().includes('voluntari') || cat.toLowerCase().includes('solidar'))) {
      return { text: 'Voluntariado', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    return { text: 'Cultura', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  const categoryBadge = getCategoryBadge(actividad.categories);

  return (
    <article 
      className={`group border border-black bg-white hover:border-orange-500 transition-all duration-200 h-full flex flex-col ${className}`}
      role="article"
      aria-labelledby={`actividad-title-${actividad.id}`}
    >
      {/* Imagen o placeholder */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {actividad.image_url ? (
          <img
            src={actividad.image_url}
            alt={actividad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center p-4">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-sans">Imagen no disponible</p>
            </div>
          </div>
        )}
        
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span 
            className={`inline-block px-2 py-1 text-xs font-sans font-medium border ${categoryBadge.color}`}
            aria-label={`Categoría: ${categoryBadge.text}`}
          >
            {categoryBadge.text}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Título */}
        <h3 
          id={`actividad-title-${actividad.id}`}
          className="font-serif text-lg font-bold text-black mb-2 group-hover:text-orange-500 transition-colors leading-tight"
        >
          {actividad.title}
        </h3>

        {/* Fecha y hora */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <time dateTime={actividad.start}>
            {formatDate(actividad.start)}
            {actividad.end && ` - ${formatDate(actividad.end)}`}
          </time>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          <span>
            {actividad.location.municipio}, {actividad.location.provincia}
          </span>
        </div>

        {/* Descripción */}
        <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4 flex-1 line-clamp-3">
          {actividad.short_description}
        </p>

        {/* Costo si existe */}
        {actividad.cost && (
          <div className="text-xs text-gray-600 mb-3">
            <span className="font-medium">Costo:</span> {actividad.cost}
          </div>
        )}

        {/* Organizador si existe */}
        {actividad.organizer && (
          <div className="text-xs text-gray-600 mb-3">
            <span className="font-medium">Organiza:</span> {actividad.organizer}
          </div>
        )}

        {/* Footer con fuente y CTA */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>Última actualización: {new Date(actividad.last_updated).toLocaleDateString('es-ES')}</p>
              <p>Fuente: datos.gob.es</p>
            </div>
            <a
              href={actividad.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-sans font-medium text-orange-500 hover:text-orange-600 transition-colors"
              aria-label={`Más información sobre ${actividad.title} (abre en nueva pestaña)`}
            >
              Más info
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
