'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

const GUARDADOS_KEY = 'citypaj_guardados';

interface Guardado {
  anuncioId: string;
  fechaGuardado: string;
}

export const useGuardados = () => {
  const { user } = useAuth();
  const [guardados, setGuardados] = useState<Guardado[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar guardados del localStorage al montar
  useEffect(() => {
    const cargarGuardados = () => {
      try {
        const guardadosGuardados = localStorage.getItem(GUARDADOS_KEY);
        if (guardadosGuardados) {
          const guardadosParseados = JSON.parse(guardadosGuardados);
          setGuardados(guardadosParseados);
        }
      } catch (error) {
        console.error('Error al cargar guardados:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarGuardados();
  }, []);

  // Guardar en localStorage cuando cambia
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(GUARDADOS_KEY, JSON.stringify(guardados));
      } catch (error) {
        console.error('Error al guardar guardados:', error);
      }
    }
  }, [guardados, loading]);

  // Verificar si un anuncio está guardado
  const estaGuardado = useCallback((anuncioId: string) => {
    return guardados.some(guardado => guardado.anuncioId === anuncioId);
  }, [guardados]);

  // Guardar un anuncio
  const guardarAnuncio = useCallback((anuncioId: string) => {
    if (!estaGuardado(anuncioId)) {
      const nuevoGuardado: Guardado = {
        anuncioId,
        fechaGuardado: new Date().toISOString()
      };
      setGuardados(prev => [...prev, nuevoGuardado]);
    }
  }, [estaGuardado]);

  // Dejar de guardar un anuncio
  const dejarDeGuardar = useCallback((anuncioId: string) => {
    setGuardados(prev => prev.filter(guardado => guardado.anuncioId !== anuncioId));
  }, []);

  // Toggle de guardado
  const toggleGuardado = useCallback((anuncioId: string) => {
    if (estaGuardado(anuncioId)) {
      dejarDeGuardar(anuncioId);
    } else {
      guardarAnuncio(anuncioId);
    }
  }, [estaGuardado, guardarAnuncio, dejarDeGuardar]);

  // Obtener número de guardados
  const numeroGuardados = guardados.length;

  // Limpiar todos los guardados
  const limpiarGuardados = useCallback(() => {
    setGuardados([]);
  }, []);

  return {
    guardados,
    loading,
    estaGuardado,
    guardarAnuncio,
    dejarDeGuardar,
    toggleGuardado,
    numeroGuardados,
    limpiarGuardados
  };
};
