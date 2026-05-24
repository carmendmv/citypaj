import { Request, Response } from 'express';
import { pool } from '../config/database';

export interface Sugerencia {
  id?: number;
  nombre?: string;
  email?: string;
  edad?: string;
  categoria: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  solicitud_ayuntamiento?: string;
  anonimo: boolean;
  comunidad_autonoma: string;
  fecha: string;
  estado: 'pendiente' | 'revisada' | 'en_progreso' | 'resuelta' | 'rechazada';
}

export const createSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const sugerencia: Sugerencia = req.body;
    
    // Validar campos requeridos
    if (!sugerencia.titulo || !sugerencia.descripcion || !sugerencia.categoria || !sugerencia.prioridad) {
      res.status(400).json({ error: 'Faltan campos requeridos: título, descripción, categoría y prioridad' });
      return;
    }

    // Insertar en la base de datos
    const query = `
      INSERT INTO sugerencias (
        nombre, email, edad, categoria, prioridad, titulo, descripcion, 
        solicitud_ayuntamiento, anonimo, comunidad_autonoma, fecha, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      sugerencia.anonimo ? null : sugerencia.nombre,
      sugerencia.anonimo ? null : sugerencia.email,
      sugerencia.anonimo ? null : sugerencia.edad,
      sugerencia.categoria,
      sugerencia.prioridad,
      sugerencia.titulo,
      sugerencia.descripcion,
      sugerencia.solicitud_ayuntamiento || null,
      sugerencia.anonimo,
      sugerencia.comunidad_autonoma,
      sugerencia.fecha,
      sugerencia.estado || 'pendiente'
    ];

    pool.query(query, values, (error: any, results: any) => {
      if (error) {
        console.error('Error al crear sugerencia:', error);
        res.status(500).json({ error: 'Error al guardar la sugerencia' });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Sugerencia guardada correctamente',
        id: results.insertId
      });
    });

  } catch (error) {
    console.error('Error en createSugerencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSugerencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, categoria, prioridad, estado, comunidad_autonoma } = req.query;
    
    let query = 'SELECT * FROM sugerencias WHERE 1=1';
    const params: any[] = [];

    // Filtros
    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }
    if (prioridad) {
      query += ' AND prioridad = ?';
      params.push(prioridad);
    }
    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }
    if (comunidad_autonoma && comunidad_autonoma !== 'Todas') {
      query += ' AND comunidad_autonoma = ?';
      params.push(comunidad_autonoma);
    }

    // Ordenamiento y paginación
    query += ' ORDER BY fecha DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), (parseInt(page as string) - 1) * parseInt(limit as string));

    pool.query(query, params, (error: any, results: any) => {
      if (error) {
        console.error('Error al obtener sugerencias:', error);
        res.status(500).json({ error: 'Error al obtener sugerencias' });
        return;
      }

      res.json({
        data: results,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        }
      });
    });

  } catch (error) {
    console.error('Error en getSugerencias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getEstadisticasSugerencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { comunidad_autonoma } = req.query;

    // Estadísticas generales
    const totalQuery = comunidad_autonoma && comunidad_autonoma !== 'Todas' 
      ? 'SELECT COUNT(*) as total FROM sugerencias WHERE comunidad_autonoma = ?'
      : 'SELECT COUNT(*) as total FROM sugerencias';

    // Estadísticas por categoría
    const categoriaQuery = comunidad_autonoma && comunidad_autonoma !== 'Todas'
      ? 'SELECT categoria, COUNT(*) as count FROM sugerencias WHERE comunidad_autonoma = ? GROUP BY categoria'
      : 'SELECT categoria, COUNT(*) as count FROM sugerencias GROUP BY categoria';

    // Estadísticas por prioridad
    const prioridadQuery = comunidad_autonoma && comunidad_autonoma !== 'Todas'
      ? 'SELECT prioridad, COUNT(*) as count FROM sugerencias WHERE comunidad_autonoma = ? GROUP BY prioridad'
      : 'SELECT prioridad, COUNT(*) as count FROM sugerencias GROUP BY prioridad';

    // Estadísticas por estado
    const estadoQuery = comunidad_autonoma && comunidad_autonoma !== 'Todas'
      ? 'SELECT estado, COUNT(*) as count FROM sugerencias WHERE comunidad_autonoma = ? GROUP BY estado'
      : 'SELECT estado, COUNT(*) as count FROM sugerencias GROUP BY estado';

    // Sugerencias recientes
    const recientesQuery = comunidad_autonoma && comunidad_autonoma !== 'Todas'
      ? 'SELECT * FROM sugerencias WHERE comunidad_autonoma = ? ORDER BY fecha DESC LIMIT 5'
      : 'SELECT * FROM sugerencias ORDER BY fecha DESC LIMIT 5';

    const params = comunidad_autonoma && comunidad_autonoma !== 'Todas' ? [comunidad_autonoma] : [];

    // Ejecutar todas las consultas en paralelo
    Promise.all([
      new Promise((resolve, reject) => {
        pool.query(totalQuery, params, (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results[0].total);
        });
      }),
      new Promise((resolve, reject) => {
        pool.query(categoriaQuery, params, (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        pool.query(prioridadQuery, params, (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        pool.query(estadoQuery, params, (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        pool.query(recientesQuery, params, (error: any, results: any) => {
          if (error) reject(error);
          else resolve(results);
        });
      })
    ]).then(([total, porCategoria, porPrioridad, porEstado, recientes]) => {
      res.json({
        total,
        porCategoria,
        porPrioridad,
        porEstado,
        recientes,
        ultimaActualizacion: new Date().toISOString()
      });
    }).catch((error) => {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    });

  } catch (error) {
    console.error('Error en getEstadisticasSugerencias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      res.status(400).json({ error: 'El estado es requerido' });
      return;
    }

    const query = 'UPDATE sugerencias SET estado = ? WHERE id = ?';
    
    pool.query(query, [estado, id], (error: any, results: any) => {
      if (error) {
        console.error('Error al actualizar sugerencia:', error);
        res.status(500).json({ error: 'Error al actualizar sugerencia' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Sugerencia no encontrada' });
        return;
      }

      res.json({
        success: true,
        message: 'Sugerencia actualizada correctamente'
      });
    });

  } catch (error) {
    console.error('Error en updateSugerencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
