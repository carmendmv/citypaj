import { pool } from '../src/config/database';

const statements = [
  `CREATE TABLE IF NOT EXISTS comunidad_reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id VARCHAR(36) NULL,
    autor_nombre VARCHAR(100) NULL,
    ip VARCHAR(64) NULL,
    tipo ENUM('publicacion','respuesta') NOT NULL,
    objeto_id INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('pendiente','revisado','descartado') NOT NULL DEFAULT 'pendiente',
    nota_moderacion TEXT,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado TIMESTAMP NULL,
    KEY idx_objeto (tipo, objeto_id),
    KEY idx_usuario (usuario_id),
    KEY idx_estado (estado)
  )`,

  `CREATE TABLE IF NOT EXISTS comunidad_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id VARCHAR(36) NULL,
    ip VARCHAR(64) NULL,
    tipo ENUM('publicacion','respuesta') NOT NULL,
    objeto_id INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_like (tipo, objeto_id, ip),
    KEY idx_objeto (tipo, objeto_id)
  )`,

  `ALTER TABLE comunidad_publicaciones
    MODIFY COLUMN usuario_id VARCHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS autor_nombre VARCHAR(100) NULL AFTER usuario_id,
    ADD COLUMN IF NOT EXISTS ip VARCHAR(64) NULL AFTER autor_nombre`,

  `ALTER TABLE comunidad_comentarios
    MODIFY COLUMN usuario_id VARCHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS autor_nombre VARCHAR(100) NULL AFTER usuario_id,
    ADD COLUMN IF NOT EXISTS ip VARCHAR(64) NULL AFTER autor_nombre,
    ADD COLUMN IF NOT EXISTS estado_moderacion ENUM('pending','approved','rejected','flagged') NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,

  `ALTER TABLE comunidad_likes
    ADD COLUMN IF NOT EXISTS usuario_id VARCHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS ip VARCHAR(64) NULL`,

  `ALTER TABLE comunidad_likes
    MODIFY COLUMN usuario_id VARCHAR(36) NULL,
    DROP INDEX IF EXISTS uq_like,
    ADD UNIQUE INDEX uq_like (tipo, objeto_id, ip)`,

  `ALTER TABLE comunidad_reportes
    ADD COLUMN IF NOT EXISTS usuario_id VARCHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS autor_nombre VARCHAR(100) NULL,
    ADD COLUMN IF NOT EXISTS ip VARCHAR(64) NULL`,

  `ALTER TABLE comunidad_reportes
    MODIFY COLUMN usuario_id VARCHAR(36) NULL`
];

async function main() {
  for (const sql of statements) {
    try {
      await pool.execute(sql);
      console.log(' Aplicado:', sql.split('\n')[0].trim());
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('Duplicate') || message.includes('already exists')) {
        console.log('ℹ Ya existe o duplicado:', message);
      } else {
        console.error(' Error:', message);
        process.exit(1);
      }
    }
  }
  console.log(' Esquema de comunidad corregido');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
