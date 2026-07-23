const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || 'citypaj';
const DB_USER = process.env.DB_USER || 'citypaj_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'citypaj123';

const DEMO_USERS = [
  {
    nombre: 'Usuario Demo',
    email: 'usuario@citypaj.demo',
    password: 'demo123',
    rol: 'usuario',
  },
  {
    nombre: 'Moderador Demo',
    email: 'moderador@citypaj.demo',
    password: 'demo123',
    rol: 'moderador',
  },
  {
    nombre: 'Administrador Demo',
    email: 'admin@citypaj.demo',
    password: 'demo123',
    rol: 'admin',
  },
];

async function main() {
  console.log(`🔌 Conectando a la base de datos ${DB_NAME}...`);
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    // Asegurar columna rol
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'rol'`,
      [DB_NAME]
    );

    if ((columns).length === 0) {
      console.log('➕ Añadiendo columna rol a usuarios...');
      await connection.execute(
        `ALTER TABLE usuarios ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'usuario'`
      );
      console.log('✅ Columna rol añadida');
    } else {
      console.log('✅ Columna rol ya existe');
    }

    // Normalizar usuarios existentes sin rol
    await connection.execute(
      `UPDATE usuarios SET rol = 'usuario' WHERE rol IS NULL OR rol = ''`
    );

    // Insertar o actualizar usuarios demo
    for (const demo of DEMO_USERS) {
      const hashedPassword = await bcrypt.hash(demo.password, 10);
      const emailLower = demo.email.toLowerCase();

      const [existing] = await connection.execute(
        `SELECT id FROM usuarios WHERE LOWER(email) = ?`,
        [emailLower]
      );

      if ((existing).length > 0) {
        await connection.execute(
          `UPDATE usuarios SET password_hash = ?, nombre = ?, rol = ?, verificado = 1, actualizado_at = NOW() WHERE LOWER(email) = ?`,
          [hashedPassword, demo.nombre, demo.rol, emailLower]
        );
        console.log(`🔄 Actualizado usuario demo: ${demo.email} (${demo.rol})`);
      } else {
        const id = randomUUID();
        await connection.execute(
          `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [id, emailLower, hashedPassword, demo.nombre, 1, demo.rol]
        );
        console.log(`✅ Creado usuario demo: ${demo.email} (${demo.rol})`);
      }
    }

    // Verificar
    const [rows] = await connection.execute(
      `SELECT email, nombre, rol, verificado FROM usuarios WHERE LOWER(email) IN (?, ?, ?)`,
      DEMO_USERS.map(u => u.email.toLowerCase())
    );
    console.log('\n👥 Usuarios demo en base de datos:');
    console.table(rows);

    console.log('\n🎉 Seed de usuarios demo completado');
  } catch (error) {
    console.error('❌ Error en seed demo:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
