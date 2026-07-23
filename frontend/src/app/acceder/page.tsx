'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header'; 
import Footer from '@/components/layout/Footer';
import TerminosModal from '@/components/ui/TerminosModal';
import PasswordInput from '@/components/ui/PasswordInput';
import { useAuth } from '@/context/AuthContext';

export default function AccederPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTerminos, setRegTerminos] = useState(false);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [errorRegister, setErrorRegister] = useState<string | null>(null);
  const [showTerminosModal, setShowTerminosModal] = useState(false);

  
  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (!password || password.length < 4) {
      return { isValid: false, error: 'La contraseña debe tener al menos 4 caracteres' };
    }
    return { isValid: true };
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const onSubmitLogin = async () => {
    setErrorLogin(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorLogin('Todos los campos son obligatorios');
      return;
    }
    if (!validateEmail(loginEmail)) {
      setErrorLogin('Introduce un email válido');
      return;
    }
    setLoadingLogin(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      router.push('/mi-perfil');
    } catch (err: any) {
      setErrorLogin(err?.message || 'Error al iniciar sesión');
    } finally {
      setLoadingLogin(false);
    }
  };

  const onSubmitRegister = async () => {
    setErrorRegister(null);
    
    if (!regNombre.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setErrorRegister('Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(regEmail)) {
      setErrorRegister('Introduce un email válido');
      return;
    }

    if (!regTerminos) {
      setErrorRegister('Debes aceptar los términos y condiciones');
      return;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(regPassword);
    if (!passwordValidation.isValid) {
      setErrorRegister(passwordValidation.error || 'La contraseña no es válida');
      return;
    }

    // Validar que las contraseñas coincidan
    if (regPassword !== regConfirmPassword) {
      setErrorRegister('Las contraseñas no coinciden');
      return;
    }

    setLoadingRegister(true);
    try {
      await register({
        nombre: regNombre,
        email: regEmail,
        password: regPassword,
      });
      router.push('/mi-perfil');
    } catch (err: any) {
      setErrorRegister(err?.message || 'Error al crear cuenta');
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[65%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Acceder / Registrarse</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Ingresa tu cuenta o crea una nueva</p>
        </div>

        {user ? (
          <div className="mt-10 border border-black p-6">
            <p className="font-sans text-sm text-black/80">
              Ya has iniciado sesión como <span className="font-medium">{user.email}</span>.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/mi-perfil"
                className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Mi perfil
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <section className="border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Iniciar sesión</h2>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorLogin ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="password">
                  Contraseña
                </label>
                <PasswordInput
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorLogin ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
              </div>
              
              {errorLogin ? (
                <div className="border border-black p-3 font-sans text-sm text-black">{errorLogin}</div>
              ) : null}
              <button
                type="button"
                onClick={() => void onSubmitLogin()}
                disabled={loadingLogin}
                className="w-full bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                {loadingLogin ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
              
              {/* Enlace de recuperación de contraseña */}
              <div className="mt-4 text-center">
                <Link 
                  href="/recuperar-contrasena"
                  className="text-sm text-gray-600 hover:text-black underline transition-colors"
                >
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
            </form>
          </section>

          <section className="border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Crear cuenta</h2>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorRegister ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="reg-email">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorRegister ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="reg-password">
                  Contraseña *
                </label>
                <PasswordInput
                  id="reg-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorRegister ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
                <div className="mt-2 text-xs text-gray-600">
                  <p>La contraseña debe tener al menos 4 caracteres.</p>
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="reg-confirm-password">
                  Confirmar contraseña *
                </label>
                <PasswordInput
                  id="reg-confirm-password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-sans border bg-white focus:outline-none transition-all ${
                    errorRegister ? 'border-red-500' : 'border-black focus:border-orange-500 hover:border-orange-500'
                  }`}
                />
              </div>

                            
              {/* Checkbox de términos y condiciones */}
              <div className="flex items-start space-x-2">
                <input
                  id="reg-terminos"
                  type="checkbox"
                  checked={regTerminos}
                  onChange={(e) => setRegTerminos(e.target.checked)}
                  className={`mt-1 w-4 h-4 border focus:outline-none transition-all ${
                    errorRegister && !regTerminos ? 'border-red-500' : 'border-black'
                  }`}
                />
                <label htmlFor="reg-terminos" className="text-sm text-gray-700 leading-relaxed">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerminosModal(true)}
                    className="underline hover:text-orange-500 transition-colors"
                  >
                    términos y condiciones
                  </button>
                </label>
              </div>

              {errorRegister ? (
                <div className="border border-black p-3 font-sans text-sm text-black">{errorRegister}</div>
              ) : null}

              <button
                type="button"
                onClick={() => void onSubmitRegister()}
                disabled={loadingRegister}
                className="w-full bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                {loadingRegister ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          </section>
        </div>

        )}

        {!user ? (
          <div className="mt-10 border border-black p-6 bg-gray-50">
            <h3 className="font-serif text-lg font-bold text-black mb-2">¿Eres moderador?</h3>
            <p className="font-sans text-sm text-gray-700 mb-4">
              Usa el acceso exclusivo para moderadores.
            </p>
            <Link
              href="/moderador/login"
              className="block w-full text-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Acceso de moderadores
            </Link>
          </div>
        ) : null}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            <span className="mr-2">←</span>
            Volver
          </Link>
        </div>
      </main>

      <Footer />
      
      {/* Modal de términos y condiciones */}
      <TerminosModal isOpen={showTerminosModal} onClose={() => setShowTerminosModal(false)} />
    </div>
  );
}
