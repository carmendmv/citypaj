ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(20) NOT NULL DEFAULT 'usuario';

UPDATE usuarios SET rol = 'usuario' WHERE rol IS NULL OR rol = '';
