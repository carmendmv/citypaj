-- Migración: mejoras en comunidad
-- No destructiva. Crea tablas de likes y reportes, y añade campos de moderación a comentarios.

CREATE TABLE IF NOT EXISTS comunidad_likes (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id varchar(36) NOT NULL,
  tipo enum('publicacion','respuesta') NOT NULL,
  objeto_id int(11) NOT NULL,
  creado_en timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY uq_like (usuario_id, tipo, objeto_id),
  KEY idx_objeto (tipo, objeto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comunidad_reportes (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id varchar(36) NOT NULL,
  tipo enum('publicacion','respuesta') NOT NULL,
  objeto_id int(11) NOT NULL,
  motivo varchar(255) NOT NULL,
  descripcion text DEFAULT NULL,
  estado enum('pendiente','revisado','descartado') NOT NULL DEFAULT 'pendiente',
  nota_moderacion text DEFAULT NULL,
  creado timestamp NOT NULL DEFAULT current_timestamp(),
  revisado timestamp NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_objeto (tipo, objeto_id),
  KEY idx_usuario (usuario_id),
  KEY idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE comunidad_comentarios
  ADD COLUMN IF NOT EXISTS estado_moderacion enum('pending','approved','rejected','flagged') NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS actualizado_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp();
