import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface Anuncio {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  subcategoria: string | null;
  comunidad_id: number;
  provincia_id: number;
  comunidad_autonoma: string | null;
  provincia: string | null;
  barrio: string | null;
  modalidad: string;
  contacto_email: boolean;
  contacto_telefono: boolean;
  contacto_anonimo: boolean;
  visible: boolean;
  estado_moderacion: string;
  motivo_rechazo: string | null;
  vistas: number;
  creado_at: Date;
  actualizado_at: Date;
  usuario_nombre: string;
  usuario_email: string;
}

let cacheData: { anuncios: Anuncio[]; lastCacheUpdate: string } | null = null;

function loadCache() {
  try {
    const cachePath = path.join(process.cwd(), 'real-data-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = fs.readFileSync(cachePath, 'utf8');
      cacheData = JSON.parse(data);
      console.log(`✅ Cache cargado: ${cacheData?.anuncios.length || 0} anuncios`);
    } else {
      console.log('❌ No se encontró el archivo cache');
      cacheData = { anuncios: [], lastCacheUpdate: '' };
    }
  } catch (error) {
    console.error('❌ Error cargando cache:', error);
    cacheData = { anuncios: [], lastCacheUpdate: '' };
  }
}

export const getAnuncios = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!cacheData) {
      loadCache();
    }

    const {
      pagina = '1',
      limite = '20',
      categoria,
      comunidad_autonoma,
      provincia,
      orden = 'fecha_desc',
      busqueda
    } = req.query;

    const page = parseInt(pagina as string);
    const limit = parseInt(limite as string);
    const offset = (page - 1) * limit;

    // Filtrar anuncios
    let filteredAnuncios = cacheData?.anuncios ?? [];

    // Solo mostrar anuncios visibles y aprobados
    filteredAnuncios = filteredAnuncios.filter(anuncio => 
      anuncio.visible && anuncio.estado_moderacion === 'approved'
    );

    // Aplicar filtros
    if (categoria) {
      filteredAnuncios = filteredAnuncios.filter(anuncio => 
        anuncio.categoria === categoria
      );
    }

    if (comunidad_autonoma) {
      filteredAnuncios = filteredAnuncios.filter(anuncio => 
        anuncio.comunidad_autonoma?.toLowerCase().includes((comunidad_autonoma as string).toLowerCase())
      );
    }

    if (provincia) {
      filteredAnuncios = filteredAnuncios.filter(anuncio => 
        anuncio.provincia?.toLowerCase().includes((provincia as string).toLowerCase())
      );
    }

    if (busqueda) {
      const searchTerm = (busqueda as string).toLowerCase();
      filteredAnuncios = filteredAnuncios.filter(anuncio => 
        anuncio.titulo.toLowerCase().includes(searchTerm) ||
        anuncio.descripcion.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar
    filteredAnuncios.sort((a, b) => {
      switch (orden) {
        case 'fecha_asc':
          return new Date(a.creado_at).getTime() - new Date(b.creado_at).getTime();
        case 'fecha_desc':
        default:
          return new Date(b.creado_at).getTime() - new Date(a.creado_at).getTime();
        case 'titulo_asc':
          return a.titulo.localeCompare(b.titulo);
        case 'titulo_desc':
          return b.titulo.localeCompare(a.titulo);
        case 'vistas_desc':
          return b.vistas - a.vistas;
        case 'vistas_asc':
          return a.vistas - b.vistas;
      }
    });

    // Paginar
    const total = filteredAnuncios.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedAnuncios = filteredAnuncios.slice(offset, offset + limit);

    // Transformar al formato esperado por el frontend
    const transformedAnuncios = paginatedAnuncios.map(anuncio => ({
      id: anuncio.id,
      titulo: anuncio.titulo,
      descripcion: anuncio.descripcion,
      categoria: anuncio.categoria,
      subcategoria: anuncio.subcategoria,
      comunidad_autonoma: anuncio.comunidad_autonoma,
      provincia: anuncio.provincia,
      barrio: anuncio.barrio,
      modalidad: anuncio.modalidad,
      contacto_email: anuncio.contacto_email,
      contacto_telefono: anuncio.contacto_telefono,
      contacto_anonimo: anuncio.contacto_anonimo,
      visible: anuncio.visible,
      estado_moderacion: anuncio.estado_moderacion,
      vistas: anuncio.vistas,
      creado_at: anuncio.creado_at,
      actualizado_at: anuncio.actualizado_at,
      usuario_nombre: anuncio.usuario_nombre,
      usuario_email: anuncio.usuario_email
    }));

    res.status(200).json({
      success: true,
      data: transformedAnuncios,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error obteniendo anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getAnuncioById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!cacheData) {
      loadCache();
    }

    const { id } = req.params;
    const anuncio = cacheData?.anuncios?.find(a => a.id === id);

    if (!anuncio) {
      res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
      return;
    }

    // Solo mostrar si es visible y aprobado
    if (!anuncio.visible || anuncio.estado_moderacion !== 'approved') {
      res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: anuncio
    });

  } catch (error) {
    console.error('Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Funciones placeholder para las demás operaciones
export const createAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada'
  });
};

export const updateAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada'
  });
};

export const deleteAnuncio = async (_req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    error: 'Función no implementada'
  });
};
