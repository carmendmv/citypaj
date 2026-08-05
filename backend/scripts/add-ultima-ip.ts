import { pool } from '../src/config/database';

async function main() {
  await pool.execute('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultima_ip VARCHAR(64) NULL');
  console.log('Columna ultima_ip añadida o ya existente en usuarios.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error añadiendo ultima_ip:', err);
  process.exit(1);
});
