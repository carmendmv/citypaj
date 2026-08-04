-- Schema CityPaj - Plataforma de anuncios juvenil
-- Convertido a MySQL 8.0+

-- Tabla de usuarios
CREATE TABLE usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    ultima_ip VARCHAR(64),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de anuncios
CREATE TABLE anuncios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36),
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
    vistas INT DEFAULT 0,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de imágenes
CREATE TABLE imagenes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    anuncio_id CHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    orden INT DEFAULT 0,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    anuncio_id CHAR(36) NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorito (usuario_id, anuncio_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE
);

-- Tabla de reportes
CREATE TABLE reportes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    anuncio_id CHAR(36) NOT NULL,
    usuario_id CHAR(36),
    motivo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pending' CHECK (estado IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de alertas de búsqueda
CREATE TABLE alertas_busqueda (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    termino_busqueda VARCHAR(200),
    categoria VARCHAR(50),
    comunidad_autonoma VARCHAR(50),
    provincia VARCHAR(50),
    precio_maximo DECIMAL(10,2),
    activa BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para mejor rendimiento
CREATE INDEX idx_anuncios_categoria ON anuncios(categoria);
CREATE INDEX idx_anuncios_comunidad ON anuncios(comunidad_autonoma);
CREATE INDEX idx_anuncios_provincia ON anuncios(provincia);
CREATE INDEX idx_anuncios_visible ON anuncios(visible);
CREATE INDEX idx_anuncios_estado_moderacion ON anuncios(estado_moderacion);
CREATE INDEX idx_anuncios_creado ON anuncios(creado);
CREATE INDEX idx_anuncios_usuario_id ON anuncios(usuario_id);

CREATE INDEX idx_favoritos_usuario_id ON favoritos(usuario_id);
CREATE INDEX idx_favoritos_anuncio_id ON favoritos(anuncio_id);

CREATE INDEX idx_reportes_anuncio_id ON reportes(anuncio_id);
CREATE INDEX idx_reportes_estado ON reportes(estado);

CREATE INDEX idx_alertas_usuario_id ON alertas_busqueda(usuario_id);
CREATE INDEX idx_alertas_activa ON alertas_busqueda(activa);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
