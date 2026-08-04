-- Schema CityPaj - Plataforma de anuncios juvenil
-- Basado en PostgreSQL 15+ con extensiones optimizadas

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    telefono_verificado BOOLEAN DEFAULT FALSE,
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'moderador', 'admin')),
    comunidad_autonoma VARCHAR(50),
    provincia VARCHAR(50),
    avatar_url VARCHAR(500),
    bio TEXT,
    creado TIMESTAMP DEFAULT NOW(),
    actualizado TIMESTAMP DEFAULT NOW()
);

-- Tabla de anuncios
CREATE TABLE anuncios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(50),
    comunidad_autonoma VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    barrio VARCHAR(100),
    precio DECIMAL(10,2),
    modalidad VARCHAR(20) CHECK (modalidad IN ('venta', 'regalo', 'intercambio', 'servicio')),
    contacto_email BOOLEAN DEFAULT TRUE,
    contacto_telefono BOOLEAN DEFAULT FALSE,
    contacto_anonimo BOOLEAN DEFAULT FALSE,
    visible BOOLEAN DEFAULT TRUE,
    estado_moderacion VARCHAR(20) DEFAULT 'pending' CHECK (estado_moderacion IN ('pending', 'approved', 'rejected', 'flagged')),
    motivo_rechazo TEXT,
    vistas INTEGER DEFAULT 0,
    creado TIMESTAMP DEFAULT NOW(),
    actualizado TIMESTAMP DEFAULT NOW()
);

-- Tabla de imágenes
CREATE TABLE imagenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES anuncios(id) ON DELETE NO ACTION,
    url VARCHAR(500) NOT NULL,
    url_thumbnail VARCHAR(500),
    orden INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    size_bytes INTEGER,
    mime_type VARCHAR(100),
    creado TIMESTAMP DEFAULT NOW()
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    anuncio_id UUID REFERENCES anuncios(id) ON DELETE NO ACTION,
    creado TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuario_id, anuncio_id)
);

-- Tabla de reportes
CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES anuncios(id) ON DELETE NO ACTION,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    motivo VARCHAR(100) NOT NULL CHECK (motivo IN ('spam', 'inapropiado', 'fraude', 'duplicado', 'otro')),
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'pending' CHECK (estado IN ('pending', 'revisado', 'resuelto', 'descartado')),
    resuelto_por UUID REFERENCES usuarios(id),
    creado TIMESTAMP DEFAULT NOW(),
    resuelto TIMESTAMP
);

-- Tabla de acciones de moderación
CREATE TABLE acciones_moderacion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES anuncios(id) ON DELETE NO ACTION,
    moderador_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('aprobar', 'rechazar', 'ocultar', 'eliminar', 'flag')),
    motivo TEXT,
    anterior_estado VARCHAR(20),
    nuevo_estado VARCHAR(20),
    creado TIMESTAMP DEFAULT NOW()
);

-- Tabla de alertas de búsqueda
CREATE TABLE alertas_busqueda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    termino_busqueda VARCHAR(500) NOT NULL,
    filtros JSONB,
    activa BOOLEAN DEFAULT TRUE,
    ultima_notificacion TIMESTAMP,
    creado TIMESTAMP DEFAULT NOW()
);

-- Tabla de sesiones (para JWT refresh tokens)
CREATE TABLE sesiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE NO ACTION,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    creado TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización de consultas
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_telefono ON usuarios(telefono);
CREATE INDEX idx_usuarios_creado ON usuarios(creado);
CREATE INDEX idx_usuarios_comunidad ON usuarios(comunidad_autonoma);

CREATE INDEX idx_anuncios_usuario_id ON anuncios(usuario_id);
CREATE INDEX idx_anuncios_categoria ON anuncios(categoria);
CREATE INDEX idx_anuncios_comunidad ON anuncios(comunidad_autonoma);
CREATE INDEX idx_anuncios_provincia ON anuncios(provincia);
CREATE INDEX idx_anuncios_creado ON anuncios(creado DESC);
CREATE INDEX idx_anuncios_visible ON anuncios(visible);
CREATE INDEX idx_anuncios_estado_moderacion ON anuncios(estado_moderacion);
CREATE INDEX idx_anuncios_precio ON anuncios(precio);
CREATE INDEX idx_anuncios_modalidad ON anuncios(modalidad);

-- Índices de búsqueda full-text con pg_trgm
CREATE INDEX idx_anuncios_titulo_gin ON anuncios USING gin(titulo gin_trgm_ops);
CREATE INDEX idx_anuncios_descripcion_gin ON anuncios USING gin(descripcion gin_trgm_ops);
CREATE INDEX idx_anuncios_busqueda_completa ON anuncios USING gin(
    titulo gin_trgm_ops, 
    descripcion gin_trgm_ops, 
    categoria, 
    comunidad_autonoma
);

CREATE INDEX idx_imagenes_anuncio_id ON imagenes(anuncio_id);
CREATE INDEX idx_imagenes_orden ON imagenes(anuncio_id, orden);

CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX idx_favoritos_anuncio_id ON favoritos(anuncio_id);

CREATE INDEX idx_reportes_anuncio_id ON reportes(anuncio_id);
CREATE INDEX idx_reportes_usuario_id ON reportes(usuario_id);
CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_creado ON reportes(creado DESC);

CREATE INDEX idx_acciones_moderacion_anuncio_id ON acciones_moderacion(anuncio_id);
CREATE INDEX idx_acciones_moderacion_moderador_id ON acciones_moderacion(moderador_id);
CREATE INDEX idx_acciones_moderacion_creado ON acciones_moderacion(creado DESC);

CREATE INDEX idx_alertas_busqueda_usuario_id ON alertas_busqueda(usuario_id);
CREATE INDEX idx_alertas_busqueda_activa ON alertas_busqueda(activa);

CREATE INDEX idx_sesiones_usuario_id ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_expires_at ON sesiones(expires_at);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_actualizado
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_anuncios_actualizado
    BEFORE UPDATE ON anuncios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION incrementar_vistas(anuncio_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE anuncios 
    SET vistas = vistas + 1 
    WHERE id = anuncio_uuid;
END;
$$ LANGUAGE plpgsql;

-- Vista de anuncios activos para consultas frecuentes
CREATE VIEW anuncios_activos AS
SELECT 
    a.*,
    u.nombre as usuario_nombre,
    u.email_verificado as usuario_verificado,
    COUNT(i.id) as numero_imagenes
FROM anuncios a
JOIN usuarios u ON a.usuario_id = u.id
LEFT JOIN imagenes i ON a.id = i.anuncio_id
WHERE a.visible = TRUE 
  AND a.estado_moderacion = 'approved'
GROUP BY a.id, u.nombre, u.email_verificado;

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Usuarios registrados en CityPaj';
COMMENT ON TABLE anuncios IS 'Anuncios publicados por usuarios';
COMMENT ON TABLE imagenes IS 'Imágenes asociadas a anuncios (máximo 6 por anuncio)';
COMMENT ON TABLE favoritos IS 'Anuncios guardados como favoritos por usuarios';
COMMENT ON TABLE reportes IS 'Reportes de anuncios por contenido inapropiado';
COMMENT ON TABLE acciones_moderacion IS 'Historial de acciones de moderación';
COMMENT ON TABLE alertas_busqueda IS 'Alertas personalizadas de búsqueda para usuarios';
COMMENT ON TABLE sesiones IS 'Sesiones activas para refresh tokens JWT';
