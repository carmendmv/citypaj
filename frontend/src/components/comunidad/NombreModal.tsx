'use client';

import { useState } from 'react';

interface NombreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nombre: string) => void;
  title?: string;
}

export default function NombreModal({ isOpen, onClose, onSubmit, title }: NombreModalProps) {
  const [nombre, setNombre] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombre.trim();
    if (limpio.length < 2) return;
    onSubmit(limpio);
    setNombre('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">{title || '¿Cómo quieres aparecer?'}</h2>
        <p className="text-sm text-gray-600 mb-4">Introduce un nombre de usuario libre para participar. No hace falta iniciar sesión.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. AnaViveZgz"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            minLength={2}
            maxLength={30}
            required
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
