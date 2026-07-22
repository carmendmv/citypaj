-- Añadir columna provincia a tabla de usuarios
ALTER TABLE usuarios 
ADD COLUMN provincia VARCHAR(100);

-- Añadir columna provincia a tabla de anuncios  
ALTER TABLE anuncios 
ADD COLUMN provincia VARCHAR(100);

-- Crear índices para mejorar rendimiento en búsquedas por provincia
CREATE INDEX idx_usuarios_provincia ON usuarios(provincia);
CREATE INDEX idx_anuncios_provincia ON anuncios(provincia);

-- Comentario sobre las nuevas columnas
COMMENT ON COLUMN usuarios.provincia IS 'Provincia del usuario (opcional)';
COMMENT ON COLUMN anuncios.provincia IS 'Provincia del anuncio (opcional)';
