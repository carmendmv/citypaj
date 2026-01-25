'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  id: string;
  email: string;
  nombre: string;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { user?: AuthUser; accessToken?: string };
      if (parsed?.user && parsed?.accessToken) {
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
      }
    } catch {
      return;
    }
  }, []);

  const persist = useCallback((nextUser: AuthUser | null, token: string | null) => {
    try {
      if (!nextUser || !token) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, accessToken: token }));
    } catch {
      return;
    }
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Login fallido');
    }

    const json = await res.json();
    const nextUser = json?.data?.usuario as AuthUser | undefined;
    const token = json?.data?.access_token as string | undefined;

    if (!nextUser || !token) {
      throw new Error('Login fallido');
    }

    setUser(nextUser);
    setAccessToken(token);
    persist(nextUser, token);
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
      throw new Error('Registro fallido');
    }

    await login({ email, password });
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
    }

    setUser(null);
    setAccessToken(null);
    persist(null, null);
  }, [persist]);

  const value = useMemo<AuthState>(() => ({ user, accessToken, login, register, logout }), [user, accessToken, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider no está montado');
  return ctx;
}
