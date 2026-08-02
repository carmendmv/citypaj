import { pool } from '../src/config/database';

const migrationQueries = [
  `CREATE TABLE IF NOT EXISTS agenda_notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    cuerpo TEXT NULL,
    fecha DATE NOT NULL,
    color VARCHAR(20) NULL DEFAULT 'orange',
    usuario_id VARCHAR(36) NOT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha),
    INDEX idx_usuario (usuario_id)
  )`,
];

async function main() {
  for (const query of migrationQueries) {
    await pool.execute(query);
  }
  console.log('Migración v4 aplicada: agenda_notas');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
