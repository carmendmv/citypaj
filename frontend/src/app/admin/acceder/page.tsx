'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('moderador@citypaj.demo');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Redirigir a panel si el login tuvo éxito (useEffect se encarga finalmente)
      router.replace('/moderador');
    } catch (err: any) {
      setError(err?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Si ya hay sesión con rol adecuado, ir directo al panel
  useEffect(() => {
    if (user && (user.rol === 'admin' || user.rol === 'moderador')) {
      router.replace('/moderador');
    } else if (user) {
      router.replace('/moderador/login');
    }
  }, [user, router]);

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
              <label className="block font-sans text-xs text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-sans text-xs text-gray-600 mb-1">Contraseña</label>
              <PasswordInput
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
              {loading ? 'Accediendo...' : 'Acceder al panel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/acceder"
              className="font-sans text-sm text-gray-600 hover:text-orange-500 underline underline-offset-4"
            >
              Volver al acceso de usuarios
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
