import { pool } from '../src/config/database';

const migrationQueries = [
  // 1. Usuarios: activo para desactivar sin borrar
  `ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo TINYINT(1) NOT NULL DEFAULT 1`,

  // 2. Mensajes internos: más campos para hilo, adjuntos y prioridad
  `ALTER TABLE mensajes_staff
    ADD COLUMN IF NOT EXISTS padre_id INT NULL,
    ADD COLUMN IF NOT EXISTS anuncio_id INT NULL,
    ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20) NOT NULL DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS archivado_remitente TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS archivado_destinatario TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS eliminado_remitente TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS eliminado_destinatario TINYINT(1) NOT NULL DEFAULT 0`,

  // 3. Adjuntos de mensajes
  `CREATE TABLE IF NOT EXISTS mensajes_adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje_id INT NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_guardado VARCHAR(255) NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamano INT NOT NULL,
    ruta_storage VARCHAR(500) NOT NULL,
    subido_por VARCHAR(36) NOT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mensaje (mensaje_id),
    CONSTRAINT fk_adjunto_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensajes_staff(id) ON DELETE CASCADE
  )`,
  // 4. Logs de actividad administrativa
  `CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(255) NULL,
    detalle TEXT NULL,
    ip VARCHAR(45) NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_entidad (entidad, entidad_id),
    INDEX idx_creado (creado_at)
  )`,

  // 5. Permitir notas en reportes de anuncios
  `ALTER TABLE reportes_anuncios ADD COLUMN IF NOT EXISTS nota_moderacion TEXT NULL,
   ADD COLUMN IF NOT EXISTS revisado_por VARCHAR(36) NULL,
   ADD COLUMN IF NOT EXISTS revisado_at TIMESTAMP NULL`,
];

const run = async () => {
  console.log('Iniciando migración admin v2...');
  for (const query of migrationQueries) {
    try {
      await pool.execute(query);
      console.log('OK:', query.substring(0, 60) + '...');
    } catch (err: any) {
      console.error('Error en migración:', query, err.message);
      throw err;
    }
  }
  console.log('Migración finalizada.');
  process.exit(0);
};

run();
