import { pool } from '../src/config/database';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const DEMO_ADMIN_EMAIL = 'admin@citypaj.demo';
const DEMO_ADMIN_PASSWORD = 'demo123';

async function main() {
  const [rows] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [DEMO_ADMIN_EMAIL]);
  if ((rows as any[]).length > 0) {
    console.log('El admin demo ya existe.');
    process.exit(0);
  }

  const hash = await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10);
  await pool.execute(
    `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, rol, creado_at, actualizado_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [randomUUID(), DEMO_ADMIN_EMAIL, hash, 'Administrador Demo', 1, 'admin', new Date(), new Date()]
  );
  console.log('Usuario admin demo creado:', DEMO_ADMIN_EMAIL);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creando admin demo:', err);
  process.exit(1);
});
