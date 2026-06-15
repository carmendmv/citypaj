const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Sin contraseña según la configuración
  database: 'citypaj_db'
};

async function setupGeografia() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'geografia_espana.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📄 Leyendo archivo SQL...');
    
    // Separar las sentencias SQL por el delimitador
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Ejecutando ${statements.length} sentencias SQL...`);
    
    // Ejecutar cada sentencia
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log(`✅ Sentencia ${i + 1}/${statements.length} ejecutada correctamente`);
        } catch (error) {
          // Ignorar errores de "IF NOT EXISTS" o tablas que ya existen
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
              error.code === 'ER_DUP_ENTRY' ||
              error.code === 'ER_DUP_KEYNAME') {
            console.log(`⚠️  Sentencia ${i + 1}/${statements.length} omitida (ya existe): ${error.message}`);
          } else {
            console.error(`❌ Error en sentencia ${i + 1}: ${error.message}`);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
          }
        }
      }
    }
    
    // Verificar los datos insertados
    console.log('\n📊 Verificando datos insertados...');
    
    const [comunidadesResult] = await connection.execute('SELECT COUNT(*) as total FROM comunidades_autonomas');
    const [provinciasResult] = await connection.execute('SELECT COUNT(*) as total FROM provincias');
    
    console.log(`✅ Comunidades Autónomas insertadas: ${comunidadesResult[0].total}`);
    console.log(`✅ Provincias insertadas: ${provinciasResult[0].total}`);
    
    // Mostrar resumen por comunidad
    console.log('\n📋 Resumen por Comunidad Autónoma:');
    const [resumenResult] = await connection.execute(`
      SELECT 
        c.nombre as comunidad_autonoma,
        COUNT(p.id) as numero_provincias,
        GROUP_CONCAT(p.nombre ORDER BY p.nombre SEPARATOR ', ') as provincias
      FROM comunidades_autonomas c
      LEFT JOIN provincias p ON c.id = p.comunidad_autonoma_id
      GROUP BY c.id, c.nombre
      ORDER BY c.nombre
    `);
    
    resumenResult.forEach(row => {
      console.log(`📍 ${row.comunidad_autonoma}: ${row.numero_provincias} provincias`);
      if (row.provincias) {
        const provincias = row.provincias.split(', ');
        provincias.forEach(prov => {
          console.log(`   • ${prov}`);
        });
      }
    });
    
    console.log('\n🎉 ¡Configuración geográfica completada con éxito!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
setupGeografia();
