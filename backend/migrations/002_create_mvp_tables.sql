-- Crear tablas faltantes para el MVP de CityPAJ
-- Tablas: comunidad_publicaciones, comunidad_comentarios, propuestas, propuestas_apoyos, recursos, eventos

CREATE TABLE IF NOT EXISTS comunidad_publicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  tema VARCHAR(50) NOT NULL,
  visible TINYINT(1) DEFAULT 1,
  estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'approved',
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provincia (provincia),
  INDEX idx_tema (tema),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS comunidad_comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  publicacion_id INT NOT NULL,
  usuario_id VARCHAR(36) NOT NULL,
  contenido TEXT NOT NULL,
  visible TINYINT(1) DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publicacion_id) REFERENCES comunidad_publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS propuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  apoyos INT DEFAULT 0,
  visible TINYINT(1) DEFAULT 1,
  estado_moderacion ENUM('pending','approved','rejected','flagged') DEFAULT 'approved',
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provincia (provincia),
  INDEX idx_categoria (categoria),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS propuestas_apoyos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propuesta_id INT NOT NULL,
  usuario_id VARCHAR(36) NOT NULL,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_apoyo (propuesta_id, usuario_id),
  FOREIGN KEY (propuesta_id) REFERENCES propuestas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS recursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  url VARCHAR(500),
  verificado TINYINT(1) DEFAULT 0,
  visible TINYINT(1) DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_provincia (provincia),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id VARCHAR(36),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  fecha_inicio DATETIME,
  fecha_fin DATETIME,
  precio DECIMAL(10,2) DEFAULT 0,
  ubicacion VARCHAR(255),
  url VARCHAR(500),
  visible TINYINT(1) DEFAULT 1,
  creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha_inicio),
  INDEX idx_categoria (categoria),
  INDEX idx_provincia (provincia),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
