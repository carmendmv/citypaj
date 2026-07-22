'use client';

import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import ActividadCulturalCard from './ActividadCulturalCard';

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

interface ActividadesCulturalesGridProps {
  comunidadAutonoma: string;
  className?: string;
}

export default function ActividadesCulturalesGrid({ comunidadAutonoma, className = '' }: ActividadesCulturalesGridProps) {
  const [actividades, setActividades] = useState<ActividadCultural[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchActividades = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar obtener datos de la API
        const response = await fetch(`/api/actividades-culturales?ccaa=${encodeURIComponent(comunidadAutonoma)}&limit=6`);
        
        if (response.ok) {
          const data = await response.json();
          setActividades(data.actividades || []);
          setIsFallback(data.isFallback || false);
        } else {
          throw new Error('Error al cargar actividades');
        }
      } catch (err) {
        console.error('Error cargando actividades culturales:', err);
        
        // Cargar datos fallback si la API falla
        try {
          const fallbackResponse = await fetch('/api/actividades-culturales/fallback');
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            setActividades(data.actividades.slice(0, 6) || []);
            setIsFallback(true);
          } else {
            throw new Error('Error cargando datos fallback');
          }
        } catch (fallbackErr) {
          console.error('Error cargando datos fallback:', fallbackErr);
          setError('No se pudieron cargar las actividades culturales');
          setActividades([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (comunidadAutonoma) {
      fetchActividades();
    }
  }, [comunidadAutonoma]);

  if (loading) {
    return (
      <section className={`mt-10 ${className}`}>
        <div className="border border-black p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-500 mr-2" />
            <span className="font-sans text-sm text-gray-600">Cargando actividades culturales...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || actividades.length === 0) {
    return (
      <section className={`mt-10 ${className}`}>
        <div className="border border-black p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-serif text-lg font-bold text-black mb-2">
              Actividades no disponibles
            </h3>
            <p className="font-sans text-sm text-gray-600 mb-4">
              {error || 'No hay actividades culturales disponibles en este momento.'}
            </p>
            {isFallback && (
              <p className="font-sans text-xs text-gray-500">
                Datos fallback — última actualización manual
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`mt-10 ${className}`}>
      {/* Header de la sección */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black mb-2">
          Actividades del ayuntamiento de {comunidadAutonoma}
        </h2>
        <p className="font-sans text-sm text-gray-600">
          Eventos culturales, formativos y de voluntariado en tu comunidad
        </p>
        {isFallback && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded">
            <AlertCircle className="w-3 h-3 text-yellow-600" />
            <span className="text-xs text-yellow-800 font-sans">
              Datos fallback — última actualización manual
            </span>
          </div>
        )}
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actividades.map((actividad) => (
          <ActividadCulturalCard
            key={actividad.id}
            actividad={actividad}
            className="h-full"
          />
        ))}
      </div>

      {/* Footer con información de la fuente */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            <p>Datos obtenidos del Portal nacional de datos abiertos (datos.gob.es)</p>
            <p>Catálogo "Agendas culturales" · Última sincronización: {new Date().toLocaleDateString('es-ES')}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-sans text-gray-600 hover:text-black border border-gray-300 hover:border-black transition-colors"
            aria-label="Actualizar actividades culturales"
          >
            <RefreshCw className="w-3 h-3" />
            Actualizar
          </button>
        </div>
      </div>
    </section>
  );
}
