// Inspección completa de la estructura de la base de datos citypaj
const mysql = require('mysql2/promise');

async function inspectDatabaseStructure() {
  console.log('🔍 INSPECCIÓN ESTRUCTURA BASE DE DATOS CITYPAJ');
  console.log('=' .repeat(50));
  
  let connection;
  
  try {
    // Conexión usando configuración del backend
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      database: 'citypaj',
      user: 'citypaj_user',
      password: 'citypaj123'
    });
    
    console.log('✅ Conexión establecida a citypaj');
    
    // 1. Verificar base de datos actual
    const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`📊 Base de datos actual: ${dbResult[0].current_db}`);
    
    // 2. Listar todas las tablas
    console.log('\n📋 TABLAS ENCONTRADAS:');
    const [tables] = await connection.execute('SHOW TABLES');
    
    const tableNames = tables.map(row => Object.values(row)[0]);
    tableNames.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });
    
    console.log(`\n📊 Total tablas: ${tableNames.length}`);
    
    // 3. Inspeccionar estructura de tablas principales
    const mainTables = ['anuncios', 'usuarios', 'categorias', 'comunidades', 'provincias'];
    
    for (const tableName of mainTables) {
      if (tableNames.includes(tableName)) {
        console.log(`\n📋 ESTRUCTURA TABLA: ${tableName}`);
        
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`   📊 Columnas: ${columns.length}`);
        
        columns.forEach(col => {
          console.log(`      - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''} ${col.Key ? `(${col.Key})` : ''}`);
        });
        
        // Contar registros
        const [count] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
        console.log(`   📊 Registros: ${count[0].total}`);
        
        // Mostrar un ejemplo si hay datos
        if (count[0].total > 0) {
          const [sample] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 1`);
          console.log('   📝 EJEMPLO DE DATOS:');
          Object.keys(sample[0]).forEach(key => {
            const value = sample[0][key];
            const displayValue = typeof value === 'string' && value.length > 50 
              ? value.substring(0, 50) + '...' 
              : value;
            console.log(`      ${key}: ${displayValue}`);
          });
        }
      } else {
        console.log(`\n❌ TABLA NO ENCONTRADA: ${tableName}`);
      }
    }
    
    // 4. Verificar relaciones y claves foráneas
    console.log('\n📋 RELACIONES Y CLaves FORÁNEAS:');
    
    if (tableNames.includes('anuncios')) {
      const [constraints] = await connection.execute(`
        SELECT 
          COLUMN_NAME,
          CONSTRAINT_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'citypaj' 
        AND TABLE_NAME = 'anuncios'
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      
      if (constraints.length > 0) {
        constraints.forEach(constraint => {
          console.log(`   - ${constraint.COLUMN_NAME} → ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
        });
      } else {
        console.log('   ❌ No se encontraron claves foráneas explícitas en anuncios');
      }
    }
    
    // 5. Verificar índices importantes
    console.log('\n📋 ÍNDICES IMPORTANTES:');
    
    if (tableNames.includes('anuncios')) {
      const [indexes] = await connection.execute('SHOW INDEX FROM anuncios');
      const uniqueIndexes = [...new Set(indexes.map(idx => idx.Key_name))];
      
      uniqueIndexes.forEach(indexName => {
        const indexColumns = indexes.filter(idx => idx.Key_name === indexName);
        const columns = indexColumns.map(idx => idx.Column_name).join(', ');
        const unique = indexColumns[0].Non_unique === 0 ? 'UNIQUE' : 'NON-UNIQUE';
        console.log(`   - ${indexName}: ${columns} (${unique})`);
      });
    }
    
    await connection.end();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ INSPECCIÓN COMPLETADA');
    
  } catch (error) {
    console.error('❌ Error en inspección:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

inspectDatabaseStructure();
