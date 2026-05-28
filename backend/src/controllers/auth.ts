import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Mock database - en producción esto sería una base de datos real
interface User {
  id: string;
  email: string;
  password: string;
  nombre: string;
  creado: string;
  actualizado: string;
  verificado: boolean;
}

const mockUsers: User[] = [];

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

    // Verificar si el usuario ya existe
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'El email ya está registrado',
      });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser: User = {
      id: randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      nombre: nombre.trim(),
      creado: new Date().toISOString(),
      actualizado: new Date().toISOString(),
      verificado: false, // En producción, se enviaría email de verificación
    };

    // Guardar usuario (en mock database)
    mockUsers.push(newUser);

    // Generar tokens JWT
    const accessToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      config.jwt.secret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        usuario: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          verificado: newUser.verificado,
          creado: newUser.creado,
        },
      },
    });

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

    // Buscar usuario por email
    const user = mockUsers.find(u => u.email === email.toLowerCase());
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
      return;
    }

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
        email: user.email 
      },
      config.jwt.secret,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      config.jwt.refreshSecret,
      { expiresIn: '7d' }
    );

    // Actualizar último acceso
    user.actualizado = new Date().toISOString();

    // Responder con éxito
    res.json({
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
          creado: user.creado,
        },
      },
    });

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
    // En una implementación real, invalidaríamos el token
    // Por ahora, simplemente respondemos con éxito
    res.json({
      success: true,
      message: 'Sesión cerrada correctamente',
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
    const decoded = jwt.verify(refresh_token, config.jwt.refreshSecret) as any;
    
    // Buscar usuario
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
      return;
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      config.jwt.secret,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      data: {
        access_token: newAccessToken,
      },
    });

  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // El middleware de auth debería haber añadido el usuario al request
    const userId = (req as any).userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        verificado: user.verificado,
        creado: user.creado,
        actualizado: user.actualizado,
      },
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
};
