'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export type Recipient = {
  id: string;
  nombre: string;
  email: string | null;
  provincia: string | null;
  rol?: string | null;
  tipo?: string | null;
  area?: string | null;
  tipo_destinatario: 'interno' | 'institucional';
  descripcion: string;
};

type RecipientInputProps = {
  tipo?: 'interno' | 'institucional' | 'todos';
  onSelect: (recipient: Recipient | null) => void;
  selected: Recipient | null;
  placeholder?: string;
  label?: string;
};

export function RecipientInput({
  tipo = 'interno',
  onSelect,
  selected,
  placeholder = 'Escribe un nombre, email, rol, provincia o institución...',
  label = 'Para:',
}: RecipientInputProps) {
  const { accessToken } = useAuth();
  const [q, setQ] = useState('');
  const [cargando, setCargando] = useState(false);
  const [sugerencias, setSugerencias] = useState<Recipient[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const buscar = useCallback(
    async (text: string) => {
      if (!text || text.length < 2) {
        setSugerencias([]);
        setBuscado(false);
        return;
      }
      setCargando(true);
      setBuscado(true);
      try {
        const res = await fetch(
          `/api/admin/destinatarios/buscar?q=${encodeURIComponent(text)}&tipo=${tipo}`,
          {
            headers: { Authorization: `Bearer ${accessToken || ''}` },
          }
        );
        const json = await res.json().catch(() => ({ data: [] }));
        setSugerencias(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setSugerencias([]);
      } finally {
        setCargando(false);
      }
    },
    [accessToken, tipo]
  );

  useEffect(() => {
    const timer = setTimeout(() => buscar(q), 250);
    return () => clearTimeout(timer);
  }, [q, buscar]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (r: Recipient) => {
    onSelect(r);
    setQ('');
    setSugerencias([]);
    setAbierto(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onSelect(null);
    setQ('');
    setSugerencias([]);
    setBuscado(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>}
      {selected ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
          <span className="flex-1">
            <strong>{selected.nombre}</strong>
            {selected.email && <span className="text-slate-500"> — {selected.email}</span>}
            {selected.tipo_destinatario === 'institucional' && (
              <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">institucional</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Cambiar destinatario"
          >
            
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            placeholder={placeholder}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          {abierto && (q.length > 0 || sugerencias.length > 0) && (
            <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
              {cargando ? (
                <div className="px-3 py-2 text-sm text-slate-500">Buscando...</div>
              ) : sugerencias.length > 0 ? (
                <ul className="max-h-60 overflow-auto">
                  {sugerencias.map((r, idx) => (
                    <li key={`${r.id}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleSelect(r)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-800">{r.nombre}</div>
                        <div className="text-xs text-slate-500">{r.descripcion}</div>
                        {r.tipo_destinatario === 'institucional' && (
                          <span className="mt-1 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                            Institucional
                          </span>
                        )}
                        {r.tipo_destinatario === 'interno' && r.rol && (
                          <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700">
                            {r.rol}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : buscado && !cargando ? (
                <div className="px-3 py-2 text-sm text-slate-500">
                  No se ha encontrado ningún destinatario
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}
