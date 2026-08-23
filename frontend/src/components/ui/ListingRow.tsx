'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Flag, Eye, Share2 } from 'lucide-react';
import { useGuardados } from '@/hooks/useGuardados';
import { getCategoriaLabel, normalizarCategoria } from '@/lib/categorias';
import ReportModal from './ReportModal';

interface ListingRowProps {
  id: string | number;
  titulo: string;
  descripcion?: string;
  categoria: string;
  provincia?: string;
  fecha?: string;
  precio?: number | null;
  estado?: string;
  autor?: string;
  url: string;
  esFavorito?: boolean;
  onFavorito?: () => void;
  onReportar?: () => void;
  verificado?: boolean;
  tipo?: 'anuncio' | 'comunidad' | 'propuesta' | 'recurso' | 'evento';
  metadatoExtra?: string;
}

const categoriaColors: Record<string, string> = {
  empleo: 'bg-blue-100 text-blue-800 border-blue-200',
  formacion: 'bg-violet-100 text-violet-800 border-violet-200',
  vivienda: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  ocio: 'bg-amber-100 text-amber-800 border-amber-200',
  cultura: 'bg-purple-100 text-purple-800 border-purple-200',
  ayudas: 'bg-rose-100 text-rose-800 border-rose-200',
  becas: 'bg-pink-100 text-pink-800 border-pink-200',
  voluntariado: 'bg-lime-100 text-lime-800 border-lime-200',
  servicios: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  comunidad: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  transporte: 'bg-orange-100 text-orange-800 border-amber-200',
  salud: 'bg-teal-100 text-teal-800 border-teal-200',
  tecnologia: 'bg-sky-100 text-sky-800 border-sky-200',
  otros: 'bg-gray-100 text-gray-800 border-gray-200',
};

const formatFecha = (fecha?: string) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const resumen = (texto?: string, max = 120) => {
  if (!texto) return '';
  if (texto.length <= max) return texto;
  return texto.slice(0, max).trim() + '...';
};

export default function ListingRow({
  id,
  titulo,
  descripcion,
  categoria,
  provincia,
  fecha,
  precio,
  estado,
  autor,
  url,
  esFavorito,
  onFavorito,
  onReportar,
  verificado = false,
  tipo = 'anuncio',
  metadatoExtra
}: ListingRowProps) {
  const { estaGuardado, toggleGuardado } = useGuardados();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const badgeColor = categoriaColors[normalizarCategoria(categoria)] || categoriaColors.otros;
  const idValido = id && id !== 'undefined' && id !== 'null' && String(id).trim() !== '';
  const anuncioId = String(id);
  const favorito = esFavorito ?? estaGuardado(anuncioId);
  const puedeFav = tipo === 'anuncio' || tipo === 'propuesta';
  const puedeReportar = tipo === 'anuncio' || Boolean(onReportar);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorito) {
      onFavorito();
    } else {
      toggleGuardado(anuncioId);
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReportar) {
      onReportar();
    } else {
      setReportModalOpen(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, text: descripcion, url: link });
      } else {
        await navigator.clipboard.writeText(link);
      }
    } catch {
      // El usuario canceló o falló: no hacer nada
    }
  };

  const handleReportSubmit = async (motivo: string, descripcionReporte: string) => {
    setReportLoading(true);
    try {
      const res = await fetch(`/api/anuncios/${anuncioId}/reportar`, {
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

  return (
    <>
      <Link
        href={idValido ? url : '/anuncios'}
        className="group block bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
                  {getCategoriaLabel(categoria)}
                </span>
                {verificado && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Verificado
                  </span>
                )}
                {estado && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {estado}
                  </span>
                )}
                {precio !== undefined && precio !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-black text-white">
                    {precio === 0 ? 'Gratis' : `${precio}€`}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                {titulo}
              </h3>

              {descripcion && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {resumen(descripcion)}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                {provincia && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {provincia}
                  </span>
                )}
                {fecha && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatFecha(fecha)}
                  </span>
                )}
                {autor && (
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {autor}
                  </span>
                )}
                {metadatoExtra && (
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                    {metadatoExtra}
                  </span>
                )}
              </div>
            </div>

            {idValido && puedeFav && (
              <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
                <button
                  onClick={handleFav}
                  className={`p-2 rounded-full transition-colors ${favorito ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  aria-label={favorito ? 'Quitar de favoritos' : 'Guardar favorito'}
                >
                  <Heart className={`w-5 h-5 ${favorito ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  aria-label="Compartir anuncio"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {puedeReportar && (
                  <button
                    onClick={handleReport}
                    className="p-2 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                    aria-label="Reportar"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
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
}
