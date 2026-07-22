import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { config } from '../config';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

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
        'SELECT id, email, password_hash, nombre, verificado FROM usuarios WHERE email = ?',
        [email]
      );

      if ((users as any[]).length === 0) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      const user = (users as any)[0];

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      // Generar tokens
      const accessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          nombre: user.nombre 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            verificado: Boolean(user.verificado)
          },
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
    console.error('Error en login:', (error as Error).message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre } = req.body;

    if (!email || !password || !nombre) {
      res.status(400).json({
        success: false,
        error: 'Email, contraseña y nombre son requeridos'
      });
      return;
    }

    const connection = await pool.getConnection();
    
    try {
      // Verificar si el email ya existe
      const [existingUsers] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?',
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
        `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, creado_at, actualizado_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, passwordHash, nombre, 0, now, now]
      );

      // Generar tokens
      const accessToken = jwt.sign(
        { 
          id: userId, 
          email, 
          nombre 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      const refreshToken = jwt.sign(
        { id: userId },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: userId,
            email,
            nombre,
            verificado: false
          },
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

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // En una implementación real, aquí invalidaríamos el refresh token
    // Por ahora, simplemente respondemos con éxito
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
        // Por seguridad, no revelamos si el email existe o no
        res.status(200).json({
          success: true,
          message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
        });
        return;
      }

      // En una implementación real, aquí enviaríamos un email con un token de reset
      // Por ahora, simulamos el envío
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

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'Token y nueva contraseña son requeridos'
      });
      return;
    }

    // En una implementación real, verificaríamos el token y actualizaríamos la contraseña
    // Por ahora, respondemos con no implementado
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
      
      // Generar nuevo access token
      const newAccessToken = jwt.sign(
        { 
          id: decoded.id, 
          email: decoded.email, 
          nombre: decoded.nombre 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });

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
