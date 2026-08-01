import { pool } from '../src/config/database';

async function main() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS mensajes_staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      remitente_id VARCHAR(36) NOT NULL,
      destinatario_id VARCHAR(36) NOT NULL,
      asunto VARCHAR(255) NOT NULL,
      cuerpo TEXT NOT NULL,
      leido TINYINT NOT NULL DEFAULT 0,
      creado_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      leido_at TIMESTAMP NULL,
      INDEX idx_destinatario (destinatario_id),
      INDEX idx_remitente (remitente_id),
      INDEX idx_creado (creado_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('Tabla mensajes_staff creada o ya existente.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creando mensajes_staff:', err);
  process.exit(1);
});
