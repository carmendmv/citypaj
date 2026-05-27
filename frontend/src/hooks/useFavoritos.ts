'use client';

import { useState, useEffect } from 'react';
import { Anuncio } from '@/types';

interface FavoritosState {
  favoritos: string[];
  anunciosFavoritos: Anuncio[];
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [anunciosFavoritos, setAnunciosFavoritos] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const favoritosGuardados = localStorage.getItem('favoritosCityPaj');
    if (favoritosGuardados) {
      try {
        const favoritosData = JSON.parse(favoritosGuardados);
        setFavoritos(favoritosData.favoritos || []);
        setAnunciosFavoritos(favoritosData.anunciosFavoritos || []);
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        setFavoritos([]);
        setAnunciosFavoritos([]);
      }
    }
  }, []);

  // Guardar favoritos en localStorage
  const guardarFavoritos = (favoritosIds: string[], anuncios: Anuncio[]) => {
    const favoritosData: FavoritosState = {
      favoritos: favoritosIds,
      anunciosFavoritos: anuncios
    };
    localStorage.setItem('favoritosCityPaj', JSON.stringify(favoritosData));
    setFavoritos(favoritosIds);
    setAnunciosFavoritos(anuncios);
  };

  // Añadir anuncio a favoritos
  const agregarFavorito = (anuncio: Anuncio) => {
    setLoading(true);
    try {
      const nuevosFavoritos = [...favoritos];
      const nuevosAnuncios = [...anunciosFavoritos];
      
      if (!nuevosFavoritos.includes(anuncio.id)) {
        nuevosFavoritos.push(anuncio.id);
        nuevosAnuncios.push(anuncio);
      }
      
      guardarFavoritos(nuevosFavoritos, nuevosAnuncios);
      console.log('✅ Anuncio añadido a favoritos:', anuncio.titulo);
    } catch (error) {
      console.error('❌ Error al añadir favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quitar anuncio de favoritos
  const quitarFavorito = (anuncioId: string) => {
    setLoading(true);
    try {
      const nuevosFavoritos = favoritos.filter(id => id !== anuncioId);
      const nuevosAnuncios = anunciosFavoritos.filter(anuncio => anuncio.id !== anuncioId);
      
      guardarFavoritos(nuevosFavoritos, nuevosAnuncios);
      console.log('✅ Anuncio quitado de favoritos:', anuncioId);
    } catch (error) {
      console.error('❌ Error al quitar favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un anuncio está en favoritos
  const esFavorito = (anuncioId: string): boolean => {
    return favoritos.includes(anuncioId);
  };

  // Toggle favorito (añadir/quitar)
  const toggleFavorito = (anuncio: Anuncio) => {
    if (esFavorito(anuncio.id)) {
      quitarFavorito(anuncio.id);
    } else {
      agregarFavorito(anuncio);
    }
  };

  // Obtener número de favoritos
  const contarFavoritos = (): number => {
    return favoritos.length;
  };

  // Limpiar todos los favoritos
  const limpiarFavoritos = () => {
    setLoading(true);
    try {
      guardarFavoritos([], []);
      console.log('✅ Todos los favoritos han sido eliminados');
    } catch (error) {
      console.error('❌ Error al limpiar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    favoritos,
    anunciosFavoritos,
    loading,
    agregarFavorito,
    quitarFavorito,
    esFavorito,
    toggleFavorito,
    contarFavoritos,
    limpiarFavoritos
  };
}
