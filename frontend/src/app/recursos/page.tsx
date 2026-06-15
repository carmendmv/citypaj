'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Recurso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  enlace?: string;
  telefono?: string;
  email?: string;
  provincia: string;
  comunidad_autonoma: string;
  verificado: boolean;
  creado: string;
}

const CATEGORIAS_RECURSOS = [
  'Oficinas de Juventud',
  'Ayudas Municipales',
  'Becas',
  'Cursos Públicos',
  'Recursos de Extranjería',
  'Servicios de Vivienda',
  'Orientación Laboral',
  'Espacios Jóvenes',
  'Centros Cívicos',
  'Asociaciones Culturales'
];

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');

  useEffect(() => {
    cargarRecursos();
  }, []);

  const cargarRecursos = async () => {
    try {
      setLoading(true);
      // Por ahora, mostramos estado vacío ya que no hay tabla de recursos
      setRecursos([]);
    } catch (err) {
      setError('Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black mb-4">
            Recursos Verificados
          </h1>
          <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
            Accede a recursos oficiales verificados por instituciones. 
            Servicios públicos, ayudas, y oportunidades validadas para jóvenes.
          </p>
        </div>

        {/* Filtro por categoría */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCategoriaFiltro('')}
              className={`px-4 py-2 border transition-colors ${
                categoriaFiltro === '' 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              Todas las categorías
            </button>
            {CATEGORIAS_RECURSOS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 border transition-colors ${
                  categoriaFiltro === cat 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-300 text-gray-700 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-black">Cargando recursos...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">{error}</div>
          </div>
        ) : recursos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-6">
              <div className="w-16 h-16 mx-auto mb-4 border border-gray-300"></div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-black mb-4">
              Recursos en preparación
            </h2>
            <p className="font-sans text-gray-600 max-w-2xl mx-auto mb-8">
              Estamos trabajando con instituciones para verificar y publicar recursos oficiales. 
              Pronto encontrarás aquí información validada sobre ayudas, servicios y oportunidades para jóvenes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {CATEGORIAS_RECURSOS.slice(0, 6).map((categoria) => (
                <div key={categoria} className="border border-black p-6 aspect-square flex flex-col justify-center">
                  <h3 className="font-serif text-lg font-bold text-black text-center">{categoria}</h3>
                  <p className="font-sans text-sm text-gray-600 text-center mt-2">
                    Recursos verificados próximamente
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-300 p-8 rounded max-w-2xl mx-auto">
              <h3 className="font-serif text-xl font-bold text-black mb-4">
                ¿Eres una institución?
              </h3>
              <p className="font-sans text-gray-700 mb-6">
                Si representas a un ayuntamiento, diputación u organismo público y quieres 
                publicar recursos verificados, contacta con nosotros.
              </p>
              <a
                href="/instituciones"
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-semibold border-2 border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Contactar con CityPAJ
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recursos.map((recurso) => (
              <div key={recurso.id} className="border border-black p-6 hover:border-orange-500 transition-colors">
                {recurso.verificado && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium">
                      ✓ Verificado
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl font-bold text-black mb-3">
                  {recurso.titulo}
                </h3>
                <p className="font-sans text-gray-600 mb-4">
                  {recurso.descripcion}
                </p>
                <div className="text-sm text-gray-500">
                  <div>{recurso.provincia} - {recurso.comunidad_autonoma}</div>
                  <div className="mt-1">{recurso.categoria}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
