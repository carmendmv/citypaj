'use client';

import { useState } from 'react';
import { X, Flag } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (motivo: string, descripcion: string) => void;
  loading?: boolean;
}

const MOTIVOS = [
  { value: 'Contenido inapropiado', label: 'Contenido inapropiado' },
  { value: 'Spam', label: 'Spam o publicidad engañosa' },
  { value: 'Fraude', label: 'Fraude o estafa' },
  { value: 'Datos personales', label: 'Exposición de datos personales' },
  { value: 'Otro', label: 'Otro' },
];

export default function ReportModal({ isOpen, onClose, onSubmit, loading = false }: ReportModalProps) {
  const [motivo, setMotivo] = useState('Contenido inapropiado');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-black w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-black flex items-center gap-2">
            <Flag className="w-5 h-5 text-orange-500" />
            Reportar anuncio
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block font-sans text-xs text-gray-600 mb-2">Motivo</label>
        <select
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 mb-4"
        >
          {MOTIVOS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <label className="block font-sans text-xs text-gray-600 mb-2">Descripción (opcional)</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500 mb-6 resize-none"
          placeholder="Explica brevemente el problema..."
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-sans text-sm border border-black text-black hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(motivo, descripcion)}
            disabled={loading}
            className="px-4 py-2 font-sans text-sm bg-black text-white border border-black hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </div>
      </div>
    </div>
  );
}
