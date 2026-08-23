-- Migración: soportar participación anónima con nombre e IP

ALTER TABLE comunidad_publicaciones
  MODIFY usuario_id varchar(36) NULL,
  ADD COLUMN autor_nombre varchar(100) NULL AFTER usuario_id,
  ADD COLUMN ip varchar(64) NULL AFTER autor_nombre;

ALTER TABLE comunidad_comentarios
  MODIFY usuario_id varchar(36) NULL,
  ADD COLUMN autor_nombre varchar(100) NULL AFTER usuario_id,
  ADD COLUMN ip varchar(64) NULL AFTER autor_nombre;

ALTER TABLE comunidad_likes
  MODIFY usuario_id varchar(36) NULL,
  ADD COLUMN ip varchar(64) NULL,
  DROP INDEX uq_like,
  ADD UNIQUE uq_like (tipo, objeto_id, ip);

ALTER TABLE comunidad_reportes
  MODIFY usuario_id varchar(36) NULL,
  ADD COLUMN autor_nombre varchar(100) NULL AFTER usuario_id,
  ADD COLUMN ip varchar(64) NULL AFTER autor_nombre;
