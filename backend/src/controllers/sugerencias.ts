import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { getClientIp } from '../utils/ip';
import { logAdminActivity } from '../utils/audit';

export interface Sugerencia {
  id?: number;
  nombre?: string | null;
  email?: string | null;
  edad?: string | null;
  categoria: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  solicitud_ayuntamiento?: string | null;
  anonimo: boolean;
  comunidad_autonoma?: string;
  fecha?: string;
  estado: 'pendiente' | 'revisada' | 'en_progreso' | 'resuelta' | 'rechazada';
}

export const createSugerencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      email,
      edad,
      titulo,
      descripcion,
      categoria = 'otros',
      prioridad = 'media',
      anonimo = false,
      comunidad_autonoma,
      solicitud_ayuntamiento
    } = req.body;

    if (!titulo || !descripcion || !comunidad_autonoma) {
      res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: título, descripción y comunidad autónoma'
      });
      return;
    }

    const ip_creador = getClientIp(req);

    const [result] = await pool.execute(
      `INSERT INTO sugerencias (
        nombre, email, edad, titulo, descripcion, categoria, prioridad,
        anonimo, comunidad_autonoma, fecha, solicitud_ayuntamiento, ip_creador, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, 'pendiente')`,
      [
        anonimo ? null : (nombre?.trim() || null),
        anonimo ? null : (email?.trim() || null),
        edad || null,
        titulo.trim(),
        descripcion.trim(),
        categoria,
        prioridad,
        anonimo ? 1 : 0,
        comunidad_autonoma,
        solicitud_ayuntamiento || null,
        ip_creador
      ]
    ) as any;

    res.status(201).json({
      success: true,
      message: 'Sugerencia guardada correctamente',
      data: {
        id: result.insertId,
        titulo: titulo.trim(),
        categoria,
        estado: 'pendiente'
      }
    });
  } catch (error) {
    console.error('Error creando sugerencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getSugerencias = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      estado,
      categoria,
      prioridad,
      comunidad_autonoma
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitNum = parseInt(limit as string);

    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (estado) {
      whereConditions.push('estado = ?');
      queryParams.push(estado);
    }

    if (categoria) {
      whereConditions.push('categoria = ?');
      queryParams.push(categoria);
    }

    if (prioridad) {
      whereConditions.push('prioridad = ?');
      queryParams.push(prioridad);
    }

    if (comunidad_autonoma) {
      whereConditions.push('comunidad_autonoma = ?');
      queryParams.push(comunidad_autonoma);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT
        id, nombre, email, edad, titulo, descripcion, categoria, prioridad,
        anonimo, comunidad_autonoma, fecha, estado
      FROM sugerencias
      ${whereClause}
      ORDER BY fecha DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sugerencias
      ${whereClause}
    `;

    const queryParamsWithPagination = [...queryParams, limitNum, offset];

    const [rows] = await pool.execute(query, queryParamsWithPagination);
    const [countRows] = await pool.execute(countQuery, queryParams) as any;

    const total = countRows[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        page: parseInt(page as string),
        limit: limitNum,
        total,
        totalPages,
        hasNext: parseInt(page as string) < totalPages,
        hasPrev: parseInt(page as string) > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getSugerenciaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        id, nombre, email, edad, titulo, descripcion, categoria, prioridad,
        anonimo, comunidad_autonoma, fecha, estado
      FROM sugerencias
      WHERE id = ?`,
      [id]
    );

    const sugerencias = rows as any[];
    if (sugerencias.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Sugerencia no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: sugerencias[0]
    });
  } catch (error) {
    console.error('Error obteniendo sugerencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const updateSugerencia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['pendiente', 'revisada', 'en_progreso', 'resuelta', 'rechazada'].includes(estado)) {
      res.status(400).json({
        success: false,
        error: 'Estado inválido'
      });
      return;
    }

    await pool.execute(
      'UPDATE sugerencias SET estado = ?, fecha = fecha WHERE id = ?',
      [estado, id]
    );

    await logAdminActivity(req.user!.id, 'cambio_estado_sugerencia', 'sugerencias', id, `Estado: ${estado}`);

    res.status(200).json({
      success: true,
      message: 'Sugerencia actualizada correctamente',
      data: { estado }
    });
  } catch (error) {
    console.error('Error actualizando sugerencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const deleteSugerencia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM sugerencias WHERE id = ?', [id]) as any;

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Sugerencia no encontrada'
      });
      return;
    }

    await logAdminActivity(req.user!.id, 'eliminar_sugerencia', 'sugerencias', id, 'Sugerencia eliminada');

    res.status(200).json({
      success: true,
      message: 'Sugerencia eliminada correctamente'
    });
  } catch (error) {
    console.error('Error eliminando sugerencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const getEstadisticasSugerencias = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [estadoRows] = await pool.execute(
      `SELECT estado, COUNT(*) as count FROM sugerencias GROUP BY estado ORDER BY count DESC`
    );
    const [categoriaRows] = await pool.execute(
      `SELECT categoria, COUNT(*) as count FROM sugerencias GROUP BY categoria ORDER BY count DESC`
    );
    const [prioridadRows] = await pool.execute(
      `SELECT prioridad, COUNT(*) as count FROM sugerencias GROUP BY prioridad ORDER BY count DESC`
    );
    const [totalRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM sugerencias`
    ) as any;
    const [recientes] = await pool.execute(
      `SELECT id, titulo, categoria, prioridad, fecha, estado FROM sugerencias ORDER BY fecha DESC LIMIT 10`
    );

    res.status(200).json({
      success: true,
      data: {
        total: totalRows[0]?.total || 0,
        porEstado: estadoRows,
        porCategoria: categoriaRows,
        porPrioridad: prioridadRows,
        recientes
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de sugerencias:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
