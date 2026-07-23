'use client';

import { createContext, useContext, useRef, ReactNode, useCallback } from 'react';

interface HeaderVisibilityContextType {
  registerHeader: () => boolean;
  unregisterHeader: () => void;
}

const HeaderVisibilityContext = createContext<HeaderVisibilityContextType | undefined>(undefined);

export function HeaderVisibilityProvider({ children }: { children: ReactNode }) {
  const countRef = useRef(0);

  const registerHeader = useCallback(() => {
    countRef.current += 1;
    return countRef.current === 1;
  }, []);

  const unregisterHeader = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
  }, []);

  return (
    <HeaderVisibilityContext.Provider value={{ registerHeader, unregisterHeader }}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext);
  if (!context) {
    throw new Error('useHeaderVisibility must be used within a HeaderVisibilityProvider');
  }
  return context;
}
