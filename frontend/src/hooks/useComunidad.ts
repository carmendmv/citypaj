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

export const ComunidadProvider: React.FC<ComunidadProviderProps> = ({ children }) => {
  const [comunidadAutonoma, setComunidadAutonomaState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('comunidadAutonoma');
    if (stored) {
      setComunidadAutonomaState(stored);
    }
  }, []);

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

  const value: ComunidadContextType = {
    comunidadAutonoma,
    setComunidadAutonoma,
    clearComunidadAutonoma,
  };

  return (
    <ComunidadContext.Provider value={value}>
      {children}
    </ComunidadContext.Provider>
  );
};

export const useComunidad = (): ComunidadContextType => {
  const context = useContext(ComunidadContext);
  if (context === undefined) {
    throw new Error('useComunidad debe ser usado dentro de un ComunidadProvider');
  }
  return context;
};
