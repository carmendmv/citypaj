'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-[80%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Términos y condiciones</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Información legal de uso de la plataforma</p>
        </div>

        <section className="mt-10 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black">Uso responsable</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            CityPaj es una plataforma de anuncios juvenil. No se permite publicar contenido ilegal, violento, discriminatorio
            o que incumpla la normativa vigente.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">Moderación</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Los anuncios pueden ser revisados y moderados. CityPaj se reserva el derecho a ocultar o eliminar anuncios que
            incumplan las normas.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">Privacidad</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Solo se muestran los datos de contacto que tú decidas al publicar. Recomendamos no compartir información sensible.
          </p>
        </section>

        <div className="mt-10">
          <Link href="/" className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4">
            Volver
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
