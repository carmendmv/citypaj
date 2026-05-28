'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FavoritoButton from '@/components/ui/FavoritoButton';
import RouteProtection from '@/components/auth/RouteProtection';
import { useFavoritos } from '@/hooks/useFavoritos';
import { Anuncio } from '@/types';

export default function PerfilPage() {
  const { anunciosFavoritos, limpiarFavoritos, contarFavoritos } = useFavoritos();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [palabraConfirmacion, setPalabraConfirmacion] = useState('');
  const [seccionActiva, setSeccionActiva] = useState<'publicar' | 'publicados' | 'destacados'>('destacados');

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio: number | null | undefined) => {
    if (precio === null || precio === undefined || precio === 0) {
      return 'Gratis';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };

  const handleLimpiarFavoritos = () => {
    limpiarFavoritos();
    setMostrarConfirmacion(false);
  };

  const handleEliminarCuenta = () => {
    if (palabraConfirmacion.toLowerCase() === 'eliminar') {
      // Eliminar datos del localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('favoritos');
      
      // Redirigir a la página principal
      window.location.href = '/';
    } else {
      alert('Debes escribir la palabra "eliminar" para confirmar');
    }
  };

  const CategoriaBadge = ({ categoria }: { categoria: string }) => {
    const colores: Record<string, string> = {
      educacion: 'bg-blue-100 text-blue-800',
      servicios: 'bg-green-100 text-green-800',
      vivienda: 'bg-purple-100 text-purple-800',
      empleo: 'bg-orange-100 text-orange-800',
      objetos: 'bg-gray-100 text-gray-800',
      ocio: 'bg-pink-100 text-pink-800',
      intercambios: 'bg-yellow-100 text-yellow-800'
    };

    const etiquetas: Record<string, string> = {
      educacion: 'Educación',
      servicios: 'Servicios',
      vivienda: 'Vivienda',
      empleo: 'Empleo',
      objetos: 'Objetos',
      ocio: 'Ocio',
      intercambios: 'Intercambios'
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colores[categoria] || 'bg-gray-100 text-gray-800'}`}>
        {etiquetas[categoria] || categoria}
      </span>
    );
  };

  return (
    <RouteProtection requireAuth={true}>
      <div className="min-h-screen bg-white">
        <Header />
      
      <main className="w-[90%] sm:w-[85%] max-w-6xl mx-auto px-6 py-14">
        <div className="border-b border-black pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black">Mi Perfil</h1>
          <p className="mt-2 font-sans text-sm text-[#666666]">Gestiona tu cuenta y anuncios favoritos</p>
        </div>

        {/* Sección de configuración */}
        <div className="mt-8 border border-black p-6">
          <h2 className="font-serif text-xl font-bold text-black mb-4">Configuración de cuenta</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-sans text-sm font-medium text-black">Eliminar cuenta</h3>
                <p className="font-sans text-xs text-[#666666]">Elimina permanentemente tu cuenta y todos tus datos</p>
              </div>
              <button
                onClick={() => setMostrarConfirmacionEliminar(true)}
                className="px-3 py-1 text-sm font-sans text-gray-500 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-md transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="mt-10 border border-black">
          <div className="border-b border-black">
            <nav className="flex">
              <button
                onClick={() => setSeccionActiva('publicar')}
                className={`px-6 py-4 font-sans text-sm font-medium border-b-2 transition-colors ${
                  seccionActiva === 'publicar'
                    ? 'border-black text-black'
                    : 'border-transparent text-[#666666] hover:text-black hover:border-gray-400'
                }`}
              >
                Publicar anuncio
              </button>
              <button
                onClick={() => setSeccionActiva('publicados')}
                className={`px-6 py-4 font-sans text-sm font-medium border-b-2 transition-colors ${
                  seccionActiva === 'publicados'
                    ? 'border-black text-black'
                    : 'border-transparent text-[#666666] hover:text-black hover:border-gray-400'
                }`}
              >
                Anuncios publicados
              </button>
              <button
                onClick={() => setSeccionActiva('destacados')}
                className={`px-6 py-4 font-sans text-sm font-medium border-b-2 transition-colors ${
                  seccionActiva === 'destacados'
                    ? 'border-black text-black'
                    : 'border-transparent text-[#666666] hover:text-black hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Anuncios destacados</span>
                  {contarFavoritos() > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                      {contarFavoritos()}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido dinámico según pestaña */}
        <div className="p-6">
          {seccionActiva === 'publicar' && (
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold text-black mb-2">Publicar nuevo anuncio</h2>
                <p className="font-sans text-sm text-[#666666] mb-6">
                  Comparte tus servicios, productos o necesidades con la comunidad juvenil
                </p>
              </div>
              <Link
                href="/publicar"
                className="inline-flex items-center justify-center bg-white text-black border border-black px-8 py-3 font-sans text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
              >
                Crear anuncio
              </Link>
            </div>
          )}

        {seccionActiva === 'publicados' && (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-black mb-2">Tus anuncios publicados</h2>
              <p className="font-sans text-sm text-[#666666] mb-6">
                Aquí aparecerán los anuncios que hayas publicado
              </p>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-8">
              <p className="font-sans text-sm text-gray-500">
                No tienes anuncios publicados aún. 
                <button 
                  onClick={() => setSeccionActiva('publicar')}
                  className="text-black hover:text-orange-500 ml-1"
                >
                  Crea tu primer anuncio
                </button>
              </p>
            </div>
          </div>
        )}

        {seccionActiva === 'destacados' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-black">Anuncios destacados</h2>
                <p className="font-sans text-sm text-[#666666] mt-1">
                  {contarFavoritos()} {contarFavoritos() === 1 ? 'anuncio guardado' : 'anuncios guardados'}
                </p>
              </div>
              {contarFavoritos() > 0 && (
                <button
                  onClick={() => setMostrarConfirmacion(true)}
                  className="text-sm font-sans text-red-600 hover:text-red-700 transition-colors"
                >
                  Limpiar todos
                </button>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Lista de favoritos - solo mostrar en pestaña destacados */}
        {seccionActiva === 'destacados' && (
          <>
            {anunciosFavoritos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-black mb-2">No tienes anuncios guardados</h3>
                <p className="font-sans text-sm text-[#666666]">
                  Guarda anuncios que te interesen para encontrarlos fácilmente
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {anunciosFavoritos.map((anuncio) => (
                  <div key={anuncio.id} className="border border-black p-4 hover:border-orange-500 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-lg font-semibold text-black">
                            {anuncio.titulo}
                          </h3>
                          <CategoriaBadge categoria={anuncio.categoria} />
                        </div>
                        
                        <p className="font-sans text-sm text-[#666666] mb-3 line-clamp-2">
                          {anuncio.descripcion}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-[#666666]">
                          <span className="font-medium">{anuncio.usuario_nombre}</span>
                          <span>•</span>
                          <span>{anuncio.comunidad_autonoma}</span>
                          {anuncio.precio && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-black">{formatearPrecio(anuncio.precio)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <FavoritoButton anuncio={anuncio} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal de confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-black p-6 max-w-sm w-full mx-4">
              <h3 className="font-serif text-lg font-bold text-black mb-2">
                Limpiar todos los favoritos
              </h3>
              <p className="font-sans text-sm text-[#666666] mb-6">
                ¿Estás seguro de que quieres eliminar todos los anuncios guardados? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarConfirmacion(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLimpiarFavoritos}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Limpiar todos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar cuenta */}
        {mostrarConfirmacionEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-black p-6 max-w-md w-full mx-4">
              <h3 className="font-serif text-lg font-bold text-black mb-2">
                Eliminar cuenta permanentemente
              </h3>
              <p className="font-sans text-sm text-[#666666] mb-4">
                Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.
              </p>
              <p className="font-sans text-sm text-[#666666] mb-4">
                Escribe la palabra <strong>"eliminar"</strong> para confirmar:
              </p>
              <input
                type="text"
                value={palabraConfirmacion}
                onChange={(e) => setPalabraConfirmacion(e.target.value)}
                placeholder="Escribe 'eliminar'"
                className="w-full px-3 py-2 border border-black rounded-lg font-sans text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarConfirmacionEliminar(false);
                    setPalabraConfirmacion('');
                  }}
                  className="px-4 py-2 text-sm font-sans text-gray-600 hover:text-black border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminarCuenta}
                  className="px-4 py-2 text-sm font-sans text-white bg-red-500 hover:bg-red-600 border border-red-500 hover:border-red-600 rounded-md transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar permanentemente
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
    </RouteProtection>
  );
}
