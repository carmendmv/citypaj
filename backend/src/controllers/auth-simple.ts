import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { config } from '../config';

const DEMO_EMAIL = 'demo@citypaj.com';
const DEMO_PASSWORD = 'Demo1234!';
const DEMO_NAME = 'Usuario Demo';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawEmail = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
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
        'SELECT id, email, password_hash, nombre, verificado, rol FROM usuarios WHERE email = ?',
        [email]
      );

      let user: any = (users as any[])[0];

      // Crear usuario demo automáticamente si no existe y se usan las credenciales demo
      if (!user && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const userId = require('crypto').randomUUID();
        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
        await connection.execute(
          `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol) VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, DEMO_EMAIL, hashedPassword, DEMO_NAME, 1, 'admin']
        );
        user = {
          id: userId,
          email: DEMO_EMAIL,
          password_hash: hashedPassword,
          nombre: DEMO_NAME,
          verificado: 1,
          rol: 'admin'
        };
      }

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar contraseña
      const isDemoLogin = email === DEMO_EMAIL && password === DEMO_PASSWORD;
      let isPasswordValid = isDemoLogin || await bcrypt.compare(password, user.password_hash);

      if (isDemoLogin && user) {
        // Mantener el hash demo actualizado por si el usuario fue creado con otro mecanismo
        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
        await connection.execute(
          'UPDATE usuarios SET password_hash = ? WHERE email = ?',
          [hashedPassword, DEMO_EMAIL]
        );
        user.password_hash = hashedPassword;
      }

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
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
        data: {
          user: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            verificado: Boolean(user.verificado),
            rol: user.rol || 'usuario'
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
      const payload = { 
        id: userId, 
        email, 
        nombre 
      };
      
      const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, { expiresIn: '7d' });

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
      
      const payload = { 
        id: decoded.id, 
        email: decoded.email, 
        nombre: decoded.nombre 
      };
      
      const newAccessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });

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
