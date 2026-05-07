import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ComunidadContextType {
  comunidadAutonoma: string | null;
  setComunidadAutonoma: (comunidad: string | null) => void;
  clearComunidadAutonoma: () => void;
}

const ComunidadContext = createContext<ComunidadContextType | undefined>(undefined);

interface ComunidadProviderProps {
  children: ReactNode;
}

export const ComunidadProvider = ({ children }: ComunidadProviderProps) => {
  const [comunidadAutonoma, setComunidadAutonomaState] = useState<string | null>(null);

  // Cargar comunidad desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem('comunidadAutonoma');
    if (stored) {
      setComunidadAutonomaState(stored);
    }
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (comunidadAutonoma) {
      localStorage.setItem('comunidadAutonoma', comunidadAutonoma);
    } else {
      localStorage.removeItem('comunidadAutonoma');
    }
  }, [comunidadAutonoma]);

  const setComunidadAutonoma = (comunidad: string | null) => {
    setComunidadAutonomaState(comunidad);
  };

  const clearComunidadAutonoma = () => {
    setComunidadAutonomaState(null);
    localStorage.removeItem('comunidadAutonoma');
  };

  return (
    <ComunidadContext.Provider
      value={{
        comunidadAutonoma,
        setComunidadAutonoma,
        clearComunidadAutonoma,
      }}
    >
      {children}
    </ComunidadContext.Provider>
  );
};

export const useComunidad = () => {
  const context = useContext(ComunidadContext);
  if (context === undefined) {
    throw new Error('useComunidad debe ser usado dentro de un ComunidadProvider');
  }
  return context;
};
