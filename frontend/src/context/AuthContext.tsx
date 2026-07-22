'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id: string;
  email: string;
  nombre: string;
};

type StoredAuth = {
  user?: AuthUser;
  accessToken?: string;
  refreshToken?: string;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { nombre: string; email: string; password: string; turnstileToken?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'citypaj_auth';

function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return json.exp ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = decodeJwtExp(token);
  if (!exp) return false;
  return Date.now() >= exp - 60000;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const persist = useCallback((nextUser: AuthUser | null, nextAccessToken: string | null, nextRefreshToken?: string | null) => {
    try {
      if (!nextUser || !nextAccessToken) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const stored: StoredAuth = { user: nextUser, accessToken: nextAccessToken };
      if (nextRefreshToken) stored.refreshToken = nextRefreshToken;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      return;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignorar errores de red
    }
    setUser(null);
    setAccessToken(null);
    persist(null, null, null);
  }, [persist]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredAuth;
      if (!parsed.refreshToken || !parsed.user) return;

      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: parsed.refreshToken }),
      });

      if (!res.ok) throw new Error('refresh failed');

      const json = await res.json();
      const nextAccessToken = json?.data?.accessToken as string | undefined;
      if (!nextAccessToken) throw new Error('no access token');

      setUser(parsed.user);
      setAccessToken(nextAccessToken);
      persist(parsed.user, nextAccessToken, parsed.refreshToken);
    } catch {
      logout();
    }
  }, [logout, persist]);

  useEffect(() => {
    const init = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as StoredAuth;
        if (!parsed.user) return;

        if (parsed.refreshToken) {
          try {
            await refreshAccessToken();
            return;
          } catch {
            // si el refresh falla, comprobar accessToken
          }
        }

        if (parsed.accessToken && !isTokenExpired(parsed.accessToken)) {
          setUser(parsed.user);
          setAccessToken(parsed.accessToken);
        } else {
          logout();
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
    init();
  }, [logout, refreshAccessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [accessToken, refreshAccessToken]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Login fallido');
    }

    const json = await res.json();
    const nextUser = json?.data?.user as AuthUser | undefined;
    const nextAccessToken = (json?.data?.tokens?.accessToken || json?.data?.token) as string | undefined;
    const nextRefreshToken = json?.data?.tokens?.refreshToken as string | undefined;

    if (!nextUser || !nextAccessToken || !nextRefreshToken) {
      throw new Error('Login fallido');
    }

    setUser(nextUser);
    setAccessToken(nextAccessToken);
    persist(nextUser, nextAccessToken, nextRefreshToken);
  }, [persist]);

  const register = useCallback(async ({
    nombre,
    email,
    password,
    turnstileToken,
  }: {
    nombre: string;
    email: string;
    password: string;
    turnstileToken?: string;
  }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        password,
        turnstile_token: turnstileToken || undefined,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Registro fallido');
    }

    await login({ email, password });
  }, [login]);

  const value = useMemo<AuthState>(() => ({ user, accessToken, login, register, logout }), [user, accessToken, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider no está montado');
  return ctx;
}
