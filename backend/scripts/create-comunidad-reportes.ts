import { pool } from '../src/config/database';

async function main() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS comunidad_reportes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(36) NULL,
      autor_nombre VARCHAR(255) NULL,
      ip VARCHAR(45) NULL,
      tipo ENUM('publicacion', 'respuesta') NOT NULL,
      objeto_id INT NOT NULL,
      motivo VARCHAR(255) NOT NULL,
      descripcion TEXT NULL,
      estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
      nota_moderacion TEXT NULL,
      creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      revisado TIMESTAMP NULL,
      INDEX idx_objeto (tipo, objeto_id),
      INDEX idx_estado (estado)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('Tabla comunidad_reportes creada o ya existente.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creando comunidad_reportes:', err);
  process.exit(1);
});
