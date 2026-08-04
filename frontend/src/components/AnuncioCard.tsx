'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartIcon, FlagIcon, PhoneIcon, EnvelopeIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { AnuncioCardProps } from '../types';
import { useGuardados } from '@/hooks/useGuardados';
import ReportModal from './ui/ReportModal';

export const AnuncioCard: React.FC<AnuncioCardProps> = ({
  anuncio,
  onFavorito,
  onReportar,
  onContactar,
  esFavorito,
  className = '',
}) => {
  const { estaGuardado, toggleGuardado } = useGuardados();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const favorito = esFavorito ?? estaGuardado(anuncio.id);

  const handleReportSubmit = async (motivo: string, descripcionReporte: string) => {
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
  };

  const formatoPrecio = (precio?: number) => {
    if (!precio) return '';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(precio);
  };

  const formatoFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffHoras = Math.floor((ahora.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHoras < 1) return 'Ahora mismo';
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffHoras < 48) return 'Ayer';
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getIconoCategoria = (categoria: string) => {
    const iconos: Record<string, string> = {
      'educacion': '',
      'empleo': '',
      'vivienda': '',
      'ocio': '',
      'servicios': '',
      'intercambios': '',
      'venta': '️',
      'regalo': '',
    };
    return iconos[categoria.toLowerCase()] || '';
  };

  const getColorModalidad = (modalidad: string) => {
    const colores: Record<string, string> = {
      'venta': 'bg-blue-100 text-blue-800',
      'regalo': 'bg-green-100 text-green-800',
      'intercambio': 'bg-purple-100 text-purple-800',
      'servicio': 'bg-orange-100 text-orange-800',
    };
    return colores[modalidad] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Link 
      href={`/anuncios/${anuncio.id}`}
      className={clsx(
        'block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
        'group cursor-pointer overflow-hidden',
        className
      )}
      role="article"
      aria-label={`Anuncio: ${anuncio.titulo}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Imagen principal */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100">
          {anuncio.imagenes && anuncio.imagenes.length > 0 ? (
            <img
              src={anuncio.imagenes[0].url_thumbnail || anuncio.imagenes[0].url}
              alt={anuncio.titulo}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-4xl">{getIconoCategoria(anuncio.categoria)}</span>
            </div>
          )}
          
          {/* Indicador de número de imágenes */}
          {anuncio.numero_imagenes && anuncio.numero_imagenes > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{anuncio.numero_imagenes - 1}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {anuncio.titulo}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="capitalize">{anuncio.provincia}</span>
                {anuncio.barrio && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{anuncio.barrio}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatoFecha(anuncio.creado_at)}</span>
              </div>
            </div>
            
            {/* Botón favorito */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onFavorito) {
                  onFavorito(anuncio.id);
                } else {
                  toggleGuardado(anuncio.id);
                }
              }}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              {favorito ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Descripción */}
          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
            {anuncio.descripcion}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Precio */}
              {anuncio.precio && (
                <span className="font-semibold text-lg text-gray-900">
                  {formatoPrecio(anuncio.precio)}
                </span>
              )}
              
              {/* Modalidad */}
              <span className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getColorModalidad(anuncio.modalidad)
              )}>
                {anuncio.modalidad}
              </span>
            </div>

            {/* Contacto */}
            <div className="flex items-center gap-1">
              {anuncio.contacto_email && (
                <EnvelopeIcon className="w-4 h-4 text-gray-400" title="Contacto por email" />
              )}
              {anuncio.contacto_telefono && (
                <PhoneIcon className="w-4 h-4 text-gray-400" title="Contacto por teléfono" />
              )}
              {anuncio.contacto_anonimo && (
                <span className="text-xs text-gray-500" title="Contacto anónimo"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Por <span className="font-medium">{anuncio.usuario_nombre}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContactar?.(anuncio.id);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contactar
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/anuncios/${anuncio.id}`;
              if (navigator.share) {
                await navigator.share({ title: anuncio.titulo, text: anuncio.descripcion, url });
              } else {
                await navigator.clipboard.writeText(url);
              }
            }}
            className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            aria-label="Compartir anuncio"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onReportar) {
                onReportar(anuncio.id);
              } else {
                setReportModalOpen(true);
              }
            }}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FlagIcon className="w-3 h-3 mr-1" />
            Reportar
          </button>
        </div>
      </div>
    </Link>

    <ReportModal
      isOpen={reportModalOpen}
      onClose={() => setReportModalOpen(false)}
      onSubmit={handleReportSubmit}
      loading={reportLoading}
    />
    </>
  );
};

export default AnuncioCard;
