import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawEmail = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const requestedRole = req.body.role || null;
    const email = rawEmail;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Buscar usuario por email
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, nombre, verificado, rol FROM usuarios WHERE LOWER(email) = ?',
        [email]
      );

      const user: any = (users as any[])[0];

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar contraseña (si la comparación falla, tratar como credenciales inválidas)
      let isPasswordValid = false;
      try {
        isPasswordValid = await bcrypt.compare(password, user.password_hash);
      } catch (compareError) {
        logger.error({
          message: 'bcrypt.compare falló en login',
          userId: user.id,
          error: (compareError as Error).message,
          stack: (compareError as Error).stack,
        });
      }

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      if (requestedRole && user.rol !== requestedRole) {
        res.status(401).json({
          success: false,
          error: 'No tienes permisos para este acceso'
        });
        return;
      }

      // Generar tokens con sintaxis simple
      const payload = { 
        id: user.id, 
        email: user.email, 
        nombre: user.nombre,
        rol: user.rol || 'usuario'
      };
      
      const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, { expiresIn: '7d' });

      res.status(200).json({
        success: true,
        message: 'Login correcto',
        data: {
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            verificado: Boolean(user.verificado),
            rol: user.rol || 'usuario'
          },
          token: accessToken,
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    const err = error as Error;
    console.error('Error en login:', err);
    logger.error({
      message: 'Error en login',
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email: rawEmail, password, nombre } = req.body;
    const email = (rawEmail || '').trim().toLowerCase();

    if (!email || !password || !nombre) {
      res.status(400).json({
        success: false,
        error: 'Email, contraseña y nombre son requeridos'
      });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 4 caracteres'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Verificar si el email ya existe
      const [existingUsers] = await connection.execute(
        'SELECT id FROM usuarios WHERE LOWER(email) = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        res.status(409).json({
          success: false,
          error: 'El email ya está registrado'
        });
        return;
      }

      // Hashear contraseña
      const saltRounds = config.security.bcryptRounds;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const userId = require('crypto').randomUUID();
      const now = new Date();

      await connection.execute(
        `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, passwordHash, nombre, 1, 'usuario', now, now]
      );

      // Generar tokens
      const payload = { 
        id: userId, 
        email, 
        nombre,
        rol: 'usuario'
      };
      
      const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente',
        data: {
          user: {
            id: userId,
            email,
            nombre,
            verificado: true,
            rol: 'usuario'
          },
          token: accessToken,
          tokens: {
            accessToken,
            refreshToken
          }
        }
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error en registro:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email es requerido'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Verificar si el email existe
      const [users] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [email]
      );

      if ((users as any[]).length === 0) {
        res.status(200).json({
          success: true,
          message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error en forgot password:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const resetPassword = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.status(501).json({
      success: false,
      error: 'Función no implementada temporalmente'
    });

  } catch (error) {
    console.error('Error en reset password:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token es requerido'
      });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;

      const connection = await pool.getConnection();
      try {
        const [users] = await connection.execute(
          'SELECT id, email, nombre, rol FROM usuarios WHERE id = ?',
          [decoded.id]
        );
        const user = (users as any[])[0];
        if (!user) {
          res.status(401).json({ success: false, error: 'Usuario no encontrado' });
          return;
        }

        const payload = {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol || 'usuario'
        };

        const newAccessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });

        res.status(200).json({
          success: true,
          data: {
            accessToken: newAccessToken
          }
        });
      } finally {
        connection.release();
      }

    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: 'Refresh token inválido'
      });
    }

  } catch (error) {
    console.error('Error en refresh token:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'No autenticado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Error en me:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      return;
    }

    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      res.status(400).json({ success: false, error: 'El nombre es requerido' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE usuarios SET nombre = ?, actualizado_at = ? WHERE id = ?',
        [nombre.trim(), new Date(), userId]
      );
      res.status(200).json({
        success: true,
        data: { id: userId, nombre: nombre.trim() }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error actualizando perfil:', (error as Error).message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
