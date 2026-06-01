'use client';



import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import Header from '@/components/layout/Header';

import Footer from '@/components/layout/Footer';

import Pagination from '@/components/ui/Pagination';

// No hay datos hardcodeados - se usa API real

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

  // Campos adicionales de joins

  usuario_nombre?: string;

  usuario_verificado?: boolean;

  numero_imagenes?: number;

  imagenes?: any[];

  es_favorito?: boolean;

}



interface PaginationMeta {

  pagina: number;

  limite: number;

  total: number;

  total_paginas: number;

}



type Categoria = 'todos' | 'ocio' | 'servicios' | 'educacion' | 'empleo' | 'intercambios' | 'vivienda' | null;



export default function HomePage() {

  
  const searchParams = useSearchParams();

  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();
  
  // Inicializar useGuardados para que los corazones funcionen
  useGuardados();



  useEffect(() => {

    const savedComunidad = localStorage.getItem('comunidadAutonoma');

    if (savedComunidad) {

      setComunidadAutonoma(savedComunidad);

    }

  }, []);



  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  const [categoria, setCategoria] = useState<Categoria | null>(null);

  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [anunciosPorComunidad, setAnunciosPorComunidad] = useState<{comunidad: string; anuncios: Anuncio[]}[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');



  // Leer página actual y término de búsqueda de URL

  useEffect(() => {

    const pageFromUrl = searchParams.get('pagina');

    if (pageFromUrl) {

      const page = parseInt(pageFromUrl, 10);

      if (!isNaN(page) && page > 0) {

        setCurrentPage(page);

      }

    }

    

    const buscarFromUrl = searchParams.get('buscar');

    if (buscarFromUrl) {

      setTerminoBusqueda(buscarFromUrl);

    }

  }, [searchParams]);



  const categoriaInfo = useMemo(() => {

    return {

      todos: {
        label: 'Todas las categorías',
        intro: 'Todos los anuncios disponibles:',
        bullets: ['Ocio y entretenimiento', 'Servicios útiles', 'Educación y formación', 'Empleo y oportunidades', 'Intercambios y vivienda'],
        cierre: 'Se muestran anuncios de todas las categorías disponibles en la comunidad.',
      },

      ocio: {

        label: 'Ocio',

        intro: 'Contenido relacionado con el tiempo libre juvenil:',

        bullets: ['Eventos y actividades', 'Conciertos y cultura', 'Planes de ocio para jóvenes'],

        cierre: 'Incluye anuncios vinculados al ocio dentro de la comunidad autónoma.',

      },

      servicios: {

        label: 'Servicios',

        intro: 'Información útil para la vida diaria:',

        bullets: ['Transporte', 'Salud juvenil', 'Vivienda', 'Ayudas públicas', 'Trámites administrativos'],

        cierre: 'Se muestran anuncios relacionados con servicios disponibles en la comunidad.',

      },

      vivienda: {

        label: 'Vivienda',

        intro: 'Alojamiento y opciones residenciales vinculadas a oportunidades:',

        bullets: ['Habitaciones y pisos compartidos', 'Alojamiento para prácticas', 'Vivienda temporal cerca del trabajo'],

        cierre: 'Anuncios de vivienda filtrados por comunidad autónoma.',

      },

      educacion: {

        label: 'Formación',

        intro: 'Recursos educativos y formativos:',

        bullets: ['Cursos y talleres', 'Becas', 'Centros educativos'],

        cierre: 'Anuncios relacionados con formación dentro de la comunidad autónoma.',

      },

      empleo: {

        label: 'Empleo',

        intro: 'Oportunidades laborales para jóvenes:',

        bullets: ['Ofertas de empleo', 'Prácticas', 'Voluntariado'],

        cierre: 'Anuncios de empleo filtrados por comunidad autónoma.',

      },

      intercambios: {

        label: 'Comunidad',

        intro: 'Espacio participativo de la plataforma:',

        bullets: ['Blog comunitario', 'Publicación de propuestas por parte de los usuarios', 'Debate y comentarios entre jóvenes'],

        cierre: 'Favorece la participación activa y la creación de comunidad juvenil.',

      },

    } as const;

  }, []);



  const comunidades = useMemo(

    () => [

      'Andalucía',

      'Aragón',

      'Asturias',

      'Baleares',

      'Canarias',

      'Cantabria',

      'Castilla-La Mancha',

      'Castilla y León',

      'Cataluña',

      'Comunidad Valenciana',

      'Extremadura',

      'Galicia',

      'Madrid',

      'Murcia',

      'Navarra',

      'País Vasco',

      'La Rioja',

    ],

    []

  );



  const fetchAnunciosPaginated = useCallback(async (comunidad: string | null, categoriaFilter: Categoria, page: number = 1, retryCount: number = 0, busqueda: string = '') => {

    if (!comunidad) return { data: [], meta: { pagina: 1, limite: 10, total: 0, total_paginas: 0 } };

    // Usar API real - no hay datos hardcodeados

    try {

      const params: Record<string, string> = {
        pagina: page.toString(),
        limite: '10'
      };
      
      if (categoriaFilter && categoriaFilter !== 'todos') {
        params.categoria = categoriaFilter;
      }
      
      if (busqueda) {
        params.buscar = busqueda;
      }

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/anuncios?${queryString}`, {

        headers: { 'Content-Type': 'application/json' },

        credentials: 'include'

      });

      if (!response.ok) throw new Error('Error en API');

      const data = await response.json();

      return data;

    } catch (error) {

      console.error('Error al obtener anuncios:', error);

      return { data: [], meta: { pagina: 1, limite: 10, total: 0, total_paginas: 0 } };

    }

    

    }, []);



  const fetchAnuncios = useCallback(

    async (comunidad: string | null, categoriaFilter: Categoria, page: number = 1) => {

      setLoading(true);

      setApiError(null);

      setAnuncios([]);

      setAnunciosPorComunidad([]);

      setPaginationMeta(null);



      try {

        if (!comunidad) {

          // Mostrar anuncios masivos para todas las comunidades

          const results = comunidades.map((c) => ({

            comunidad: c,

            anuncios: [], // Se obtendrán de la API real

          }));

          setAnunciosPorComunidad(results);

        } else if (comunidad) {

          // Usar paginación para comunidad específica con búsqueda

          const result = await fetchAnunciosPaginated(comunidad, categoriaFilter, page, 0, terminoBusqueda);

          setAnuncios(result.data);

          setPaginationMeta(result.meta);

        }

      } catch {

        setAnuncios([]);

        setAnunciosPorComunidad([]);

        setPaginationMeta(null);

      } finally {

        setLoading(false);

      }

    },

    [comunidades, fetchAnunciosPaginated, terminoBusqueda]

  );



  useEffect(() => {

    if (comunidadAutonoma) {

      void fetchAnuncios(comunidadAutonoma, categoria, currentPage);

    }

  }, [fetchAnuncios, comunidadAutonoma, categoria, currentPage]);



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

      <Header

        onCategoriaChange={(cat: string) => setCategoria(cat as Categoria)}

      />



      {/* Hero Section - Foto de fondo colaboración */}

      <section className="relative h-[70vh] overflow-hidden mb-16">

        {/* Fondo de imagen con overlay */}

        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>

          <img 

            src="/fondo-hero3.jpg"

            alt="Colaboración en equipo"

            className="w-full h-full object-cover"

          />

        </div>



        <div className="relative z-10 h-full flex items-center justify-center px-6">

          <div className="text-center max-w-5xl mx-auto">

            {/* Título más fino y elegante */}

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-wide drop-shadow-2xl">

              CityPaj

            </h1>

            

            {/* Subtítulo elegante */}

            <p className="font-sans text-xl sm:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light">

              Tu ciudad, tus anuncios, tu comunidad

            </p>



            {/* Selectores elegantes con fondo cristal */}

            <div className="flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto">

              
              {/* Selectores de comunidad y botón buscar */}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md">

                <div className="relative group">

                <select

                  value={comunidadAutonoma || ''}

                  onChange={(e) => {

                    const comunidad = e.target.value || '';

                    setComunidadAutonoma(comunidad);

                    if (comunidad) {

                      localStorage.setItem('comunidadAutonoma', comunidad);

                    } else {

                      localStorage.removeItem('comunidadAutonoma');

                    }

                  }}

                  className="h-12 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-2 border-white/30 text-black font-medium text-sm sm:text-base focus:outline-none focus:border-white/60 transition-all duration-300 cursor-pointer shadow-xl w-full"

                >

                  <option value="">Selecciona tu comunidad</option>

                  {comunidades.map((c) => (

                    <option key={c} value={c}>

                      {c}

                    </option>

                  ))}

                </select>

                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg -z-10 group-hover:border-white/50 transition-colors duration-300"></div>

              </div>



              <button

                onClick={() => {
                  // Lógica de búsqueda - redirigir al listado con filtros
                  if (comunidadAutonoma) {
                    const params = new URLSearchParams();
                    params.set('comunidad', comunidadAutonoma);
                    if (categoria && categoria !== 'todos') {
                      params.set('categoria', categoria);
                    }
                    window.location.href = `/anuncios?${params.toString()}`;
                  }
                }}

                className="h-12 px-6 sm:px-8 bg-black text-white font-semibold text-sm sm:text-base border-2 border-black hover:bg-orange-500 hover:border-orange-500 hover:text-black transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[120px] sm:min-w-[140px]"

              >

                Buscar

              </button>

            </div>

          </div>

        </div>

        </div>

      </section>



      <main className="w-[90%] sm:w-[80%] max-w-6xl mx-auto px-6 py-16">

        {/* Cómo funciona - Diseño Elegante */}

        <section className="mb-20 border border-solid border-black p-8">

          <div className="text-center mb-16">

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-black mb-4">Cómo funciona CityPaj</h2>

            <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">Descubre cómo nuestra plataforma conecta gente de tu comunidad</p>

          </div>

          

          <div className="max-w-5xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">

              {/* Paso 1 */}

              <div className="text-center">

                <div className="flex flex-col items-center">

                  <div className="w-12 h-12 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center font-bold text-lg mb-4 border border-orange-300">

                    1

                  </div>

                  <h3 className="font-serif text-xl font-bold text-black mb-4">Explora por Categoría</h3>

                  <p className="font-light text-gray-700 text-sm leading-relaxed mb-6">

                    Navega por nuestras secciones especializadas:

                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">

                    <Link href="/ocio" className="px-3 py-1 border border-black text-black hover:bg-orange-100 transition-all font-light text-xs text-center">

                      Ocio

                    </Link>

                    <Link href="/servicios" className="px-3 py-1 border border-black text-black hover:bg-orange-100 transition-all font-light text-xs text-center">

                      Servicios

                    </Link>

                    <Link href="/formacion" className="px-3 py-1 border border-black text-black hover:bg-orange-100 transition-all font-light text-xs text-center">

                      Formación

                    </Link>

                    <Link href="/empleo" className="px-3 py-1 border border-black text-black hover:bg-orange-100 transition-all font-light text-xs text-center">

                      Empleo

                    </Link>

                    <Link href="/comunidad" className="px-3 py-1 border border-black text-black hover:bg-orange-100 transition-all font-light text-xs text-center">

                      Comunidad

                    </Link>

                  </div>

                </div>

              </div>



              {/* Paso 2 */}

              <div className="text-center">

                <div className="flex flex-col items-center">

                  <div className="w-12 h-12 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-lg mb-4 border border-blue-300">

                    2

                  </div>

                  <h3 className="font-serif text-xl font-bold text-black mb-4">Filtra por Ubicación</h3>

                  <p className="font-light text-gray-700 text-sm leading-relaxed">

                    Selecciona tu comunidad autónoma para encontrar oportunidades cerca de ti. Contenido local y relevante.

                  </p>

                </div>

              </div>



              {/* Paso 3 */}

              <div className="text-center">

                <div className="flex flex-col items-center">

                  <div className="w-12 h-12 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold text-lg mb-4 border border-green-300">

                    3

                  </div>

                  <h3 className="font-serif text-xl font-bold text-black mb-4">Conecta y Participa</h3>

                  <p className="font-light text-gray-700 text-sm leading-relaxed">

                    Contacta directamente con los anunciantes, publica tus propios anuncios y únete a la comunidad juvenil.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>



        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-black pb-4 sm:pb-6 mt-10">

          <div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-black">

              {categoria 

                ? (categoria === 'intercambios' 

                    ? `Noticias comunitarias de ${comunidadAutonoma || 'España'}`

                    : `${categoriaInfo[categoria]?.label} en ${comunidadAutonoma || 'España'}`)

                : (

                    <Link 
                      href={comunidadAutonoma ? `/anuncios/comunidad/${encodeURIComponent(comunidadAutonoma)}` : "/anuncios"}
                      className="hover:text-orange-500 transition-colors flex items-center gap-2"
                    >
                      Últimos anuncios de {comunidadAutonoma || 'España'}
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>

                  )

              }

            </h2>

          </div>

          <div className="hidden sm:block font-sans text-sm text-[#666666]">

            {new Date().toLocaleDateString('es-ES', {

              weekday: 'long',

              year: 'numeric',

              month: 'long',

              day: 'numeric',

            })}

          </div>

        </div>



        {categoria ? (

          <section className="mt-8 border border-black p-6">

            <div className="font-sans text-sm text-black/80 leading-relaxed">

              <div className="font-medium text-black">{categoriaInfo[categoria]?.intro}</div>

              <ul className="mt-3 list-disc pl-5 space-y-1">

                {categoriaInfo[categoria]?.bullets.map((b: string) => (

                  <li key={b}>{b}</li>

                ))}

              </ul>

              <div className="mt-3">{categoriaInfo[categoria]?.cierre}</div>

            </div>

          </section>

        ) : null}



        {loading ? (

          <div className="mt-10 border border-black px-6 py-4 font-sans text-sm text-gray-700 inline-block">Cargando...</div>

        ) : comunidadAutonoma ? (

          <>

            {apiError ? (

              <div className="mt-10 border border-black p-6">

                <p className="font-sans text-sm text-black">{apiError}</p>

                <p className="mt-2 font-sans text-sm text-[#666666]">

                  Asegúrate de que el backend esté arrancado en <span className="font-mono">http://localhost:3002</span>.

                </p>

              </div>

            ) : null}



            <div className="mt-10 border border-black bg-white">

              {anuncios.length === 0 ? (

                <div className="p-8 text-center">

                  <div className="text-gray-500 mb-4">

                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                    </svg>

                    <p className="text-lg font-medium">No hay anuncios disponibles</p>

                    <p className="text-sm text-gray-500 mt-2">

                      En {comunidadAutonoma}

                      {categoria ? ` en la categoría ${categoriaInfo[categoria]?.label}` : ''}

                    </p>

                  </div>

                </div>

              ) : (

                <>

                  {/* Lista de anuncios en filas - más estrechos y elegantes */}

                  <div className="divide-y divide-black">

                    {anuncios.map((anuncio) => (

                      <Link

                        key={anuncio.id}

                        href={`/anuncios/${anuncio.id}`}

                        className="block py-2 px-4 hover:bg-gray-50 transition-colors"

                      >

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <div className="flex-1">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-black mb-1 hover:text-orange-500 transition-colors">
                              {anuncio.titulo}
                            </h3>
                            <p className="font-light text-gray-600 text-xs sm:text-sm">
                              {anuncio.descripcion}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 sm:ml-4">
                            <div className="flex items-center gap-2">
                              <HeartButton anuncioId={anuncio.id} size="sm" showLabel={false} />
                              <span className="font-medium">
                                {anuncio.usuario_nombre || 'Anónimo'}
                              </span>
                            </div>
                            <span>
                              {formatFecha(anuncio.creado)}
                            </span>
                          </div>
                        </div>

                      </Link>

                    ))}

                  </div>



                  {/* Paginación elegante - números más grandes, negros, serifa, sin fondo */}

                  {paginationMeta && (

                    <div className="border-t border-black p-6">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">

                        <div className="text-xs sm:text-sm text-gray-600">

                          Mostrando {anuncios.length} de {paginationMeta.total} anuncios

                        </div>

                        <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">

                          {/* Números de página del 1 al 7 */}

                          {Array.from({ length: Math.min(7, paginationMeta.total_paginas) }, (_, i) => i + 1).map((pageNum) => (

                            <button

                              key={pageNum}

                              onClick={() => {

                                setCurrentPage(pageNum);

                                const params = new URLSearchParams(window.location.search);

                                params.set('pagina', pageNum.toString());

                                window.history.pushState(null, '', `?${params.toString()}`);

                              }}

                              className={`px-2 sm:px-3 py-1 text-base sm:text-lg font-serif font-bold transition-all hover:text-orange-500 ${
                                paginationMeta.pagina === pageNum
                                  ? 'text-black text-lg sm:text-xl'
                                  : 'text-black hover:text-orange-500'
                              }`}

                            >

                              {pageNum}

                            </button>

                          ))}

                          

                          {paginationMeta.total_paginas > 7 && (

                            <>

                              <span className="px-1 sm:px-2 text-gray-500 font-serif text-base sm:text-lg">...</span>

                              <button

                                onClick={() => {

                                  setCurrentPage(paginationMeta.total_paginas);

                                  const params = new URLSearchParams(window.location.search);

                                  params.set('pagina', paginationMeta.total_paginas.toString());

                                  window.history.pushState(null, '', `?${params.toString()}`);

                                }}

                                className="px-2 sm:px-3 py-1 text-base sm:text-lg font-serif font-bold text-black hover:text-orange-500 transition-all"

                              >

                                {paginationMeta.total_paginas}

                              </button>

                            </>

                          )}

                        </div>

                      </div>

                    </div>

                  )}

                </>

              )}

            </div>

          </>

        ) : (

          <div className="mt-10 space-y-14">

            {apiError ? (

              <div className="border border-black p-6">

                <p className="font-sans text-sm text-black">{apiError}</p>

                <p className="mt-2 font-sans text-sm text-[#666666]">

                  Asegúrate de que el backend esté arrancado en <span className="font-mono">http://localhost:3002</span>.

                </p>

              </div>

            ) : null}



            {anunciosPorComunidad.map((grupo) => (

              <section key={grupo.comunidad}>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-6 border-b border-black pb-3 sm:pb-4">
                  <h3 className="font-serif text-lg sm:text-xl sm:text-2xl font-bold text-black">{grupo.comunidad}</h3>
                  <div className="hidden sm:block font-sans text-xs text-[#666666]">España</div>
                </div>



                {grupo.anuncios.length === 0 ? (

                  <div className="mt-6 border border-black p-5">

                    <p className="font-sans text-sm text-[#666666]">No hay anuncios disponibles</p>

                  </div>

                ) : (

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                    {grupo.anuncios.map((anuncio) => (

                      <Link

                        key={anuncio.id}

                        href={`/anuncios/${anuncio.id}`}

                        className="group block border border-black p-3 sm:p-4 hover:border-orange-500 transition-colors h-full min-h-[140px] sm:min-h-[160px] flex flex-col"

                      >

                        <h4 className="font-serif text-base sm:text-lg font-bold text-black leading-tight group-hover:text-orange-500 transition-colors">

                          {anuncio.titulo}

                        </h4>

                        <p className="mt-2 font-sans text-xs sm:text-sm text-black/80 leading-relaxed">{anuncio.descripcion}</p>

                        <div className="mt-auto pt-2 sm:pt-3 font-sans text-xs text-[#666666] flex flex-col sm:flex-row sm:justify-between gap-1">

                          <span>{formatFecha(anuncio.creado)}</span>

                          {anuncio.usuario_nombre && <span>{anuncio.usuario_nombre}</span>}

                        </div>

                      </Link>

                    ))}

                  </div>

                )}

              </section>

            ))}

          </div>

        )}

      </main>

      {/* Grid de Enlaces de Interés por Comunidad Autónoma */}
      {comunidadAutonoma && (
        <section className="w-full bg-white py-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-black mb-10">
              Enlaces de Interés - {comunidadAutonoma}
            </h2>
            
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* Fila 1: Juventud */}
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/juventud-placeholder.jpg" 
                    alt="Juventud"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SnV2ZW50dWQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Juventud</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/juventud-placeholder.jpg" 
                    alt="Juventud"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SnV2ZW50dWQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Juventud</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/juventud-placeholder.jpg" 
                    alt="Juventud"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SnV2ZW50dWQ8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Juventud</p>
              </div>

              {/* Fila 2: Extranjería */}
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/extranjeria-placeholder.jpg" 
                    alt="Extranjería"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXh0cmFuamVyw61hPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Extranjería</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/extranjeria-placeholder.jpg" 
                    alt="Extranjería"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXh0cmFuamVyw61hPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Extranjería</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/extranjeria-placeholder.jpg" 
                    alt="Extranjería"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXh0cmFuamVyw61hPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Extranjería</p>
              </div>

              {/* Fila 3: Comunidad (Buzón de Sugerencias) */}
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/comunidad-placeholder.jpg" 
                    alt="Comunidad"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29tdW5pZGFkPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Comunidad</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/comunidad-placeholder.jpg" 
                    alt="Comunidad"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29tdW5pZGFkPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Comunidad</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square mb-2">
                  <img 
                    src="/images/comunidad-placeholder.jpg" 
                    alt="Comunidad"
                    className="w-full h-full object-cover border border-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29tdW5pZGFkPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-700">Comunidad</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

    </div>

  );

}

