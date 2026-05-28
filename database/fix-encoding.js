// Script para corregir la codificación UTF-8 de la base de datos
const fs = require('fs');
const path = require('path');

// Rutas de archivos
const sourceFile = path.join(__dirname, 'anuncios-completos.json');
const targetAnunciosFile = path.join(__dirname, '../backend/src/data/anuncios.json');
const targetUsuariosFile = path.join(__dirname, '../backend/src/data/usuarios.json');

console.log('🔧 Corrigiendo codificación UTF-8...');

try {
  // Leer el archivo fuente
  const data = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  
  // Escribir archivos con codificación UTF-8 explícita
  fs.writeFileSync(targetAnunciosFile, JSON.stringify(data.anuncios, null, 2), { encoding: 'utf8' });
  fs.writeFileSync(targetUsuariosFile, JSON.stringify(data.usuarios, null, 2), { encoding: 'utf8' });
  
  console.log('✅ Archivos actualizados con codificación UTF-8 correcta');
  console.log(`📊 Anuncios: ${data.anuncios.length} registros`);
  console.log(`👥 Usuarios: ${data.usuarios.length} registros`);
  
  // Verificar algunos ejemplos
  console.log('\n🔍 Verificando ejemplos:');
  const ejemploAnuncio = data.anuncios[0];
  console.log(`Título: ${ejemploAnuncio.titulo}`);
  console.log(`Descripción: ${ejemploAnuncio.descripcion.substring(0, 100)}...`);
  console.log(`Comunidad: ${ejemploAnuncio.comunidad_autonoma}`);
  console.log(`Provincia: ${ejemploAnuncio.provincia}`);
  
} catch (error) {
  console.error('❌ Error:', error);
}
