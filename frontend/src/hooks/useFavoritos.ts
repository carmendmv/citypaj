import { useState, useEffect } from 'react';

interface Favorito {
  id: string;
  titulo: string;
  categoria: string;
  precio?: number;
  creado_at: string;
}

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const savedFavoritos = localStorage.getItem('favoritos');
    if (savedFavoritos) {
      try {
        setFavoritos(JSON.parse(savedFavoritos));
      } catch (error) {
        console.error('Error cargando favoritos:', error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (favoritos.length > 0) {
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
  }, [favoritos]);

  const agregarFavorito = (anuncio: Favorito) => {
    setFavoritos(prev => {
      const existe = prev.find(fav => fav.id === anuncio.id);
      if (existe) {
        return prev.filter(fav => fav.id !== anuncio.id);
      } else {
        return [...prev, anuncio];
      }
    });
  };

  const eliminarFavorito = (id: string) => {
    setFavoritos(prev => prev.filter(fav => fav.id !== id));
  };

  const esFavorito = (id: string) => {
    return favoritos.some(fav => fav.id === id);
  };

  const contarFavoritos = () => {
    return favoritos.length;
  };

  return {
    favoritos,
    loading,
    agregarFavorito,
    eliminarFavorito,
    esFavorito,
    contarFavoritos
  };
};
