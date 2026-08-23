-- Registro de auditoría de acciones de moderación
CREATE TABLE IF NOT EXISTS moderacion_logs (
  id VARCHAR(36) PRIMARY KEY,
  anuncio_id VARCHAR(36) NOT NULL,
  moderador_id VARCHAR(36) NOT NULL,
  estado_anterior VARCHAR(50) DEFAULT NULL,
  estado_nuevo VARCHAR(50) NOT NULL,
  notas TEXT,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_anuncio (anuncio_id),
  INDEX idx_moderador (moderador_id),
  INDEX idx_creado (creado_at),
  CONSTRAINT fk_moderacion_logs_anuncio FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE NO ACTION,
  CONSTRAINT fk_moderacion_logs_moderador FOREIGN KEY (moderador_id) REFERENCES usuarios(id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
