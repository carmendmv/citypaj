'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '@/lib/api';

export type AuthUser = {
  id: string;
  email: string;
  nombre: string;
  rol: 'usuario' | 'moderador' | 'admin' | string;
  verificado?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthUser>;
  register: (payload: { nombre: string; email: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function decodeJwtPayload(token: string): any {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function tokenExpiresAt(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return payload?.exp ? payload.exp * 1000 : null;
}

function tokenToUser(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.id) return null;
  return {
    id: payload.id,
    email: payload.email || '',
    nombre: payload.nombre || '',
    rol: payload.rol || 'usuario',
    verificado: Boolean(payload.verificado),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('refresh failed');

      const json = await res.json();
      const nextAccessToken = json?.data?.accessToken as string | undefined;
      if (!nextAccessToken) throw new Error('no access token');

      const nextUser = tokenToUser(nextAccessToken);
      setAccessToken(nextAccessToken);
      setUser(nextUser);
      return nextAccessToken;
    } catch {
      handleLogout();
      return null;
    }
  }, [handleLogout]);

  // Cargar sesión al montar la app
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    refreshAccessToken().finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshAccessToken]);

  // Renovación periódica del access token
  useEffect(() => {
    if (!accessToken) return;
    const exp = tokenExpiresAt(accessToken);
    const timeoutMs = exp ? Math.max(exp - Date.now() - 60 * 1000, 60 * 1000) : 14 * 60 * 1000;

    const timeout = setTimeout(() => {
      void refreshAccessToken();
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [accessToken, refreshAccessToken]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }): Promise<AuthUser> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Email o contraseña incorrectos');
    }

    const json = await res.json();
    const nextUser = json?.data?.user as AuthUser | undefined;
    const nextAccessToken = json?.data?.accessToken as string | undefined;

    if (!nextUser || !nextAccessToken) {
      throw new Error('Login fallido');
    }

    setUser(nextUser);
    setAccessToken(nextAccessToken);
    return nextUser;
  }, []);

  const register = useCallback(async ({
    nombre,
    email,
    password,
  }: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<AuthUser> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registro fallido');
    }

    return login({ email, password });
  }, [login]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignorar errores de red
    }
    handleLogout();
  }, [handleLogout]);

  const isAdmin = useMemo(() => user?.rol === 'admin', [user]);
  const isModerator = useMemo(() => user?.rol === 'moderador' || user?.rol === 'admin', [user]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAdmin,
      isModerator,
      login,
      register,
      logout,
    }),
    [user, accessToken, isLoading, isAdmin, isModerator, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider no está montado');
  return ctx;
}
