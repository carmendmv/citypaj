import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

const initDatabase = async () => {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../../migrations/000_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Conectar a la base de datos
    const client = await pool.connect();
    
    try {
      // Ejecutar la migración
      await client.query(migrationSQL);
      console.log('✅ Base de datos inicializada correctamente');
      console.log('✅ Tablas creadas y datos de ejemplo insertados');
    } catch (error) {
      console.error('❌ Error ejecutando migración:', error);
      throw error;
    } finally {
      client.release();
    }
    
    // Verificar que los datos se insertaron
    const result = await pool.query('SELECT COUNT(*) as count FROM anuncios');
    console.log(`📊 Anuncios insertados: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Ejecutar si este archivo se corre directamente
if (require.main === module) {
  initDatabase();
}

export { initDatabase };
