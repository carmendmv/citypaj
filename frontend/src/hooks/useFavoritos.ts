'use client';

import { useState, useEffect } from 'react';
import { Anuncio } from '@/types';

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [anunciosFavoritos, setAnunciosFavoritos] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFavorito = async (anuncioId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/anuncios/favorito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anuncioId }),
      });

      if (response.ok) {
        setFavoritos(prev => 
          prev.includes(anuncioId) 
            ? prev.filter(id => id !== anuncioId)
            : [...prev, anuncioId]
        );
        // Refrescar anuncios favoritos
        fetchFavoritos();
      }
    } catch (error) {
      console.error('Error toggling favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/anuncios/favoritos');
      if (response.ok) {
        const data = await response.json();
        setAnunciosFavoritos(data.anuncios || []);
        setFavoritos(data.anuncios?.map((a: Anuncio) => a.id) || []);
      }
    } catch (error) {
      console.error('Error fetching favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFavoritos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/anuncios/favoritos', {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavoritos([]);
        setAnunciosFavoritos([]);
      }
    } catch (error) {
      console.error('Error limpiando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const contarFavoritos = () => {
    return favoritos.length;
  };

  const isFavorito = (anuncioId: string) => {
    return favoritos.includes(anuncioId);
  };

  useEffect(() => {
    fetchFavoritos();
  }, []);

  return {
    favoritos,
    anunciosFavoritos,
    loading,
    toggleFavorito,
    isFavorito,
    limpiarFavoritos,
    contarFavoritos,
  };
};
