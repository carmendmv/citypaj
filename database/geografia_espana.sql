-- ===================================
-- TABLAS GEOGRÁFICAS DE ESPAÑA
-- ===================================

-- Tabla de Comunidades Autónomas
CREATE TABLE IF NOT EXISTS comunidades_autonomas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(5) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Provincias
CREATE TABLE IF NOT EXISTS provincias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(5) NOT NULL UNIQUE,
    comunidad_autonoma_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (comunidad_autonoma_id) REFERENCES comunidades_autonomas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provincia_comunidad (nombre, comunidad_autonoma_id)
);

-- ===================================
-- INSERCIÓN DE DATOS
-- ===================================

-- Insertar Comunidades Autónomas
INSERT INTO comunidades_autonomas (nombre, codigo) VALUES
('Andalucía', 'AN'),
('Aragón', 'AR'),
('Asturias', 'AS'),
('Baleares', 'IB'),
('Canarias', 'CN'),
('Cantabria', 'CB'),
('Castilla-La Mancha', 'CM'),
('Castilla y León', 'CL'),
('Cataluña', 'CT'),
('Comunidad Valenciana', 'VC'),
('Extremadura', 'EX'),
('Galicia', 'GA'),
('Madrid', 'MD'),
('Murcia', 'MC'),
('Navarra', 'NC'),
('País Vasco', 'PV'),
('La Rioja', 'RI');

-- Insertar Provincias por Comunidad Autónoma

-- Andalucía
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Almería', 'AL', 1),
('Cádiz', 'CA', 1),
('Córdoba', 'CO', 1),
('Granada', 'GR', 1),
('Huelva', 'HU', 1),
('Jaén', 'JA', 1),
('Málaga', 'MA', 1),
('Sevilla', 'SE', 1);

-- Aragón
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Huesca', 'HU', 2),
('Teruel', 'TE', 2),
('Zaragoza', 'ZA', 2);

-- Asturias
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Asturias', 'AS', 3);

-- Baleares
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Baleares', 'IB', 4);

-- Canarias
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Las Palmas', 'GC', 5),
('Santa Cruz de Tenerife', 'TF', 5);

-- Cantabria
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Cantabria', 'CB', 6);

-- Castilla-La Mancha
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Albacete', 'AB', 7),
('Ciudad Real', 'CR', 7),
('Cuenca', 'CU', 7),
('Guadalajara', 'GU', 7),
('Toledo', 'TO', 7);

-- Castilla y León
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Ávila', 'AV', 8),
('Burgos', 'BU', 8),
('León', 'LE', 8),
('Palencia', 'PA', 8),
('Salamanca', 'SA', 8),
('Segovia', 'SG', 8),
('Soria', 'SO', 8),
('Valladolid', 'VA', 8),
('Zamora', 'ZA', 8);

-- Cataluña
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Barcelona', 'BA', 9),
('Girona', 'GI', 9),
('Lérida', 'LE', 9),
('Tarragona', 'TA', 9);

-- Comunidad Valenciana
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Alicante', 'AL', 10),
('Castellón', 'CS', 10),
('Valencia', 'VA', 10);

-- Extremadura
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Badajoz', 'BA', 11),
('Cáceres', 'CC', 11);

-- Galicia
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('La Coruña', 'CO', 12),
('Lugo', 'LU', 12),
('Orense', 'OU', 12),
('Pontevedra', 'PO', 12);

-- Madrid
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Madrid', 'MD', 13);

-- Murcia
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Murcia', 'MU', 14);

-- Navarra
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Navarra', 'NC', 15);

-- País Vasco
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('Álava', 'AL', 16),
('Guipúzcoa', 'GU', 16),
('Vizcaya', 'BI', 16);

-- La Rioja
INSERT INTO provincias (nombre, codigo, comunidad_autonoma_id) VALUES
('La Rioja', 'RI', 17);

-- ===================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ===================================

CREATE INDEX idx_provincias_comunidad ON provincias(comunidad_autonoma_id);
CREATE INDEX idx_comunidades_nombre ON comunidades_autonomas(nombre);
CREATE INDEX idx_provincias_nombre ON provincias(nombre);

-- ===================================
-- VISTAS ÚTILES
-- ===================================

-- Vista para obtener todas las provincias con su comunidad autónoma
CREATE VIEW vista_provincias_completas AS
SELECT 
    p.id as provincia_id,
    p.nombre as provincia_nombre,
    p.codigo as provincia_codigo,
    c.id as comunidad_id,
    c.nombre as comunidad_nombre,
    c.codigo as comunidad_codigo
FROM provincias p
INNER JOIN comunidades_autonomas c ON p.comunidad_autonoma_id = c.id
ORDER BY c.nombre, p.nombre;

-- ===================================
-- VERIFICACIÓN DE DATOS
-- ===================================

-- Consulta para verificar que todo se insertó correctamente
SELECT 
    'Comunidades Autónomas' as tipo,
    COUNT(*) as total
FROM comunidades_autonomas
UNION ALL
SELECT 
    'Provincias' as tipo,
    COUNT(*) as total
FROM provincias;

-- Consulta para ver el resumen por comunidad
SELECT 
    c.nombre as comunidad_autonoma,
    COUNT(p.id) as numero_provincias,
    GROUP_CONCAT(p.nombre ORDER BY p.nombre SEPARATOR ', ') as provincias
FROM comunidades_autonomas c
LEFT JOIN provincias p ON c.id = p.comunidad_autonoma_id
GROUP BY c.id, c.nombre
ORDER BY c.nombre;
