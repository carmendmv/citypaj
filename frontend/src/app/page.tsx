'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  precio: number;
  comunidad_autonoma: string;
  provincia: string;
  autor: string;
  email: string;
  telefono?: string;
}

export default function HomePage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnuncios = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        const response = await fetch('/api/anuncios?limite=10&orden=fecha_desc', {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setAnuncios(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching anuncios:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>CityPaj - Plataforma de Anuncios Juvenil</title>
        <meta name="description" content="Descubre oportunidades juveniles en tu comunidad" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif font-bold text-gray-900">CityPaj</h1>
              <nav className="flex items-center space-x-6">
                <button className="text-sm font-sans text-gray-700 hover:text-orange-500">
                  Publicar
                </button>
                <button className="text-sm font-sans text-gray-700 hover:text-orange-500">
                  Ingresar
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido principal - Grid 2 columnas */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Columna izquierda - Contenido principal */}
            <div className="space-y-8">
              {/* Artículo destacado principal */}
              <article className="group cursor-pointer">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wide">
                    Destacado
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4 group-hover:text-orange-500 transition-colors">
                  {anuncios[0]?.titulo || 'Profesor de Matemáticas Avanzadas'}
                </h2>
                <p className="text-base lg:text-lg font-sans text-gray-700 leading-relaxed mb-6">
                  {anuncios[0]?.descripcion || 'Doctor en Matemáticas con 15 años de experiencia ofrece clases particulares especializadas para universitarios y preparación selectividad.'}
                </p>
                <div className="flex items-center text-sm font-sans text-gray-600">
                  <span className="font-medium">{anuncios[0]?.autor || 'Dr. Martínez'}</span>
                  <span className="mx-2">•</span>
                  <span>{anuncios[0]?.comunidad_autonoma || 'Madrid'}</span>
                  <span className="mx-2">•</span>
                  <span>Hace 2 horas</span>
                </div>
              </article>

              {/* Lista de artículos secundarios */}
              <div className="space-y-6">
                {anuncios.slice(1, 5).map((anuncio, index) => (
                  <article key={anuncio.id} className="group cursor-pointer border-b border-gray-200 pb-6">
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wide">
                        {anuncio.categoria}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 leading-tight mb-3 group-hover:text-orange-500 transition-colors">
                      {anuncio.titulo}
                    </h3>
                    <p className="text-base font-sans text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {anuncio.descripcion}
                    </p>
                    <div className="flex items-center text-sm font-sans text-gray-600">
                      <span className="font-medium">{anuncio.autor}</span>
                      <span className="mx-2">•</span>
                      <span>{anuncio.comunidad_autonoma}</span>
                      <span className="mx-2">•</span>
                      <span>Hace {index + 3} horas</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Columna derecha - Sidebar */}
            <div className="space-y-8">
              {/* Box de opinión */}
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                  Opinión
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer leading-tight mb-2">
                      La importancia de la educación financiera juvenil
                    </h4>
                    <p className="text-xs font-sans text-gray-600 mb-2">
                      Por Carlos Ruiz, Economista
                    </p>
                    <p className="text-xs font-sans text-gray-700 line-clamp-3">
                      Los jóvenes necesitan herramientas financieras para tomar decisiones informadas sobre su futuro económico...
                    </p>
                  </div>
                </div>
              </div>

              {/* Box de más leído */}
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-6 bg-red-600 mr-3"></div>
                  Lo Más Leído
                </h3>
                <div className="space-y-4">
                  {anuncios.slice(2, 6).map((anuncio, index) => (
                    <div key={anuncio.id} className="group cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl font-serif font-bold text-gray-400 leading-none mt-1">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-serif font-bold text-gray-900 group-hover:text-orange-500 transition-colors leading-tight mb-1">
                            {anuncio.titulo}
                          </h4>
                          <p className="text-xs font-sans text-gray-600">
                            {anuncio.autor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gray-900 text-white p-6">
                <h3 className="text-lg font-serif font-bold text-white mb-3">
                  Newsletter
                </h3>
                <p className="text-sm font-sans text-gray-300 mb-4">
                  Recibe las últimas oportunidades juveniles en tu email
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm font-sans focus:outline-none focus:border-orange-500 rounded"
                  />
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded transition-colors">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
