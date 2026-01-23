'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AccederPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Zona de usuario</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Acceder / Registrarse</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <section className="border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Acceder</h2>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-gray-600 mb-2" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 text-sm font-sans border border-black bg-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="w-full bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Entrar
              </button>
            </form>
          </section>

          <section className="border border-black p-6">
            <h2 className="font-serif text-xl font-bold text-black">Registrarse</h2>
            <p className="mt-4 font-sans text-sm text-black/80">
              Crea tu cuenta para publicar anuncios, gestionar tu perfil y participar en la comunidad.
            </p>
            <button
              type="button"
              className="mt-6 w-full bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Crear cuenta
            </button>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
