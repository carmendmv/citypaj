'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ExternalLink } from 'lucide-react';

const COMUNIDADES_AUTONOMAS = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

const ENLACES_NACIONALES = [
  {
    titulo: 'Portal Nacional de Juventud',
    descripcion: 'Información general sobre becas, empleo juvenil, vivienda y programas para jóvenes.',
    href: 'https://www.injuve.es/'
  },
  {
    titulo: 'Extranjería - Ministerio de Inclusión',
    descripcion: 'Trámites de extranjería, TIE, arraigo, reagrupación y asilo.',
    href: 'https://extranjeros.inclusion.gob.es/'
  },
  {
    titulo: 'Servicio Público de Empleo Estatal (SEPE)',
    descripcion: 'Prestaciones, ayudas y cursos de formación para desempleados.',
    href: 'https://www.sepe.es/'
  }
];

function searchUrl(tipo: string, ccaa: string) {
  const q = encodeURIComponent(`${tipo} ${ccaa}`);
  return `https://www.google.com/search?q=${q}`;
}

export default function AyudasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="border-b border-black pb-6 mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Ayudas</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">
            Recursos de ayuda para jóvenes y trámites de extranjería, organizados por comunidad autónoma.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-black mb-6">Recursos nacionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ENLACES_NACIONALES.map((enlace) => (
              <a
                key={enlace.titulo}
                href={enlace.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-black p-5 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-lg font-bold text-black group-hover:text-orange-600">{enlace.titulo}</h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                </div>
                <p className="mt-2 font-sans text-sm text-gray-600">{enlace.descripcion}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-6">Por comunidad autónoma</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMUNIDADES_AUTONOMAS.map((ccaa) => (
              <div key={ccaa} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <h3 className="font-serif text-lg font-bold text-black mb-3">{ccaa}</h3>
                <div className="space-y-2">
                  <a
                    href={searchUrl('ayudas jóvenes', ccaa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-sans text-sm text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ayudas para jóvenes
                  </a>
                  <a
                    href={searchUrl('extranjería', ccaa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-sans text-sm text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Extranjería
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
