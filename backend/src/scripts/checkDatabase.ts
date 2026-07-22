import { pool } from '../config/database';

const checkDatabase = async () => {
  try {
    console.log('🔍 Verificando datos en la base de datos...');
    
    const client = await pool.connect();
    
    try {
      // Verificar tabla anuncios
      const result = await client.query('SELECT id, titulo, descripcion FROM anuncios LIMIT 5');
      
      console.log('📊 Anuncios encontrados:');
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}, Título: ${row.titulo}, Descripción: ${row.descripcion?.substring(0, 50)}...`);
      });
      
      // Verificar si hay datos con ID no UUID
      const invalidIds = await client.query("SELECT id, titulo FROM anuncios WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'");
      
      if (invalidIds.rows.length > 0) {
        console.log('❌ Se encontraron IDs no válidos:');
        invalidIds.rows.forEach(row => {
          console.log(`ID inválido: ${row.id}, Título: ${row.titulo}`);
        });
      }
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await pool.end();
  }
};

// Ejecutar si este archivo se corre directamente
if (require.main === module) {
  checkDatabase();
}

export { checkDatabase };
