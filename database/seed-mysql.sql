-- Datos iniciales para CityPaj - Versión MySQL
-- Este archivo se ejecuta después del schema-mysql.sql

-- Insertar usuarios de prueba
INSERT INTO usuarios (id, email, nombre, password_hash, email_verificado, rol, comunidad_autonoma, provincia, creado) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@citypaj.es', 'Administrador CityPaj', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 1, 'admin', 'aragon', 'zaragoza', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'moderador@citypaj.es', 'Moderador Principal', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 1, 'moderador', 'aragon', 'zaragoza', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'usuario1@citypaj.es', 'Ana García', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 1, 'usuario', 'aragon', 'zaragoza', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'usuario2@citypaj.es', 'Carlos Ruiz', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 1, 'usuario', 'cataluna', 'barcelona', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'usuario3@citypaj.es', 'Laura Martínez', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 0, 'usuario', 'madrid', 'madrid', NOW());

-- Insertar anuncios de ejemplo
INSERT INTO anuncios (id, usuario_id, titulo, descripcion, categoria, subcategoria, comunidad_autonoma, provincia, barrio, precio, modalidad, contacto_email, contacto_telefono, contacto_anonimo, visible, estado_moderacion, creado) VALUES
-- Educación
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 
'Clases particulares de matemáticas', 
'Soy estudiante de 3º de Ingeniería Matemática y ofrezco clases particulares de matemáticas para estudiantes de ESO, Bachillerato y universitarios. Explicaciones claras, método adaptado a cada alumno, preparación para exámenes. Precio flexible según nivel y frecuencia. Disponibilidad tardes y fines de semana. Zona Universidad o a domicilio en Zaragoza capital.', 
'educacion', 'clases', 'aragon', 'zaragoza', 'centro', 15.00, 'servicio', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 2 DAY),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 
'Curso de inglés intensivo verano', 
'Academia de inglés con más de 10 años de experiencia ofrece curso intensivo de verano para todos los niveles. Grupos reducidos (máximo 8 alumnos), profesores nativos, material incluido. Preparación para exámenes oficiales (Cambridge, Trinity). Horario de lunes a viernes 9:00-13:00. Inicio: 1 de julio. ¡Plazas limitadas!', 
'educacion', 'cursos', 'cataluna', 'barcelona', 'eixample', 250.00, 'servicio', 1, 1, 0, 1, 'approved', NOW() - INTERVAL 1 DAY),

-- Empleo
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 
'Busco trabajo como camarero', 
'Joven de 22 años con experiencia de 1 año en sector hostelería busca trabajo como camarero en Madrid capital. Disponibilidad inmediata, horarios flexibles, fin de semana incluido. Responsable, rápido aprendizaje, buen trato con clientes. Referencias disponibles. Interesado en restaurantes, cafeterías o bares.', 
'empleo', 'busco', 'madrid', 'madrid', 'centro', 0, 'servicio', 1, 1, 0, 1, 'approved', NOW() - INTERVAL 3 HOUR),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 
'Se requiere programador web junior', 
'Empresa tecnológica en Zaragoza busca programador web junior para proyecto de 3 meses. Conocimientos requeridos: HTML, CSS, JavaScript, React. Se valorará conocimiento de Node.js y bases de datos. Formación continua, buen ambiente laboral, posibilidad de contrato posterior. Horario flexible 40h semanales.', 
'empleo', 'ofertas', 'aragon', 'zaragoza', 'actur', 1200.00, 'servicio', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 5 HOUR),

-- Vivienda
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 
'Habitación doble en piso compartido', 
'Se alquila habitación doble en piso compartido en Barcelona, zona Gracia. Piso reformado, 4 habitaciones, 2 baños, cocina totalmente equipada, salón comedor, terraza. Gastos incluidos (agua, luz, internet, gas). Cerca de metro L3 Fontana. Buscamos chico/a estudiante o joven trabajador, responsable y limpio. Disponible a partir de 1 de septiembre.', 
'vivienda', 'habitacion', 'cataluna', 'barcelona', 'gracia', 350.00, 'servicio', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 1 WEEK),

('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 
'Piso en venta en centro de Madrid', 
'Piso de 65m² en pleno centro de Madrid, zona Sol. 2 dormitorios, 1 baño, cocina independiente, salón comedor. 4ª planta con ascensor, exterior muy luminoso. Recientemente reformado, aire acondicionado, calefacción central. Ideal para inversión o primera vivienda. Cerca de transporte, tiendas y restaurantes. Trato directo con propietario, sin comisiones.', 
'vivienda', 'compra', 'madrid', 'madrid', 'centro', 285000.00, 'venta', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 2 WEEK),

-- Ocio
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 
'Guitarra eléctrica con amplificador', 
'Vendo guitarra eléctrica Fender Stratocaster color negro con amplificador practice 15W. Guitarra en excelente estado, cuerdas nuevas, incluye funda, púa y correa. Ideal para principiantes o intermedios. Sonido limpio y distorsionado. Motivo de venta: no tengo tiempo para tocar. Precio negociable.', 
'ocio', 'musica', 'aragon', 'zaragoza', 'romareda', 180.00, 'venta', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 4 DAY),

('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 
'Entradas concierto Coldplay', 
'Vendo 2 entradas para el concierto de Coldplay en Barcelona el próximo 15 de julio. Asientos en categoría 1, excelente visibilidad. No podré asistir por compromiso laboral. Entrega inmediata en Barcelona o envío por correo certificado. Precio original 120€ cada una, vendo por 90€.', 
'ocio', 'eventos', 'cataluna', 'barcelona', 'sants', 180.00, 'venta', 1, 1, 0, 1, 'approved', NOW() - INTERVAL 6 HOUR),

-- Servicios
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', 
'Diseño de logos y branding', 
'Diseñadora gráfico profesional ofrezco servicios de diseño de logos, identidad corporativa y branding. Experiencia de 5 años trabajando con startups y pequeñas empresas. Paquetes desde 150€. Incluye: concepto inicial, 3 propuestas, revisiones ilimitadas, archivos en todos los formatos. Portfolio disponible.', 
'servicios', 'diseño', 'madrid', 'madrid', 'malasaña', 150.00, 'servicio', 1, 0, 0, 1, 'approved', NOW() - INTERVAL 2 DAY),

('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 
'Fotografía para eventos y retratos', 
'Fotógrafo profesional con equipo propio ofrezco servicios de fotografía para eventos (bodas, cumpleaños, graduaciones) y retratos. Estudio propio o desplazamiento. Edición profesional incluida. Paquetes desde 200€. Consulta sin compromiso. Muestra de trabajos en Instagram.', 
'servicios', 'fotografia', 'aragon', 'zaragoza', 'casco antiguo', 200.00, 'servicio', 1, 1, 0, 1, 'approved', NOW() - INTERVAL 1 WEEK);

-- Insertar algunas imágenes de ejemplo
INSERT INTO imagenes (id, anuncio_id, url, orden, creado) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '/images/anuncios/guitarra-1.jpg', 0, NOW()),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '/images/anuncios/guitarra-2.jpg', 1, NOW()),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '/images/anuncios/piso-sala.jpg', 0, NOW()),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', '/images/anuncios/piso-dormitorio.jpg', 1, NOW()),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '/images/anuncios/piso-cocina.jpg', 2, NOW());

-- Insertar algunos favoritos de ejemplo
INSERT INTO favoritos (id, usuario_id, anuncio_id, creado) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', NOW()),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', NOW()),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440009', NOW());
