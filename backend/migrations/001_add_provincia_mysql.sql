-- Añadir columna provincia a tabla de usuarios
ALTER TABLE usuarios 
ADD COLUMN provincia VARCHAR(100);

-- Añadir columna provincia a tabla de anuncios  
ALTER TABLE anuncios 
ADD COLUMN provincia VARCHAR(100);

-- Crear índices para mejorar rendimiento en búsquedas por provincia
CREATE INDEX idx_usuarios_provincia ON usuarios(provincia);
CREATE INDEX idx_anuncios_provincia ON anuncios(provincia);
