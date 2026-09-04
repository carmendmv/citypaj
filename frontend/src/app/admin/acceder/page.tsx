'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();

  const [modEmail, setModEmail] = useState('');
  const [modPassword, setModPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState<'moderador' | 'admin' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent, email: string, password: string, role: 'moderador' | 'admin') => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    setLoading(role);
    try {
      const loggedUser = await login({ email, password });
      if (role === 'admin' && loggedUser.rol === 'admin') {
        router.replace('/admin');
      } else if (role === 'moderador' && (loggedUser.rol === 'moderador' || loggedUser.rol === 'admin')) {
        router.replace('/moderador');
      } else {
        setError('No tienes permisos para acceder a este panel');
      }
    } catch (err: any) {
      setError(err?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (user && (user.rol === 'admin' || user.rol === 'moderador')) {
      router.replace('/admin');
    } else if (user) {
      router.replace('/acceder');
    }
  }, [isLoading, user, router]);

  const LoginCard = ({
    role,
    title,
    icon: Icon,
    accent,
    email,
    setEmail,
    password,
    setPassword,
  }: {
    role: 'moderador' | 'admin';
    title: string;
    icon: React.ElementType;
    accent: string;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
  }) => (
    <div className={`border-2 p-6 ${role === 'admin' ? 'border-orange-500' : 'border-black'} bg-white`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${accent}`} />
        <div>
          <h2 className="font-serif text-xl font-bold text-black">{title}</h2>
        </div>
      </div>

      <form onSubmit={(e) => handleLogin(e, email, password, role)} className="space-y-4">
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
          disabled={loading !== null}
          className={`w-full border px-6 py-3 font-sans text-sm transition-colors disabled:opacity-50 ${
            role === 'admin'
              ? 'bg-orange-500 text-white border-orange-500 hover:bg-black hover:text-white'
              : 'bg-black text-white border-black hover:bg-orange-500 hover:text-black'
          }`}
        >
          {loading === role ? 'Accediendo...' : (role === 'admin' ? 'Acceder al panel de admin' : 'Acceder')}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-black mb-2">Acceso para equipos de moderación</h1>
          <p className="font-sans text-sm text-gray-600">
            ¿Eres moderador? Accede con tu cuenta. Los administradores tienen su panel correspondiente.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-500 p-3 text-red-600 text-sm text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoginCard
            role="moderador"
            title="¿Eres moderador?"
            icon={Users}
            accent="text-black"
            email={modEmail}
            setEmail={setModEmail}
            password={modPassword}
            setPassword={setModPassword}
          />

          <LoginCard
            role="admin"
            title="¿Eres admin?"
            icon={Shield}
            accent="text-orange-500"
            email={adminEmail}
            setEmail={setAdminEmail}
            password={adminPassword}
            setPassword={setAdminPassword}
          />
        </div>

        <div className="mt-8 text-center">
          <a
            href="/acceder"
            className="font-sans text-sm text-gray-600 hover:text-orange-500 underline underline-offset-4"
          >
            Volver al acceso de usuarios
          </a>
        </div>

        <div className="mt-10 border-2 border-orange-500 bg-white p-6">
          <h2 className="font-serif text-lg font-bold text-black mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Cuentas de prueba
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border border-black p-3">
              <p className="font-medium text-black">Moderador</p>
              <p className="text-gray-600 mt-1">Email: <span className="font-mono text-black">moderador@citypaj.local</span></p>
              <p className="text-gray-600">Contraseña: <span className="font-mono text-black">Test1234!</span></p>
            </div>
            <div className="border border-black p-3">
              <p className="font-medium text-black">Administrador</p>
              <p className="text-gray-600 mt-1">Email: <span className="font-mono text-black">admin@citypaj.local</span></p>
              <p className="text-gray-600">Contraseña: <span className="font-mono text-black">Test1234!</span></p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Estas credenciales son exclusivas para probar el acceso a los paneles. Recomendamos cambiarlas en entornos de producción.
          </p>
        </div>
      </main>

    </div>
  );
}
