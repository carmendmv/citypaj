import { Request, Response } from 'express';
import MockDataService from '../services/mockDataService';

// Obtener todas las comunidades autónomas
export const getComunidades = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Obteniendo comunidades autónomas con servicio mock');
    
    const comunidades = MockDataService.getComunidades();

    res.status(200).json({
      success: true,
      data: comunidades
    });

  } catch (error) {
    console.error('Error obteniendo comunidades:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener comunidad por ID
export const getComunidadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const comunidades = MockDataService.getComunidades();
    const comunidad = comunidades.find(c => c.id === id);

    if (!comunidad) {
      res.status(404).json({
        success: false,
        error: 'Comunidad no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: comunidad
    });

  } catch (error) {
    console.error('Error obteniendo comunidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener categorías disponibles
export const getCategorias = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Obteniendo categorías con servicio mock');
    
    const categorias = MockDataService.getCategorias();

    res.status(200).json({
      success: true,
      data: categorias
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de la plataforma
export const getEstadisticas = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔄 Obteniendo estadísticas con servicio mock');
    
    const anuncios = MockDataService.getAnuncios();
    const comunidades = MockDataService.getComunidades();
    
    const stats = {
      totalAnuncios: anuncios.length,
      totalComunidades: comunidades.length,
      totalCategorias: MockDataService.getCategorias().length - 1, // Excluir 'todos'
      anunciosPorCategoria: {} as { [key: string]: number },
      anunciosPorComunidad: {} as { [key: string]: number },
      anunciosActivos: anuncios.filter(a => a.visible && a.estado_moderacion === 'approved').length,
      anunciosPendientes: anuncios.filter(a => a.estado_moderacion === 'pending').length
    };

    // Calcular distribución por categoría
    anuncios.forEach(anuncio => {
      stats.anunciosPorCategoria[anuncio.categoria] = (stats.anunciosPorCategoria[anuncio.categoria] || 0) + 1;
    });

    // Calcular distribución por comunidad
    anuncios.forEach(anuncio => {
      stats.anunciosPorComunidad[anuncio.comunidad_autonoma] = (stats.anunciosPorComunidad[anuncio.comunidad_autonoma] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
