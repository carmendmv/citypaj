const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  database: 'citypaj',
  user: 'root',
  password: 'noalumno'
};

async function importarAnuncios() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos MySQL...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conexión establecida');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '500-anuncios-mysql.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 Leyendo archivo SQL...');
    
    // Dividir el contenido en sentencias individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Procesando ${statements.length} sentencias SQL...`);
    
    let usuariosInsertados = 0;
    let anunciosInsertados = 0;
    
    // Ejecutar cada sentencia
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await connection.execute(statement);
        
        if (statement.includes('INSERT INTO usuarios')) {
          usuariosInsertados++;
          if (usuariosInsertados % 50 === 0) {
            console.log(`👥 Usuarios insertados: ${usuariosInsertados}`);
          }
        } else if (statement.includes('INSERT INTO anuncios')) {
          anunciosInsertados++;
          if (anunciosInsertados % 50 === 0) {
            console.log(`📝 Anuncios insertados: ${anunciosInsertados}`);
          }
        }
      } catch (error) {
        // Ignorar errores de duplicados (clave primaria)
        if (error.code === 'ER_DUP_ENTRY') {
          continue;
        }
        console.error(`❌ Error en sentencia ${i + 1}:`, error.message);
        console.error(`📄 Sentencia:`, statement.substring(0, 100) + '...');
      }
    }
    
    console.log('\n🎉 ¡Importación completada!');
    console.log(`👥 Total usuarios insertados: ${usuariosInsertados}`);
    console.log(`📝 Total anuncios insertados: ${anunciosInsertados}`);
    
    // Verificar los datos importados
    console.log('\n🔍 Verificando datos importados...');
    
    const [totalAnuncios] = await connection.execute('SELECT COUNT(*) as total FROM anuncios');
    const [totalUsuarios] = await connection.execute('SELECT COUNT(*) as total FROM usuarios');
    
    console.log(`📊 Total anuncios en BBDD: ${totalAnuncios[0].total}`);
    console.log(`👥 Total usuarios en BBDD: ${totalUsuarios[0].total}`);
    
    // Mostrar distribución por categorías
    const [distribucion] = await connection.execute(`
      SELECT categoria, COUNT(*) as count 
      FROM anuncios 
      GROUP BY categoria 
      ORDER BY count DESC
    `);
    
    console.log('\n📈 Distribución por categorías:');
    distribucion.forEach(row => {
      console.log(`   ${row.categoria}: ${row.count} anuncios`);
    });
    
    // Mostrar distribución por comunidades
    const [comunidades] = await connection.execute(`
      SELECT comunidad_autonoma, COUNT(*) as count 
      FROM anuncios 
      GROUP BY comunidad_autonoma 
      ORDER BY count DESC
      LIMIT 10
    `);
    
    console.log('\n🗺️ Top 10 comunidades con más anuncios:');
    comunidades.forEach(row => {
      console.log(`   ${row.comunidad_autonoma}: ${row.count} anuncios`);
    });
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la importación
importarAnuncios().catch(console.error);
