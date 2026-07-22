'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Pagination from '@/components/ui/Pagination';
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
  comunidad_autonoma?: string;
  provincia?: string;
  barrio?: string;
  modalidad: string;
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: string;
  motivo_rechazo?: string;
  vistas: number;
  creado_at: string;
  actualizado_at: string;
  usuario_nombre: string;
  usuario_email: string;
}

interface ApiResponse {
  success: boolean;
  data: Anuncio[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

type Categoria = 'servicios' | 'formacion' | 'empleo' | 'comunidad' | 'ocio' | 'transporte' | 'vivienda' | 'salud' | 'tecnología' | 'otros';

const CATEGORIAS: Categoria[] = ['servicios', 'formacion', 'empleo', 'comunidad', 'ocio', 'transporte', 'vivienda', 'salud', 'tecnología', 'otros'];

const CATEGORIAS_COMPLETAS = [
  { id: 'servicios', nombre: 'Servicios', icon: '🔧' },
  { id: 'formacion', nombre: 'Formación', icon: '📚' },
  { id: 'empleo', nombre: 'Empleo', icon: '💼' },
  { id: 'comunidad', nombre: 'Comunidad', icon: '🤝' },
  { id: 'ocio', nombre: 'Ocio', icon: '🎮' },
  { id: 'transporte', nombre: 'Transporte', icon: '🚗' },
  { id: 'vivienda', nombre: 'Vivienda', icon: '🏠' },
  { id: 'salud', nombre: 'Salud', icon: '🏥' },
  { id: 'tecnología', nombre: 'Tecnología', icon: '💻' },
  { id: 'otros', nombre: 'Otros', icon: '📦' }
];

export default function HomePageContent() {
  const searchParams = useSearchParams();
  const { comunidadAutonoma, setComunidadAutonoma } = useComunidad();
  
  // Estado para controlar si la web está girando en torno a una CCAA específica
  const [focusedComunidad, setFocusedComunidad] = useState<string | null>(null);
  
  // Inicializar useGuardados para que los corazones funcionen
  useGuardados();

  useEffect(() => {
    const savedComunidad = localStorage.getItem('comunidadAutonoma');
    if (savedComunidad) {
      setComunidadAutonoma(savedComunidad);
      setFocusedComunidad(savedComunidad);
    }
  }, [setComunidadAutonoma]);

  const [categoria, setCategoria] = useState<Categoria>('servicios');
  const [currentPage, setCurrentPage] = useState(1);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch anuncios from API
  const fetchAnuncios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('pagina', currentPage.toString());
      params.set('limite', '12');
      params.set('categoria', categoria);
      
      if (comunidadAutonoma) {
        params.set('comunidad_autonoma', comunidadAutonoma);
      }

      const response = await fetch(`/api/anuncios?${params.toString()}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setAnuncios(data.data);
        setTotalPages(data.meta.totalPages);
        setTotal(data.meta.total);
      }
    } catch (error) {
      console.error('Error fetching anuncios:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, categoria, comunidadAutonoma]);

  useEffect(() => {
    fetchAnuncios();
  }, [fetchAnuncios]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCategoriaChange={(cat: string) => {
          setCategoria(cat as Categoria);
          if (focusedComunidad) {
            setComunidadAutonoma(focusedComunidad);
            localStorage.setItem('comunidadAutonoma', focusedComunidad);
          }
          setCurrentPage(1);
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden mb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>
          <img 
            src="/fondo-hero1.jpeg"
            alt="Colaboración en equipo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              CityPAJ
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Plataforma de colaboración y servicios para tu comunidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/anuncios"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Explorar Anuncios
              </Link>
              <Link 
                href="/publicar"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Publicar Anuncio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explora por Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIAS_COMPLETAS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id as Categoria)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  categoria === cat.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.nombre}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Anuncios Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {CATEGORIAS_COMPLETAS.find(cat => cat.id === categoria)?.nombre}
            </h2>
            <div className="text-gray-600">
              {total} anuncios encontrados
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl">Cargando anuncios...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-blue-600 font-semibold">
                        {CATEGORIAS_COMPLETAS.find(cat => cat.id === anuncio.categoria)?.nombre}
                      </span>
                      <HeartButton anuncioId={anuncio.id} />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {anuncio.titulo}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {anuncio.descripcion}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>📍 {anuncio.provincia}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {formatDate(anuncio.creado_at)}
                      </span>
                      <Link 
                        href={`/anuncios/${anuncio.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
