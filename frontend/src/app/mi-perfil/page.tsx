'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MiPerfilPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Mi perfil</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestiona tus datos y preferencias</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black">Datos básicos</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Nombre</div>
              <div className="font-sans text-sm text-black">—</div>
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Email</div>
              <div className="font-sans text-sm text-black">—</div>
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Comunidad autónoma</div>
              <div className="font-sans text-sm text-black">—</div>
            </div>
            <div>
              <div className="font-sans text-xs text-gray-600 mb-2">Teléfono (opcional)</div>
              <div className="font-sans text-sm text-black">—</div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </section>

        <div className="mt-10 flex items-center gap-6">
          <Link
            href="/mis-anuncios"
            className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Ir a Mis anuncios
          </Link>
          <Link
            href="/"
            className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4"
          >
            Volver
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
