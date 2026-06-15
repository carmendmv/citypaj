console.log('🔍 Depurando configuración de knexfile...');

// Limpiar caché del módulo
delete require.cache[require.resolve('../knexfile')];

// Cargar configuración fresca
const knexConfig = require('../knexfile');

console.log('📋 Configuración cargada:');
console.log(JSON.stringify(knexConfig.development.connection, null, 2));

// Probar conexión directamente con knex
const knex = require('knex');

try {
  const db = knex(knexConfig.development);
  
  db.raw('SELECT 1 as test')
    .then(() => {
      console.log('✅ Conexión exitosa con knex');
      db.destroy();
    })
    .catch(error => {
      console.log('❌ Error en conexión con knex:', error.message);
      db.destroy();
    });
} catch (error) {
  console.log('❌ Error creando conexión knex:', error.message);
}
