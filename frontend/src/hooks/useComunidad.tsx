'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ComunidadContextType {
  comunidadAutonoma: string;
  setComunidadAutonoma: (comunidad: string) => void;
  clearComunidad: () => void;
}

const ComunidadContext = createContext<ComunidadContextType | undefined>(undefined);

export const ComunidadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comunidadAutonoma, setComunidadState] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('citypaj_comunidad');
      if (saved) {
        setComunidadState(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (comunidadAutonoma) {
        localStorage.setItem('citypaj_comunidad', comunidadAutonoma);
      } else {
        localStorage.removeItem('citypaj_comunidad');
      }
    }
  }, [comunidadAutonoma]);

  const setComunidadAutonoma = (comunidad: string) => {
    setComunidadState(comunidad === 'Todas' ? '' : comunidad);
  };

  const clearComunidad = () => {
    setComunidadState('');
  };

  const value = {
    comunidadAutonoma,
    setComunidadAutonoma,
    clearComunidad,
  };

  return (
    <ComunidadContext.Provider value={value}>
      {children}
    </ComunidadContext.Provider>
  );
}

export function useComunidad() {
  const context = useContext(ComunidadContext);
  if (context === undefined) {
    throw new Error('useComunidad debe ser usado dentro de ComunidadProvider');
  }
  return context;
}