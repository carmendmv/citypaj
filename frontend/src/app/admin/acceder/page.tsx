'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [modEmail, setModEmail] = useState('moderador@citypaj.demo');
  const [modPassword, setModPassword] = useState('demo123');
  const [adminEmail, setAdminEmail] = useState('admin@citypaj.demo');
  const [adminPassword, setAdminPassword] = useState('demo123');
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
      await login({ email, password, role });
    } catch (err: any) {
      setError(err?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (user && (user.rol === 'admin' || user.rol === 'moderador')) {
      router.replace('/admin');
    } else if (user) {
      router.replace('/admin/acceder');
    }
  }, [user, router]);

  const LoginCard = ({
    role,
    title,
    icon: Icon,
    accent,
    email,
    setEmail,
    password,
    setPassword,
    demo,
  }: {
    role: 'moderador' | 'admin';
    title: string;
    icon: React.ElementType;
    accent: string;
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    demo: string;
  }) => (
    <div className={`border-2 p-6 ${role === 'admin' ? 'border-orange-500' : 'border-black'} bg-white`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${accent}`} />
        <div>
          <h2 className="font-serif text-xl font-bold text-black">{title}</h2>
          <p className="text-xs text-gray-500">Credenciales demo: {demo}</p>
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
            demo="moderador@citypaj.demo / demo123"
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
            demo="admin@citypaj.demo / demo123"
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
      </main>

    </div>
  );
}
