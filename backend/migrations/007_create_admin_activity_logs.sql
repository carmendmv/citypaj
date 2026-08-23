-- Registro de actividad administrativa general
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id VARCHAR(255) DEFAULT NULL,
  detalle TEXT,
  ip_address VARCHAR(64) DEFAULT NULL,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (usuario_id),
  INDEX idx_accion (accion),
  INDEX idx_entidad (entidad),
  INDEX idx_creado (creado_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
