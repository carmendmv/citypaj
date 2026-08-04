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

        <section className="mt-10 border border-black p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-black">1. Uso responsable</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            CityPaj es una plataforma de anuncios juvenil. No se permite publicar contenido ilegal, violento, discriminatorio
            o que incumpla la normativa vigente.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">2. Publicaciones y contenido</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Cada usuario es responsable de lo que publica. Los anuncios deben ser veraces, respetuosos y ajustarse a la
            temática de la plataforma. No se permite la suplantación de identidad ni la publicación de datos de terceros
            sin consentimiento.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">3. Moderación</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Los anuncios pueden ser revisados y moderados. CityPaj se reserva el derecho a ocultar o eliminar anuncios que
            incumplan las normas.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">4. Dirección IP y datos técnicos</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Con el fin de garantizar la seguridad de la plataforma, prevenir abusos y facilitar la moderación de contenidos,
            al acceder o publicar en CityPaj recopilamos de forma automática datos técnicos como tu <strong>dirección IP</strong>,
            navegador, sistema operativo y registros de actividad.
          </p>
          <p className="mt-3 font-sans text-sm text-black/80">
            Estos datos se tratan con la base jurídica del interés legítimo y se conservan únicamente el tiempo necesario
            para esas finalidades. No vendemos ni compartimos tu IP con terceros con fines comerciales.
          </p>
          <p className="mt-3 font-sans text-sm text-black/80">
            En la <Link href="/privacidad" className="underline hover:text-orange-500">Política de Privacidad</Link> puedes
            consultar más detalles sobre cómo usamos y protegemos tu información.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">5. Responsabilidad</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            CityPaj actúa como intermediario tecnológico. No somos responsables del contenido generado por los usuarios,
            aunque colaboramos activamente en su revisión para mantener un entorno seguro.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">6. Modificaciones</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Podemos actualizar estos términos en cualquier momento. Los cambios relevantes se anunciarán en la plataforma y,
            si es necesario, se solicitará la aceptación expresa para continuar usando el servicio.
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-black">7. Contacto</h2>
          <p className="mt-4 font-sans text-sm text-black/80">
            Si tienes dudas sobre estos términos, puedes escribirnos a{' '}
            <a href="mailto:contacto@citypaj.es" className="underline hover:text-orange-500">contacto@citypaj.es</a>.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-6">
          <Link href="/" className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4">
            Volver al inicio
          </Link>
          <Link href="/privacidad" className="font-sans text-sm text-black hover:text-orange-500 hover:underline underline-offset-4">
            Ver política de privacidad
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
