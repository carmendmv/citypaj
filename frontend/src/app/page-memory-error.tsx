'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
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
  { id: 'empleo', label: 'Empleo', href: '/empleo?categoria=empleo', desc: 'Ofertas laborales cerca de ti' },
  { id: 'formacion', label: 'Formación', href: '/formacion?categoria=formacion', desc: 'Cursos gratuitos y becas' },
  { id: 'vivienda', label: 'Vivienda', href: '/vivienda?categoria=vivienda', desc: 'Alquiler asequible y habitaciones' },
  { id: 'ocio', label: 'Ocio y Cultura', href: '/ocio?categoria=ocio', desc: 'Eventos y actividades locales' },
  { id: 'ayudas', label: 'Ayudas', href: '/servicios?categoria=ayudas', desc: 'Subvenciones y apoyos económicos' },
  { id: 'voluntariado', label: 'Voluntariado', href: '/servicios?categoria=voluntariado', desc: 'Participa y colabora' },
];

const BENEFICIOS_CITYPAJ = [
  'encontrar trabajo',
  'acceder a formación',
  'buscar vivienda',
  'descubrir cultura',
  'conocer ayudas',
  'participar en comunidad',
  'enviar necesidades',
  'publicar anuncios'
];

const COMUNIDADES = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid',
  'Murcia', 'Navarra', 'País Vasco', 'La Rioja'
];

function HomePageContent() {
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();
  useGuardados();

  const [anunciosDestacados, setAnunciosDestacados] = useState<Anuncio[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHome | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      const destacadosResponse = await fetch('/api/anuncios/destacados');
      if (destacadosResponse.ok) {
        const destacadosData = await destacadosResponse.json();
        if (destacadosData.success) {
          setAnunciosDestacados(destacadosData.data);
        }
      }

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

  const handleSearch = () => {
    if (comunidadSeleccionada || searchQuery) {
      const params = new URLSearchParams();
      if (comunidadSeleccionada) params.set('comunidad', comunidadSeleccionada);
      if (searchQuery) params.set('busqueda', searchQuery);
      window.location.href = `/anuncios?${params.toString()}`;
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

      {/* Hero Section - Inspirado en majordomedigital.fr */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-tight mb-8">
            Todo lo que necesitas,
            <br />
            <span className="text-blue-600">cerca de ti</span>
          </h1>
          
          <p className="font-sans text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Tu provincia también se construye escuchándote.
            <br />
            Oportunidades, comunidad y voz joven en un solo lugar.
          </p>

          {/* Buscador Principal */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                
                <div>
                  <select
                    value={comunidadSeleccionada}
                    onChange={(e) => handleComunidadChange(e.target.value)}
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecciona tu comunidad autónoma</option>
                    {COMUNIDADES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!comunidadSeleccionada && !searchQuery}
                  className="w-full py-4 bg-black text-white font-semibold text-lg rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar oportunidades
                </button>
              </div>
            </div>
          </div>

          {/* Métricas Rápidas */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{estadisticas.anuncios_publicados}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Anuncios</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{estadisticas.usuarios_registrados}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{estadisticas.sugerencias_recibidas}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Sugerencias</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{estadisticas.comunidades_activas}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Comunidades</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CityPAJ te ayuda a... - Estilo majordomedigital.fr */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-16 text-center">
            CityPAJ te ayuda a...
          </h2>
          
          <div className="space-y-6">
            {BENEFICIOS_CITYPAJ.map((beneficio, index) => (
              <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold text-black capitalize">
                    {beneficio}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-16 text-center">
            Explora por categorías
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIAS_PRINCIPALES.map((categoria) => (
              <Link
                key={categoria.id}
                href={categoria.href}
                className="group block bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                      {categoria.label}
                    </h3>
                    <p className="font-sans text-gray-600">
                      {categoria.desc}
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400 group-hover:text-blue-600 transition-colors">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncios Destacados */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
                Oportunidades destacadas
              </h2>
              <p className="font-sans text-xl text-gray-600 max-w-2xl">
                Las mejores ofertas y recursos de tu provincia
              </p>
            </div>
            <Link
              href="/anuncios"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
            >
              Ver todos los anuncios
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando oportunidades...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={cargarDatosIniciales}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : anunciosDestacados.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500 mb-6">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 rounded-full"></div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-black mb-4">
                Sé el primero
              </h3>
              <p className="font-sans text-gray-600 max-w-2xl mx-auto">
                Publica la primera oportunidad en tu provincia
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {anunciosDestacados.map((anuncio) => (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group block bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {anuncio.categoria}
                    </span>
                    <HeartButton anuncioId={anuncio.id} size="sm" showLabel={false} />
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors">
                    {anuncio.titulo}
                  </h3>
                  
                  <p className="font-sans text-gray-600 mb-4 line-clamp-3">
                    {resumen100(anuncio.descripcion)}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <div>{anuncio.usuario_nombre || 'Anónimo'}</div>
                      <div>{formatFecha(anuncio.creado)}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {anuncio.provincia}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comunidad y Voz Ciudadana */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-8">
                Tu provincia también se construye
                <span className="text-blue-600"> escuchándote</span>
              </h2>
              <p className="font-sans text-xl text-gray-600 mb-8">
                Participa activamente en tu comunidad. Envía necesidades, propuestas y ayuda a mejorar tu territorio.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-black mb-2">Envía tus necesidades</h4>
                    <p className="font-sans text-gray-600">Cuéntanos qué falta en tu provincia</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-black mb-2">Participa en debates</h4>
                    <p className="font-sans text-gray-600">Únete a la conversación local</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-black mb-2">Propone mejoras</h4>
                    <p className="font-sans text-gray-600">Sugiere cambios para tu comunidad</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buzon-sugerencias"
                  className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-center"
                >
                  Enviar necesidades
                </Link>
                <Link
                  href="/comunidad"
                  className="px-8 py-4 bg-white text-black border-2 border-black font-semibold rounded-xl hover:bg-gray-100 transition-colors text-center"
                >
                  Entrar en comunidad
                </Link>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-12">
              <div className="text-center">
                <div className="text-6xl mb-6">🗣️</div>
                <h3 className="font-serif text-2xl font-bold text-black mb-4">
                  Tu voz importa
                </h3>
                <p className="font-sans text-gray-600 mb-6">
                  Miles de jóvenes ya participan para mejorar sus provincias
                </p>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {estadisticas?.sugerencias_recibidas || 0}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  Sugerencias recibidas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instituciones */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
              Una herramienta útil para
              <span className="text-blue-600"> instituciones</span>
            </h2>
            <p className="font-sans text-xl text-gray-600 max-w-3xl mx-auto">
              Ayuntamientos, diputaciones y áreas de juventud confían en CityPAJ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              'Escucha activa',
              'Datos agregados',
              'Participación ciudadana',
              'Recursos verificados'
            ].map((beneficio, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-black mb-2">{beneficio}</h3>
                <p className="font-sans text-gray-600 text-sm">
                  {beneficio === 'Escucha activa' && 'Conoce las necesidades reales de la juventud'}
                  {beneficio === 'Datos agregados' && 'Información territorial para decisiones informadas'}
                  {beneficio === 'Participación ciudadana' && 'Fomenta el diálogo y la colaboración'}
                  {beneficio === 'Recursos verificados' && 'Publica información oficial y confiable'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="font-sans text-lg text-gray-600 mb-8">
              Preparado para colaborar con ayuntamientos, diputaciones y áreas de juventud
            </p>
            <Link
              href="/instituciones"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Más información para instituciones
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-6">
              ¿Cómo funciona?
            </h2>
            <p className="font-sans text-xl text-gray-600 max-w-3xl mx-auto">
              Empieza a participar en tu comunidad en 6 pasos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { step: 1, title: 'Elige tu provincia', desc: 'Selecciona tu comunidad autónoma' },
              { step: 2, title: 'Encuentra oportunidades', desc: 'Busca empleo, formación, vivienda...' },
              { step: 3, title: 'Participa', desc: 'Únete a la conversación local' },
              { step: 4, title: 'Envía necesidades', desc: 'Comunica lo que falta en tu zona' },
              { step: 5, title: 'Propone mejoras', desc: 'Sugiere cambios para tu comunidad' },
              { step: 6, title: 'Ayuda a mejorar', desc: 'Colabora para construir tu territorio' }
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-black mb-2">{item.title}</h3>
                  <p className="font-sans text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8">
            Empieza por tu provincia
          </h2>
          <p className="font-sans text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Únete a miles de jóvenes que ya están participando para mejorar sus comunidades
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleSearch}
              disabled={!comunidadSeleccionada && !searchQuery}
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Explorar oportunidades
            </button>
            <Link
              href="/comunidad"
              className="px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-xl hover:bg-white hover:text-black transition-colors"
            >
              Entrar en comunidad
            </Link>
            <Link
              href="/publicar"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Publicar anuncio
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
      <HomePage />
    </Suspense>
  );
}
