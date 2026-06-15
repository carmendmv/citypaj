'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useComunidad } from '@/hooks/useComunidad';
import { useGuardados } from '@/hooks/useGuardados';
import HeartButton from '@/components/ui/HeartButton';

interface Anuncio {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria?: string;
  comunidad_autonoma: string;
  provincia: string;
  barrio?: string;
  precio?: number;
  modalidad: 'venta' | 'regalo' | 'intercambio' | 'servicio' | 'compra';
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: 'pending' | 'approved' | 'rejected' | 'flagged';
  motivo_rechazo?: string;
  vistas: number;
  creado: string;
  actualizado: string;
  usuario_nombre?: string;
  usuario_verificado?: boolean;
  numero_imagenes?: number;
  imagenes?: any[];
  es_favorito?: boolean;
}

interface EstadisticasHome {
  anuncios_publicados: number;
  usuarios_registrados: number;
  sugerencias_recibidas: number;
  comunidades_activas: number;
}

const CATEGORIAS_PRINCIPALES = [
  { id: 'empleo', label: 'Empleo', href: '/empleo' },
  { id: 'formacion', label: 'Formación', href: '/formacion' },
  { id: 'vivienda', label: 'Vivienda', href: '/vivienda' },
  { id: 'ocio', label: 'Ocio y Cultura', href: '/ocio' },
  { id: 'ayudas', label: 'Ayudas y Becas', href: '/servicios' },
  { id: 'voluntariado', label: 'Voluntariado', href: '/servicios' },
];

const COMUNIDADES = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

function HomePageContent() {
  const searchParams = useSearchParams();
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();
  
  // Inicializar useGuardados para que los corazones funcionen
  useGuardados();

  const [anunciosDestacados, setAnunciosDestacados] = useState<Anuncio[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    const savedComunidad = localStorage.getItem('comunidadAutonoma');
    if (savedComunidad) {
      setComunidadAutonoma(savedComunidad);
      setComunidadSeleccionada(savedComunidad);
    }
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar anuncios destacados
      const destacadosResponse = await fetch('/api/anuncios/destacados');
      if (destacadosResponse.ok) {
        const destacadosData = await destacadosResponse.json();
        if (destacadosData.success) {
          setAnunciosDestacados(destacadosData.data);
        }
      }

      // Cargar estadísticas
      const statsResponse = await fetch('/api/estadisticas/home');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setEstadisticas(statsData.data);
        }
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleComunidadChange = (comunidad: string) => {
    setComunidadSeleccionada(comunidad);
    setComunidadAutonoma(comunidad);
    if (comunidad) {
      localStorage.setItem('comunidadAutonoma', comunidad);
    } else {
      localStorage.removeItem('comunidadAutonoma');
    }
  };

  const handleBuscar = () => {
    if (comunidadSeleccionada) {
      window.location.href = `/anuncios?comunidad=${encodeURIComponent(comunidadSeleccionada)}`;
    }
  };

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const resumen100 = (text: string) => {
    const trimmed = (text || '').trim();
    if (trimmed.length <= 100) return trimmed;
    return `${trimmed.slice(0, 97)}...`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
          <img 
            src="/fondo-hero1.jpeg"
            alt="Colaboración juvenil"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiMxYTFhMWUiLz48dGV4dCB4PSI5NjAiIHk9IjU0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2l0eVBhaiAtIFR1IGNpdWRhZCwgdHVzIG9wb3J0dW5pZGFkZXM8L3RleHQ+PC9zdmc+';
            }}
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-wide drop-shadow-2xl">
              CityPAJ
            </h1>
            
            <p className="font-sans text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light">
              Todo lo que necesitas, cerca de ti.
            </p>
            
            <p className="font-sans text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              CityPAJ conecta a jóvenes con oportunidades, recursos, cultura y comunidad en su provincia.
              <br />
              Tu provincia también se construye escuchándote.
            </p>

            <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
              <select
                value={comunidadSeleccionada}
                onChange={(e) => handleComunidadChange(e.target.value)}
                className="w-full h-12 px-6 bg-white/90 backdrop-blur-md border-2 border-white/30 text-black font-medium text-sm sm:text-base focus:outline-none focus:border-white/60 transition-all duration-300 cursor-pointer shadow-xl"
              >
                <option value="">Selecciona tu comunidad autónoma</option>
                {COMUNIDADES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleBuscar}
                  disabled={!comunidadSeleccionada}
                  className="flex-1 h-12 px-6 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar anuncios
                </button>
                
                <Link
                  href="/comunidad"
                  className="flex-1 h-12 px-6 bg-white text-black font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                >
                  Explorar comunidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      {estadisticas && (
        <section className="py-16 bg-gray-50 border-y border-black">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-black mb-12">
              Impacto CityPAJ
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">
                  {estadisticas.anuncios_publicados}
                </div>
                <div className="text-sm font-sans text-gray-600">Anuncios publicados</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">
                  {estadisticas.usuarios_registrados}
                </div>
                <div className="text-sm font-sans text-gray-600">Usuarios registrados</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">
                  {estadisticas.sugerencias_recibidas}
                </div>
                <div className="text-sm font-sans text-gray-600">Sugerencias recibidas</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">
                  {estadisticas.comunidades_activas}
                </div>
                <div className="text-sm font-sans text-gray-600">Comunidades activas</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categorías Principales */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center text-black mb-12">
            Explora por Categorías
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIAS_PRINCIPALES.map((categoria) => (
              <Link
                key={categoria.id}
                href={categoria.href}
                className="group block border border-black p-8 hover:border-orange-500 transition-all duration-300 text-center aspect-square flex items-center justify-center"
              >
                <div className="font-serif text-base font-bold text-black group-hover:text-orange-500 transition-colors">
                  {categoria.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncios Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black">
              Anuncios Destacados
            </h2>
            <Link
              href="/anuncios"
              className="text-sm font-sans text-black hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              Ver todos los anuncios
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-black">Cargando anuncios destacados...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={cargarDatosIniciales}
                className="px-4 py-2 bg-black text-white border border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : anunciosDestacados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700">Todavía no hay anuncios destacados disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anunciosDestacados.map((anuncio) => (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group block border border-black p-6 hover:border-orange-500 transition-all duration-300 h-full"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-black mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                        {anuncio.titulo}
                      </h3>
                      <p className="font-sans text-sm text-gray-600 mb-4 leading-relaxed">
                        {resumen100(anuncio.descripcion)}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <HeartButton anuncioId={anuncio.id} size="sm" showLabel={false} />
                          <span>{anuncio.usuario_nombre || 'Anónimo'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {anuncio.categoria}
                          </span>
                          <span>{formatFecha(anuncio.creado)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comunidad por Provincias */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Comunidad por Provincias
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
              Únete a la conversación en tu provincia, comparte dudas, ideas y propuestas.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/comunidad"
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Explorar Comunidad
            </Link>
          </div>
        </div>
      </section>

      {/* Buzón de Necesidades Ciudadanas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Buzón de Necesidades Ciudadanas
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
              Tu opinión importa. Cuéntanos qué necesita tu provincia.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {['Empleo', 'Formación', 'Vivienda', 'Cultura', 'Ocio', 'Ayudas'].map((categoria) => (
              <div key={categoria} className="text-center p-3 border border-gray-300 rounded">
                <div className="font-sans text-sm text-gray-700">{categoria}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/buzon-sugerencias"
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Enviar Sugerencia
            </Link>
          </div>
        </div>
      </section>

      {/* Propuestas Ciudadanas */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Propuestas Ciudadanas
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
              Participa activamente proponiendo mejoras para tu provincia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              'Más cursos gratuitos de programación',
              'Más actividades culturales para jóvenes',
              'Mejor información sobre ayudas al alquiler',
              'Transporte nocturno los fines de semana',
              'Espacios seguros de ocio joven',
              'Más información para jóvenes extranjeros'
            ].map((propuesta, index) => (
              <div key={index} className="border border-black p-6 aspect-square flex items-center justify-center">
                <div className="font-sans text-sm text-gray-700 text-center">{propuesta}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/propuestas"
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Crear Propuesta
            </Link>
          </div>
        </div>
      </section>

      {/* Acceso Institucional */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              ¿Eres una institución?
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              CityPAJ ayuda a ayuntamientos, diputaciones y áreas de juventud o cultura a conocer mejor 
              las necesidades reales de la población joven, publicar recursos verificados y fomentar 
              la participación ciudadana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              'Participación ciudadana',
              'Escucha joven',
              'Observatorio de necesidades',
              'Recursos verificados'
            ].map((beneficio) => (
              <div key={beneficio} className="text-center p-6 border border-black aspect-square flex items-center justify-center">
                <div className="font-sans text-sm text-gray-700">{beneficio}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/instituciones"
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Más Información
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            CityPAJ no sustituye a los servicios de juventud
          </h2>
          <p className="font-sans text-lg mb-8 text-white/90">
            Los hace visibles, medibles y útiles. Conecta voces jóvenes con acción institucional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBuscar}
              disabled={!comunidadSeleccionada}
              className="px-8 py-3 bg-white text-black font-semibold border-2 border-white hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar Ahora
            </button>
            <Link
              href="/comunidad"
              className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              Unirse a la Comunidad
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Cargando CityPAJ...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
