-- Datos iniciales para CityPaj
-- Este archivo se ejecuta después del schema.sql

-- Extensiones adicionales si es necesario
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar usuarios de prueba
INSERT INTO usuarios (id, email, nombre, password_hash, email_verificado, rol, comunidad_autonoma, provincia, creado) VALUES
(uuid_generate_v4(), 'admin@citypaj.es', 'Administrador CityPaj', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', true, 'admin', 'aragon', 'zaragoza', NOW()),
(uuid_generate_v4(), 'moderador@citypaj.es', 'Moderador Principal', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', true, 'moderador', 'aragon', 'zaragoza', NOW()),
(uuid_generate_v4(), 'usuario1@citypaj.es', 'Ana García', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', true, 'usuario', 'aragon', 'zaragoza', NOW()),
(uuid_generate_v4(), 'usuario2@citypaj.es', 'Carlos Ruiz', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', true, 'usuario', 'cataluna', 'barcelona', NOW()),
(uuid_generate_v4(), 'usuario3@citypaj.es', 'Laura Martínez', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', false, 'usuario', 'madrid', 'madrid', NOW());

-- Insertar anuncios de ejemplo
INSERT INTO anuncios (id, usuario_id, titulo, descripcion, categoria, subcategoria, comunidad_autonoma, provincia, barrio, precio, modalidad, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion, creado) VALUES
-- Educación
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), 
'Clases particulares de matemáticas', 
'Soy estudiante de 3º de Ingeniería Matemática y ofrezco clases particulares de matemáticas para estudiantes de ESO, Bachillerato y universitarios. Explicaciones claras, método adaptado a cada alumno, preparación para exámenes. Precio flexible según nivel y frecuencia. Disponibilidad tardes y fines de semana. Zona Universidad o a domicilio en Zaragoza capital.', 
'educacion', 'clases', 'aragon', 'zaragoza', 'centro', 15.00, 'servicio', true, false, false, true, 'approved', NOW() - INTERVAL '2 days'),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario2@citypaj.es'), 
'Curso de inglés intensivo verano', 
'Academia de inglés con más de 10 años de experiencia ofrece curso intensivo de verano para todos los niveles. Grupos reducidos (máximo 8 alumnos), profesores nativos, material incluido. Preparación para exámenes oficiales (Cambridge, Trinity). Horario de lunes a viernes 9:00-13:00. Inicio: 1 de julio. ¡Plazas limitadas!', 
'educacion', 'cursos', 'cataluna', 'barcelona', 'eixample', 250.00, 'servicio', true, true, false, true, 'approved', NOW() - INTERVAL '1 day'),

-- Empleo
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario3@citypaj.es'), 
'Busco trabajo como camarero', 
'Joven de 22 años con experiencia de 1 año en sector hostelería busca trabajo como camarero en Madrid capital. Disponibilidad inmediata, horarios flexibles, fin de semana incluido. Responsable, rápido aprendizaje, buen trato con clientes. Referencias disponibles. Interesado en restaurantes, cafeterías o bares.', 
'empleo', 'busco', 'madrid', 'madrid', 'centro', 0, 'servicio', true, true, false, true, 'approved', NOW() - INTERVAL '3 hours'),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), 
'Se requiere programador web junior', 
'Empresa tecnológica en Zaragoza busca programador web junior para proyecto de 3 meses. Conocimientos requeridos: HTML, CSS, JavaScript, React. Se valorará conocimiento de Node.js y bases de datos. Formación continua, buen ambiente laboral, posibilidad de contrato posterior. Horario flexible 40h semanales.', 
'empleo', 'ofertas', 'aragon', 'zaragoza', 'actur', 1200.00, 'servicio', true, false, false, true, 'approved', NOW() - INTERVAL '5 hours'),

-- Vivienda
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario2@citypaj.es'), 
'Habitación doble en piso compartido', 
'Se alquila habitación doble en piso compartido en Barcelona, zona Gracia. Piso reformado, 4 habitaciones, 2 baños, cocina totalmente equipada, salón comedor, terraza. Gastos incluidos (agua, luz, internet, gas). Cerca de metro L3 Fontana. Buscamos chico/a estudiante o joven trabajador, responsable y limpio. Disponible a partir de 1 de septiembre.', 
'vivienda', 'habitacion', 'cataluna', 'barcelona', 'gracia', 350.00, 'alquiler', true, false, false, true, 'approved', NOW() - INTERVAL '1 week'),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario3@citypaj.es'), 
'Piso en venta en centro de Madrid', 
'Piso de 65m² en pleno centro de Madrid, zona Sol. 2 dormitorios, 1 baño, cocina independiente, salón comedor. 4ª planta con ascensor, exterior muy luminoso. Recientemente reformado, aire acondicionado, calefacción central. Ideal para inversión o primera vivienda. Cerca de transporte, tiendas y restaurantes. Trato directo con propietario, sin comisiones.', 
'vivienda', 'compra', 'madrid', 'madrid', 'centro', 285000.00, 'venta', true, false, false, true, 'approved', NOW() - INTERVAL '2 weeks'),

-- Ocio
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), 
'Vendo guitarra eléctrica con amplificador', 
'Vendo guitarra eléctrica Fender Stratocaster color negro con amplificador Marshall 10W. Guitarra en perfecto estado, poco uso, incluye funda, púa, correa y cable. Ideal para principiantes o nivel medio. Sonido excelente, mantenimiento impecable. Motivo de venta: cambio por otro instrumento. Precio negociable. Se puede probar sin compromiso.', 
'ocio', 'deportes', 'aragon', 'zaragoza', 'san_jose', 180.00, 'venta', true, true, false, true, 'approved', NOW() - INTERVAL '4 days'),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario2@citypaj.es'), 
'Grupo de senderismo los sábados', 
'Grupo amateur de senderismo organiza rutas los sábados por la zona de Barcelona. Todos los niveles bienvenidos, rutas de 4-6 horas con dificultad media. Salida a las 8:00 de la mañana, regreso sobre las 15:00. Compartimos gastos de transporte. Es buena forma de hacer ejercicio, conocer gente y disfrutar de la naturaleza. Si te interesa, únete a nuestro grupo de WhatsApp.', 
'ocio', 'deportes', 'cataluna', 'barcelona', 'varias', 0, 'regalo', true, false, true, true, 'approved', NOW() - INTERVAL '6 days'),

-- Servicios
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario3@citypaj.es'), 
'Reparaciones informáticas a domicilio', 
'Técnico informático con 10 años de experiencia ofrece reparaciones a domicilio en Madrid. Eliminación de virus, instalación de programas, configuración de redes, recuperación de datos, mantenimiento preventivo. Precios asequibles, presupuesto sin compromiso. Servicio rápido y garantizado. Disponibilidad 24/7 para urgencias. Llámanos y cuéntanos tu problema.', 
'servicios', 'informatica', 'madrid', 'madrid', 'todas', 25.00, 'servicio', true, true, false, true, 'approved', NOW() - INTERVAL '3 days'),

-- Intercambios
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), 
'Intercambio idiomas español-inglés', 
'Estudiante universitario de 21 años busca intercambio de idiomas español-inglés. Nivel nativo español, nivel intermedio inglés (B1). Busco hablante nativo inglés para practicar conversación, a cambio te ayudo con tu español. Nos podemos ver en cafeterías en Zaragoza centro, 2 veces por semana, 1 hora cada vez. Interesados en intercambio serio y constante.', 
'intercambios', 'habilidades', 'aragon', 'zaragoza', 'centro', 0, 'intercambio', true, false, true, true, 'approved', NOW() - INTERVAL '1 day');

-- Insertar imágenes de ejemplo para algunos anuncios
INSERT INTO imagenes (id, anuncio_id, url, url_thumbnail, orden, width, height, size_bytes, mime_type, creado) VALUES
(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Clases particulares de matemáticas'), 
'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop', 1, 800, 600, 245760, 'image/jpeg', NOW()),

(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Curso de inglés intensivo verano'), 
'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop', 1, 800, 600, 312320, 'image/jpeg', NOW()),

(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Habitación doble en piso compartido'), 
'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop', 1, 800, 600, 286720, 'image/jpeg', NOW()),

(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Vendo guitarra eléctrica con amplificador'), 
'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=200&h=200&fit=crop', 1, 800, 600, 198656, 'image/jpeg', NOW()),

(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Piso en venta en centro de Madrid'), 
'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop', 1, 800, 600, 286720, 'image/jpeg', NOW()),

(uuid_generate_v4(), (SELECT id FROM anuncios WHERE titulo = 'Grupo de senderismo los sábados'), 
'https://images.unsplash.com/photo-1551632811-561732d1e308?w=800&h=600&fit=crop', 
'https://images.unsplash.com/photo-1551632811-561732d1e308?w=200&h=200&fit=crop', 1, 800, 600, 327680, 'image/jpeg', NOW());

-- Insertar algunos favoritos de ejemplo
INSERT INTO favoritos (id, usuario_id, anuncio_id, creado) VALUES
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), (SELECT id FROM anuncios WHERE titulo = 'Habitación doble en piso compartido'), NOW()),
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario2@citypaj.es'), (SELECT id FROM anuncios WHERE titulo = 'Clases particulares de matemáticas'), NOW()),
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario3@citypaj.es'), (SELECT id FROM anuncios WHERE titulo = 'Vendo guitarra eléctrica con amplificador'), NOW());

-- Insertar alertas de búsqueda de ejemplo
INSERT INTO alertas_busqueda (id, usuario_id, termino_busqueda, filtros, activa, creado) VALUES
(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario1@citypaj.es'), 
'matemáticas', 
'{"categoria": "educacion", "comunidad_autonoma": "aragon", "provincia": "zaragoza"}', 
true, NOW()),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario2@citypaj.es'), 
'piso compartido', 
'{"categoria": "vivienda", "subcategoria": "habitacion", "comunidad_autonoma": "cataluna", "provincia": "barcelona", "precio_max": 400}', 
true, NOW()),

(uuid_generate_v4(), (SELECT id FROM usuarios WHERE email = 'usuario3@citypaj.es'), 
'informatica', 
'{"categoria": "servicios", "subcategoria": "informatica", "comunidad_autonoma": "madrid"}', 
true, NOW());

-- Actualizar contadores de vistas para simular actividad
UPDATE anuncios SET vistas = FLOOR(RANDOM() * 100 + 10) WHERE estado_moderacion = 'approved';

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE 'Base de datos CityPaj inicializada con datos de ejemplo';
    RAISE NOTICE 'Usuarios creados: 5';
    RAISE NOTICE 'Anuncios creados: 10';
    RAISE NOTICE 'Imágenes creadas: 6';
    RAISE NOTICE 'Favoritos creados: 3';
    RAISE NOTICE 'Alertas creadas: 3';
    RAISE NOTICE 'Listo para usar!';
END $$;
