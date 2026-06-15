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

// Categorías con más personalidad y menos simetría
const CATEGORIAS_PRINCIPALES = [
  { id: 'empleo', label: 'Empleo', href: '/empleo', desc: 'Ofertas cerca de ti', color: 'blue' },
  { id: 'formacion', label: 'Formación', href: '/formacion', desc: 'Cursos y becas', color: 'green' },
  { id: 'vivienda', label: 'Vivienda', href: '/vivienda', desc: 'Alquiler asequible', color: 'purple' },
  { id: 'ocio', label: 'Ocio', href: '/ocio', desc: 'Eventos locales', color: 'orange' },
  { id: 'ayudas', label: 'Ayudas', href: '/servicios', desc: 'Recursos económicos', color: 'pink' },
  { id: 'voluntariado', label: 'Voluntariado', href: '/servicios', desc: 'Participa y colabora', color: 'teal' },
];

// Ayudas con diseño más asimétrico y humano
const AYUDAS_CITYPAJ = [
  { title: 'Encontrar trabajo', desc: 'Ofertas laborales en tu provincia', priority: 'high', icon: '💼' },
  { title: 'Formación gratis', desc: 'Cursos y becas disponibles', priority: 'high', icon: '📚' },
  { title: 'Vivienda asequible', desc: 'Alquiler y habitaciones', priority: 'medium', icon: '🏠' },
  { title: 'Cultura local', desc: 'Eventos y actividades', priority: 'medium', icon: '🎭' },
  { title: 'Ayudas económicas', desc: 'Subvenciones y apoyos', priority: 'high', icon: '💰' },
  { title: 'Participación', desc: 'Unirte a la comunidad', priority: 'low', icon: '🤝' },
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState<'search' | 'comunidad' | null>(null);

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

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      teal: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
  };

  const getPriorityWidth = (priority: string) => {
    const widths = {
      high: 'md:col-span-2',
      medium: 'md:col-span-1',
      low: 'md:col-span-1'
    };
    return widths[priority as keyof typeof widths] || 'md:col-span-1';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero con diseño UX más humano y asimétrico */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Diseño asimétrico deliberado */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {/* Badge contextual */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Plataforma juvenil territorial
                </div>
                
                {/* Título con énfasis humano */}
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                  Todo lo que necesitas,
                  <br />
                  <span className="relative">
                    <span className="text-blue-600">cerca de ti</span>
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-200 rounded-full"></span>
                  </span>
                </h1>
                
                {/* Subtítulo más conversacional */}
                <p className="font-sans text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                  Tu provincia también se construye escuchándote. 
                  <br />
                  <span className="text-gray-600 font-medium">
                    Oportunidades, comunidad y voz joven en un solo lugar.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Métricas en posición asimétrica */}
            <div className="lg:col-span-4 lg:pl-12">
              {estadisticas && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">{estadisticas.anuncios_publicados}</div>
                      <div className="text-sm text-gray-600">Anuncios activos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">{estadisticas.usuarios_registrados}</div>
                      <div className="text-sm text-gray-600">Jóvenes conectados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">{estadisticas.sugerencias_recibidas}</div>
                      <div className="text-sm text-gray-600">Sugerencias</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buscador con diseño UX mejorado */}
          <div className="mt-16 max-w-3xl">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué estás buscando?
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: trabajo en Madrid, curso de programación..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setFocusedInput('search')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl transition-all duration-200 ${
                      focusedInput === 'search' 
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu comunidad autónoma
                  </label>
                  <select
                    value={comunidadSeleccionada}
                    onChange={(e) => handleComunidadChange(e.target.value)}
                    onFocus={() => setFocusedInput('comunidad')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl transition-all duration-200 ${
                      focusedInput === 'comunidad' 
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Selecciona tu provincia</option>
                    {COMUNIDADES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!comunidadSeleccionada && !searchQuery}
                  className="w-full py-4 bg-black text-white font-semibold text-lg rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Buscar oportunidades
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CityPAJ te ayuda a... - Grid asimétrico UX */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
              CityPAJ te ayuda a...
            </h2>
            <p className="font-sans text-lg text-gray-600">
              Todo lo que necesitas para crecer en tu provincia
            </p>
          </div>

          {/* Grid asimétrico deliberado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AYUDAS_CITYPAJ.map((ayuda, index) => (
              <div key={index} className={`${getPriorityWidth(ayuda.priority)}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{ayuda.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-black mb-2">
                        {ayuda.title}
                      </h3>
                      <p className="font-sans text-gray-600 text-sm">
                        {ayuda.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías con colores y diseño UX */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
              Explora por categorías
            </h2>
            <p className="font-sans text-lg text-gray-600">
              Encuentra exactamente lo que buscas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIAS_PRINCIPALES.map((categoria, index) => (
              <Link
                key={categoria.id}
                href={categoria.href}
                className={`group block border-2 rounded-xl p-6 transition-all duration-300 ${getColorClass(categoria.color)} hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                      {categoria.label}
                    </h3>
                    <p className="font-sans text-gray-600 text-sm">
                      {categoria.desc}
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncios Destacados - Diseño UX más realista */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
                Oportunidades destacadas
              </h2>
              <p className="font-sans text-lg text-gray-600">
                Las mejores ofertas de tu provincia
              </p>
            </div>
            <Link
              href="/anuncios"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Ver todas
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando oportunidades...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={cargarDatosIniciales}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {anunciosDestacados.map((anuncio) => (
                <Link
                  key={anuncio.id}
                  href={`/anuncios/${anuncio.id}`}
                  className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {anuncio.categoria}
                    </span>
                    <HeartButton anuncioId={anuncio.id} size="sm" showLabel={false} />
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-black mb-3 group-hover:text-blue-600 transition-colors">
                    {anuncio.titulo}
                  </h3>
                  
                  <p className="font-sans text-gray-600 mb-4 line-clamp-3 text-sm">
                    {resumen100(anuncio.descripcion)}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm">
                    <div className="text-gray-500">
                      <div>{anuncio.usuario_nombre || 'Anónimo'}</div>
                      <div>{formatFecha(anuncio.creado)}</div>
                    </div>
                    <div className="text-gray-500">
                      {anuncio.provincia}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comunidad - Diseño más humano */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
                  Tu provincia también se construye
                  <span className="text-blue-600"> escuchándote</span>
                </h2>
                <p className="font-sans text-lg text-gray-600">
                  Participa activamente en tu comunidad
                </p>
              </div>
              
              <div className="space-y-6 mb-8">
                {[
                  { step: 1, title: 'Envía tus necesidades', desc: 'Cuéntanos qué falta en tu provincia' },
                  { step: 2, title: 'Participa en debates', desc: 'Únete a la conversación local' },
                  { step: 3, title: 'Propone mejoras', desc: 'Sugiere cambios para tu comunidad' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-black mb-1">{item.title}</h4>
                      <p className="font-sans text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/buzon-sugerencias"
                  className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95 text-center"
                >
                  Enviar necesidades
                </Link>
                <Link
                  href="/comunidad"
                  className="px-6 py-3 bg-white text-black border-2 border-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 text-center"
                >
                  Entrar en comunidad
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-12">
              <div className="text-center">
                <div className="text-5xl mb-6">🗣️</div>
                <h3 className="font-serif text-2xl font-bold text-black mb-4">
                  Tu voz importa
                </h3>
                <p className="font-sans text-gray-600 mb-6">
                  Miles de jóvenes ya participan
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

      {/* Instituciones - Más profesional y humano */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
              Una herramienta útil para
              <span className="text-blue-600"> instituciones</span>
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              Ayuntamientos y áreas de juventud confían en CityPAJ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              'Escucha activa',
              'Datos agregados', 
              'Participación ciudadana',
              'Recursos verificados'
            ].map((beneficio, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-black mb-2">{beneficio}</h3>
                <p className="font-sans text-gray-600 text-sm">
                  {beneficio === 'Escucha activa' && 'Conoce necesidades reales'}
                  {beneficio === 'Datos agregados' && 'Información territorial útil'}
                  {beneficio === 'Participación ciudadana' && 'Fomenta el diálogo local'}
                  {beneficio === 'Recursos verificados' && 'Publica información oficial'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="font-sans text-lg text-gray-600 mb-6">
              Preparado para colaborar con ayuntamientos y diputaciones
            </p>
            <Link
              href="/instituciones"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Más información
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final - Más directo y humano */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Empieza por tu provincia
          </h2>
          <p className="font-sans text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Únete a miles de jóvenes que ya participan en sus comunidades
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleSearch}
              disabled={!comunidadSeleccionada && !searchQuery}
              className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              Explorar oportunidades
            </button>
            <Link
              href="/comunidad"
              className="px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Entrar en comunidad
            </Link>
            <Link
              href="/publicar"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
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
      <HomePageContent />
    </Suspense>
  );
}
