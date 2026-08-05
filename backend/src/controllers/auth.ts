import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Pool } from 'pg';

// Conexión a base de datos PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  database: process.env.DB_NAME || 'citypaj',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'noalumno',
  ssl: false,
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, nombre } = req.body;

    // Validaciones básicas
    if (!email || !password || !nombre) {
      res.status(400).json({
        success: false,
        error: 'Email, password y nombre son obligatorios',
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Email no válido',
      });
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    // Validar longitud del nombre
    if (nombre.length < 2 || nombre.length > 100) {
      res.status(400).json({
        success: false,
        error: 'El nombre debe tener entre 2 y 100 caracteres',
      });
      return;
    }

    // Verificar si el usuario ya existe en la base de datos
    const client = await pool.connect();
    try {
      const existingUser = await client.query(
        'SELECT id FROM usuarios WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        res.status(400).json({
          success: false,
          error: 'El email ya está registrado',
        });
        return;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario en la base de datos
      const userId = randomUUID();
      const now = new Date().toISOString();

      await client.query(
        `INSERT INTO usuarios (id, email, password, nombre, creado, actualizado, verificado, rol) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, email.toLowerCase(), hashedPassword, nombre.trim(), now, now, false, 'usuario']
      );

      // Generar tokens
      const accessToken = jwt.sign(
        { userId, email: email.toLowerCase(), rol: 'usuario' },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId, email: email.toLowerCase() },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          usuario: {
            id: userId,
            email: email.toLowerCase(),
            nombre: nombre.trim(),
            verificado: false,
            rol: 'usuario'
          },
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y password son obligatorios',
      });
      return;
    }

    // Buscar usuario en la base de datos
    const client = await pool.connect();
    try {
      const userResult = await client.query(
        'SELECT id, email, password, nombre, verificado, rol FROM usuarios WHERE email = $1',
        [email.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
        });
        return;
      }

      const user = userResult.rows[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
        });
        return;
      }

      // Generar tokens JWT
      const accessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          rol: user.rol 
        },
        config.jwt.secret,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        config.jwt.secret,
        { expiresIn: '7d' }
      );

      // Actualizar último acceso
      await client.query(
        'UPDATE usuarios SET actualizado = $1 WHERE id = $2',
        [new Date().toISOString(), user.id]
      );

      // Responder con éxito
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          usuario: {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            verificado: user.verificado,
            rol: user.rol
          },
        },
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // En una implementación real, aquí se invalidaría el token
    // Por ahora, simplemente respondemos con éxito
    res.status(200).json({
      success: true,
      message: 'Logout exitoso',
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token es obligatorio',
      });
      return;
    }

    // Verificar refresh token
    const decoded = jwt.verify(refresh_token, config.jwt.secret) as any;
    
    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { 
        userId: decoded.userId, 
        email: decoded.email 
      },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      data: {
        access_token: newAccessToken,
      },
    });

  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(401).json({
      success: false,
      error: 'Refresh token inválido',
    });
  }
};

export const getProfile = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Aquí se obtendría el usuario desde el token JWT
    // Por ahora, respondemos con un perfil de ejemplo
    res.status(200).json({
      success: true,
      data: {
        usuario: {
          id: 'example-id',
          email: 'example@email.com',
          nombre: 'Usuario Ejemplo',
          verificado: true,
          rol: 'usuario'
        },
      },
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};
