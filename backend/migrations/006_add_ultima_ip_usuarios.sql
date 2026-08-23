-- Añadir columna para la última IP conocida del usuario
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultima_ip VARCHAR(64) NULL;
