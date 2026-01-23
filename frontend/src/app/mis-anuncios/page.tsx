'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MisAnunciosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Mis anuncios</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestión de tus publicaciones</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black">Todavía no hay anuncios asociados a tu cuenta</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Cuando conectemos autenticación, aquí aparecerán tus anuncios publicados y podrás editarlos o desactivarlos.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-black text-white border border-black px-6 py-3 font-sans text-sm hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Ver anuncios
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black px-6 py-3 font-sans text-sm hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Publicar
            </button>
          </div>
        </section>

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
