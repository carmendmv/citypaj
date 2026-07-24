'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/context/AuthContext';

const ROL_MODERADOR = ['admin', 'moderador'];

export default function ModeradorLoginPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState('moderador@citypaj.demo');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && ROL_MODERADOR.includes(user.rol || '')) {
      router.replace('/moderador');
    } else if (user && !ROL_MODERADOR.includes(user.rol || '')) {
      // Si un usuario normal llegó aquí, cerrar sesión y mostrar error
      setError('No tienes permisos para acceder al panel de moderación.');
      void logout();
    }
  }, [user, router, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      // login actualiza el usuario en el contexto; el useEffect se encargará de la redirección
    } catch (err: any) {
      setError(err?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="border border-black p-8">
          <h1 className="font-serif text-2xl font-bold text-black mb-2">Acceso de moderadores</h1>
          <p className="font-sans text-sm text-gray-600 mb-6">
            Inicia sesión con las credenciales demo para acceder al panel de moderación.
          </p>

          {error && (
            <div className="mb-4 border border-red-500 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="moderador-email" className="block font-sans text-xs text-gray-600 mb-1">Email</label>
              <input
                id="moderador-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="moderador-password" className="block font-sans text-xs text-gray-600 mb-1">Contraseña</label>
              <PasswordInput
                id="moderador-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm font-sans border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Accediendo...' : 'Entrar al panel'}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
