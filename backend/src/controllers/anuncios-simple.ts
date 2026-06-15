import { Request, Response } from 'express';
import { executeQuery } from '../config/database';

// Versión simplificada para probar conexión con MySQL
export const getAnunciosSimple = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Datos de prueba para verificar conexión
    const mockData = [
      {
        id: '1',
        titulo: 'Clases particulares de matemáticas',
        descripcion: 'Soy estudiante de Ingeniería Matemática y ofrezco clases particulares',
        categoria: 'educacion',
        comunidad_autonoma: 'aragon',
        provincia: 'zaragoza',
        precio: 15.00,
        creado: new Date().toISOString(),
        autor: 'Ana García'
      },
      {
        id: '2',
        titulo: 'Habitación doble en piso compartido',
        descripcion: 'Se alquila habitación doble en piso compartido en Barcelona',
        categoria: 'vivienda',
        comunidad_autonoma: 'cataluna',
        provincia: 'barcelona',
        precio: 350.00,
        creado: new Date().toISOString(),
        autor: 'Carlos Ruiz'
      }
    ];

    res.status(200).json({
      success: true,
      data: mockData,
      meta: {
        page: 1,
        limit: 12,
        total: mockData.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
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

export const testDatabaseConnection = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Intentar conectar a la base de datos
    const result = await executeQuery('SELECT 1 as test');
    
    res.status(200).json({
      success: true,
      message: 'Conexión a base de datos exitosa',
      data: result
    });

  } catch (error) {
    console.error('Error de conexión a base de datos:', error);
    res.status(500).json({
      success: false,
      error: 'Error conectando a la base de datos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Endpoint temporal con conexión directa para diagnóstico
export const testDirectConnection = async (_req: Request, res: Response): Promise<void> => {
  try {
    const mysql = require('mysql2/promise');
    
    // Conexión directa sin pool
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'citypaj_db'
    });
    
    console.log('🔗 Conexión directa establecida');
    
    const [rows] = await connection.execute('SELECT 1 as test, USER() as user, DATABASE() as db');
    await connection.end();
    
    res.status(200).json({
      success: true,
      message: 'Conexión directa exitosa',
      data: rows
    });

  } catch (error) {
    console.error('Error en conexión directa:', error);
    res.status(500).json({
      success: false,
      error: 'Error en conexión directa',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
