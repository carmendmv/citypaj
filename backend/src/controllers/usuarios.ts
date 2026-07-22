import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nombre, email, verificado, creado_at FROM usuarios ORDER BY creado_at DESC LIMIT 100'
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, nombre, email, verificado, creado_at FROM usuarios WHERE id = ?',
      [id]
    );
    const usuarios = rows as any[];
    if (usuarios.length === 0) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: usuarios[0] });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getPerfilUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [anuncios] = await pool.execute(
      `SELECT id, titulo, descripcion, categoria, provincia, creado_at FROM anuncios
       WHERE usuario_id = ? AND visible = 1 ORDER BY creado_at DESC`,
      [id]
    );
    const [favoritos] = await pool.execute(
      `SELECT a.id, a.titulo, a.descripcion, a.categoria, a.provincia, a.creado_at
       FROM favoritos f JOIN anuncios a ON f.anuncio_id = a.id
       WHERE f.usuario_id = ? AND a.visible = 1 ORDER BY f.creado_at DESC`,
      [id]
    );
    const [sugerencias] = await pool.execute(
      `SELECT id, titulo, descripcion, categoria, estado, fecha FROM sugerencias WHERE email IN (
        SELECT email FROM usuarios WHERE id = ?
      ) ORDER BY fecha DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: { anuncios, favoritos, sugerencias }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
