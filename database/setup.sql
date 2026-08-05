-- Base de datos para CityPaj
CREATE DATABASE IF NOT EXISTS citypaj CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE citypaj;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    verificado BOOLEAN DEFAULT FALSE,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de comunidades autónomas
CREATE TABLE comunidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar comunidades autónomas
INSERT INTO comunidades (nombre) VALUES
('Andalucía'), ('Aragón'), ('Asturias'), ('Baleares'), ('Canarias'), ('Cantabria'),
('Castilla-La Mancha'), ('Castilla y León'), ('Cataluña'), ('Comunidad Valenciana'),
('Extremadura'), ('Galicia'), ('Madrid'), ('Murcia'), ('Navarra'), ('País Vasco'), ('La Rioja');

-- Tabla de provincias
CREATE TABLE provincias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    comunidad_id INT NOT NULL,
    FOREIGN KEY (comunidad_id) REFERENCES comunidades(id),
    INDEX idx_comunidad (comunidad_id),
    INDEX idx_nombre (nombre),
    UNIQUE KEY unique_provincia_comunidad (nombre, comunidad_id)
);

-- Insertar provincias por comunidad autónoma
INSERT INTO provincias (nombre, comunidad_id) VALUES
-- Andalucía (id: 1)
('Almería', 1), ('Cádiz', 1), ('Córdoba', 1), ('Granada', 1), ('Huelva', 1), ('Jaén', 1), ('Málaga', 1), ('Sevilla', 1),

-- Aragón (id: 2)
('Huesca', 2), ('Teruel', 2), ('Zaragoza', 2),

-- Asturias (id: 3)
('Asturias', 3),

-- Baleares (id: 4)
('Baleares', 4),

-- Canarias (id: 5)
('Las Palmas', 5), ('Santa Cruz de Tenerife', 5),

-- Cantabria (id: 6)
('Cantabria', 6),

-- Castilla-La Mancha (id: 7)
('Albacete', 7), ('Ciudad Real', 7), ('Cuenca', 7), ('Guadalajara', 7), ('Toledo', 7),

-- Castilla y León (id: 8)
('Ávila', 8), ('Burgos', 8), ('León', 8), ('Palencia', 8), ('Salamanca', 8), ('Segovia', 8), ('Soria', 8), ('Valladolid', 8), ('Zamora', 8),

-- Cataluña (id: 9)
('Barcelona', 9), ('Girona', 9), ('Lleida', 9), ('Tarragona', 9),

-- Comunidad Valenciana (id: 10)
('Alicante', 10), ('Castellón', 10), ('Valencia', 10),

-- Extremadura (id: 11)
('Badajoz', 11), ('Cáceres', 11),

-- Galicia (id: 12)
('A Coruña', 12), ('Lugo', 12), ('Ourense', 12), ('Pontevedra', 12),

-- Madrid (id: 13)
('Madrid', 13),

-- Murcia (id: 14)
('Murcia', 14),

-- Navarra (id: 15)
('Navarra', 15),

-- País Vasco (id: 16)
('Álava', 16), ('Bizkaia', 16), ('Gipuzkoa', 16),

-- La Rioja (id: 17)
('La Rioja', 17);

-- Tabla de anuncios
CREATE TABLE anuncios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id VARCHAR(36) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria ENUM('ocio', 'servicios', 'formacion', 'empleo', 'comunidad') NOT NULL,
    subcategoria VARCHAR(50),
    comunidad_id INT NOT NULL,
    provincia_id INT NOT NULL,
    barrio VARCHAR(100),
    precio DECIMAL(10,2),
    modalidad ENUM('venta', 'regalo', 'intercambio', 'servicio', 'compra') NOT NULL,
    contacto_email BOOLEAN DEFAULT TRUE,
    contacto_telefono BOOLEAN DEFAULT TRUE,
    contacto_anonimo BOOLEAN DEFAULT FALSE,
    visible BOOLEAN DEFAULT TRUE,
    estado_moderacion ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
    motivo_rechazo TEXT,
    vistas INT DEFAULT 0,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (comunidad_id) REFERENCES comunidades(id),
    FOREIGN KEY (provincia_id) REFERENCES provincias(id),
    INDEX idx_categoria (categoria),
    INDEX idx_comunidad (comunidad_id),
    INDEX idx_provincia (provincia_id),
    INDEX idx_estado (estado_moderacion),
    INDEX idx_visible (visible),
    FULLTEXT idx_busqueda (titulo, descripcion)
);

-- Tabla de imágenes de anuncios
CREATE TABLE anuncio_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anuncio_id VARCHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id) ON DELETE NO ACTION
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    anuncio_id VARCHAR(36) NOT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (anuncio_id) REFERENCES anuncios(id),
    UNIQUE KEY unique_favorito (usuario_id, anuncio_id)
);

-- Insertar datos de prueba
INSERT INTO usuarios (email, password_hash, nombre, verificado) VALUES
('juan@example.com', '$2b$10$example_hash', 'Juan Pérez', TRUE),
('maria@example.com', '$2b$10$example_hash', 'María García', TRUE),
('carlos@example.com', '$2b$10$example_hash', 'Carlos López', TRUE);

INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad) VALUES
((SELECT id FROM usuarios WHERE email = 'juan@example.com'), 
 'Guitarra eléctrica casi nueva', 
 'Vendo guitarra eléctrica Fender Stratocaster con muy poco uso. Incluye funda y púa. Perfecta para principiantes.', 
 'ocio', 13, 13, 'venta'),

((SELECT id FROM usuarios WHERE email = 'maria@example.com'), 
 'Clases de matemáticas gratuitas', 
 'Ofrezco clases de apoyo de matemáticas para estudiantes de secundaria. Todos los sábados por la mañana.', 
 'servicios', 1, 8, 'servicio'),

((SELECT id FROM usuarios WHERE email = 'carlos@example.com'), 
 'Busco voluntarios para proyecto local', 
 'Necesitamos voluntarios para ayudar en el comedor social del barrio. Se necesita gente para servir comida y organizar actividades.', 
 'comunidad', 9, 33, 'servicio');
