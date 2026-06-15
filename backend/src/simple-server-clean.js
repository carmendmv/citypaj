const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Conexión directa a la base de datos citypaj
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    database: 'citypaj',
    user: 'citypaj_user',
    password: 'citypaj123'
  },
  pool: {
    min: 2,
    max: 10
  }
});

console.log('🔍 Configuración de base de datos:');
console.log('  - Host: localhost');
console.log('  - Database: citypaj');
console.log('  - User: citypaj_user');
console.log('  - Password: citypaj123');

// Endpoint principal de anuncios
app.get('/api/anuncios', async (req, res) => {
  try {
    console.log('📊 Obteniendo anuncios de la base de datos...');
    
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;

    // Obtener anuncios
    const anuncios = await db('anuncios')
      .select([
        'anuncios.*',
        'usuarios.nombre as usuario_nombre',
        'usuarios.email as email'
      ])
      .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
      .where('anuncios.visible', 1)
      .where('anuncios.estado_moderacion', 'approved')
      .orderBy('anuncios.id', 'desc')
      .limit(limite)
      .offset(offset);

    // Obtener total
    const [totalResult] = await db('anuncios')
      .count('* as total')
      .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
      .where('anuncios.visible', 1)
      .where('anuncios.estado_moderacion', 'approved');

    const total = totalResult.total;

    console.log(`✅ Obtenidos ${anuncios.length} anuncios de ${total} totales`);

    res.json({
      success: true,
      data: anuncios,
      meta: {
        pagina,
        limite,
        total,
        total_paginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncios de la base de datos',
      details: error.message
    });
  }
});

// Endpoint de detalle de anuncio
app.get('/api/anuncios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const anuncio = await db('anuncios')
      .select([
        'anuncios.*',
        'usuarios.nombre as usuario_nombre',
        'usuarios.email as email'
      ])
      .leftJoin('usuarios', 'anuncios.usuario_id', 'usuarios.id')
      .where('anuncios.id', id)
      .where('anuncios.visible', 1)
      .where('anuncios.estado_moderacion', 'approved')
      .first();
    
    if (!anuncio) {
      return res.status(404).json({
        success: false,
        error: 'Anuncio no encontrado'
      });
    }

    res.json({
      success: true,
      data: anuncio
    });

  } catch (error) {
    console.error('❌ Error obteniendo anuncio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener anuncio',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor limpio corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📝 Anuncios endpoints: http://0.0.0.0:${PORT}/api/anuncios`);
});
