-- Tabla para almacenar las sugerencias del buzón juvenil
CREATE TABLE IF NOT EXISTS sugerencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NULL,                    -- Nombre del solicitante (null si es anónimo)
    email VARCHAR(255) NULL,                     -- Email del solicitante (null si es anónimo)
    edad VARCHAR(20) NULL,                       -- Rango de edad (12-15, 16-18, etc.)
    categoria ENUM('educacion', 'empleo', 'ocio', 'deportes', 'salud', 'vivienda', 'transporte', 'tecnologia', 'medioambiente', 'participacion', 'inclusion', 'otros') NOT NULL,
    prioridad ENUM('baja', 'media', 'alta', 'critica') NOT NULL,
    titulo VARCHAR(255) NOT NULL,                -- Título de la sugerencia
    descripcion TEXT NOT NULL,                   -- Descripción detallada
    solicitud_ayuntamiento TEXT NULL,            -- Solicitud específica al ayuntamiento
    anonimo BOOLEAN DEFAULT FALSE,               -- Si es sugerencia anónima
    comunidad_autonoma VARCHAR(100) NOT NULL,    -- Comunidad autónoma
    fecha DATETIME NOT NULL,                     -- Fecha de creación
    estado ENUM('pendiente', 'revisada', 'en_progreso', 'resuelta', 'rechazada') DEFAULT 'pendiente',
    
    -- Índices para mejor rendimiento
    INDEX idx_categoria (categoria),
    INDEX idx_prioridad (prioridad),
    INDEX idx_estado (estado),
    INDEX idx_comunidad (comunidad_autonoma),
    INDEX idx_fecha (fecha),
    INDEX idx_estado_prioridad (estado, prioridad),
    
    -- Índice compuesto para búsquedas comunes
    INDEX idx_busqueda (comunidad_autonoma, categoria, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunas sugerencias de ejemplo para pruebas
INSERT INTO sugerencias (nombre, email, edad, categoria, prioridad, titulo, descripcion, solicitud_ayuntamiento, anonimo, comunidad_autonoma, fecha, estado) VALUES
('María García', 'maria@email.com', '19-22', 'educacion', 'alta', 'Más espacios de estudio gratuitos', 'Necesitamos más bibliotecas y espacios de estudio gratuitos en la zona universitaria, especialmente en horarios nocturnos para estudiantes que trabajan durante el día.', 'Solicito la habilitación de espacios municipales como centros cívicos para uso como salas de estudio 24/7 durante épocas de exámenes.', FALSE, 'Madrid', '2024-01-15 10:30:00', 'pendiente'),
('Juan López', NULL, '23-25', 'empleo', 'critica', 'Programa de prácticas remuneradas', 'No hay suficientes oportunidades de prácticas para jóvenes sin experiencia. Las empresas no quieren contratar sin experiencia y no podemos conseguir experiencia sin prácticas.', 'Solicito la creación de un programa municipal de subvenciones para empresas que ofrezcan prácticas remuneradas a jóvenes de la comunidad.', TRUE, 'Cataluña', '2024-01-14 15:45:00', 'en_progreso'),
('Ana Martínez', 'ana@email.com', '16-18', 'deportes', 'media', 'Instalaciones deportivas gratuitas', 'Los precios de las pistas deportivas municipales son muy altos para jóvenes. Debería haber tarifas juveniles más accesibles.', 'Solicito la implementación de un carnet joven deportivo con acceso gratuito a instalaciones municipales los fines de semana.', FALSE, 'Andalucía', '2024-01-13 09:20:00', 'revisada'),
(NULL, NULL, NULL, 'transporte', 'alta', 'Transporte nocturno juvenil', 'No hay transporte público nocturno y los jóvenes no pueden volver a casa después de eventos culturales o trabajos nocturnos.', 'Solicito la creación de líneas de autobús nocturnas con tarifas especiales para jóvenes los viernes y sábados.', TRUE, 'País Vasco', '2024-01-12 22:10:00', 'pendiente'),
('Carlos Ruiz', 'carlos@email.com', '26-30', 'vivienda', 'critica', 'Alquiler juvenil asequible', 'Los precios del alquiler son imposibles para jóvenes con salarios iniciales. Necesitamos programas de vivienda juvenil.', 'Solicito la creación de un programa de viviendas de alquiler a precios reducidos para jóvenes de 18 a 30 años con ingresos limitados.', FALSE, 'Comunidad Valenciana', '2024-01-11 14:30:00', 'pendiente');
