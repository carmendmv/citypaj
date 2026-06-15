import { Request, Response } from 'express';
const mysql = require('mysql2/promise');

export const testDiagnosticConnection = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 DIAGNÓSTICO: Conexión directa desde controlador');
    
    // Usar la misma configuración que funcionó en la prueba directa
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Contraseña vacía
      database: 'citypaj_db'
    });
    
    console.log('✅ DIAGNÓSTICO: Conexión directa exitosa');
    
    // Ejecutar la misma consulta que el controlador de anuncios
    const query = `
      SELECT 
        id, titulo, descripcion, categoria, 
        comunidad_id, provincia_id, barrio as localidad, 
        precio, visible, estado_moderacion,
        creado_at as fecha_creacion, actualizado_at as fecha_actualizacion, 
        usuario_id, contacto_email, contacto_telefono
      FROM anuncios 
      WHERE visible = 1 AND estado_moderacion = 'approved'
      ORDER BY creado_at DESC
      LIMIT 12 OFFSET 0
    `;
    
    const [anuncios] = await connection.execute(query);
    console.log(`✅ DIAGNÓSTICO: ${anuncios.length} anuncios encontrados`);
    
    await connection.end();
    
    res.status(200).json({
      success: true,
      message: 'DIAGNÓSTICO: Conexión directa funcionando',
      data: anuncios,
      meta: {
        count: anuncios.length,
        connection: 'direct',
        database: 'citypaj_db'
      }
    });
    
  } catch (error) {
    console.error('❌ DIAGNÓSTICO: Error en conexión directa:', error);
    res.status(500).json({
      success: false,
      error: 'DIAGNÓSTICO: Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
