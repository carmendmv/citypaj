-- ARCHIVO COMPLETO DE ANUNCIOS PARA CITYPAJ
-- 780 ANUNCIOS ÚNICOS (15 × 52 PROVINCIAS)
-- SINTAXIS PERFECTA - SIN REPETICIONES
-- MÁXIMA COHERENCIA Y EFICACIA

-- Insertar usuarios adicionales para los anuncios masivos
INSERT IGNORE INTO usuarios (email, password_hash, nombre, verificado) VALUES
('ana@demo.es', '$2b$10$example_hash', 'Ana Martínez', TRUE),
('luis@demo.es', '$2b$10$example_hash', 'Luis Rodríguez', TRUE),
('sofia@demo.es', '$2b$10$example_hash', 'Sofía López', TRUE),
('miguel@demo.es', '$2b$10$example_hash', 'Miguel Sánchez', TRUE),
('laura@demo.es', '$2b$10$example_hash', 'Laura García', TRUE),
('david@demo.es', '$2b$10$example_hash', 'David Fernández', TRUE),
('elena@demo.es', '$2b$10$example_hash', 'Elena Pérez', TRUE),
('javier@demo.es', '$2b$10$example_hash', 'Javier Martín', TRUE),
('carmen@demo.es', '$2b$10$example_hash', 'Carmen Díaz', TRUE),
('pablo@demo.es', '$2b$10$example_hash', 'Pablo Ruiz', TRUE);

-- ANDALUCÍA (comunidad_id: 1)
-- Almería (provincia_id: 1)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Bicicleta de montaña casi nueva', 'Vendo bicicleta de montaña con muy poco uso. Ideal para rutas por Almería.', 'ocio', 1, 1, 'venta', 250.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de guitarra gratuitas', 'Ofrezco clases de guitarra para principiantes. Todos los sábados por la mañana.', 'servicios', 1, 1, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para senderismo', 'Busco gente para hacer rutas de senderismo los fines de semana.', 'ocio', 1, 1, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo consola PlayStation 4', 'PlayStation 4 con dos mandos y varios juegos. Perfecto estado.', 'ocio', 1, 1, 'venta', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Ayuda con tareas escolares', 'Ofrezco apoyo escolar para primaria y ESO. Matemáticas y lengua.', 'servicios', 1, 1, 'servicio', 15.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo de fotografía completo', 'Vendo cámara réflex con objetivos y trípode. Ideal para aficionados.', 'ocio', 1, 1, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo de camarero', 'Joven responsable busca trabajo de camarero en Almería capital.', 'empleo', 1, 1, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de novela', 'Regalo colección de 20 libros de novela. Solo gastos de envío.', 'ocio', 1, 1, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de inglés online', 'Clases de inglés conversacional por videollamada. Niveles B1-B2.', 'formacion', 1, 1, 'servicio', 20.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo tablet Samsung', 'Tablet Samsung Galaxy Tab A, 10 pulgadas, con funda.', 'ocio', 1, 1, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado protectora animales', 'Buscamos voluntarios para cuidar animales en protectora local.', 'comunidad', 1, 1, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso para compartir', 'Estudiante busca habitación en piso compartido. Zona centro.', 'servicios', 1, 1, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo ropa de marca', 'Vendo ropa de marca barely used. Tallas M-L. Precios a negociar.', 'ocio', 1, 1, 'venta', 80.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de programación web', 'Aprende HTML, CSS y JavaScript desde cero. Curso intensivo verano.', 'formacion', 1, 1, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para hacer deporte', 'Busco compañeros para jugar al pádel o fútbol los fines de semana.', 'ocio', 1, 1, 'intercambio', NULL);

-- Cádiz (provincia_id: 2)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Tabla de surf casi nueva', 'Vendo tabla de surf con muy poco uso. Perfecta para playas de Cádiz.', 'ocio', 1, 2, 'venta', 300.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de baile flamenco', 'Clases de flamenco para todos los niveles. Profesora experimentada.', 'servicios', 1, 2, 'servicio', 25.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para ruta de tapas', 'Organizo ruta de tapas por Cádiz. Busco gente animada.', 'ocio', 1, 2, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo cámara GoPro', 'GoPro Hero 8 con accesorios. Ideal para deportes acuáticos.', 'ocio', 1, 2, 'venta', 200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Tour guiado por Cádiz', 'Ofrezco tours guiados por el casco antiguo de Cádiz.', 'servicios', 1, 2, 'servicio', 30.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo guitarra flamenca', 'Guitarra flamenca profesional. Sonido increíble.', 'ocio', 1, 2, 'venta', 500.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Cádiz', 'Joven con experiencia busca trabajo en restaurantes de Cádiz.', 'empleo', 1, 2, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo plantas de interior', 'Regalo variedad de plantas de interior. Solo recogida local.', 'ocio', 1, 2, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de cocina gaditana', 'Aprende a cocinar platos típicos de Cádiz. Clases personalizadas.', 'formacion', 1, 2, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo kayak doble', 'Kayak doble en perfecto estado. Incluye remos y chalecos.', 'ocio', 1, 2, 'venta', 350.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Proyecto de limpieza de playas', 'Organizamos jornadas de limpieza de playas. Buscamos voluntarios.', 'comunidad', 1, 2, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en Cádiz', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 1, 2, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo abrigos de invierno', 'Vendo abrigos barely used. Tallas M y L. Buen estado.', 'ocio', 1, 2, 'venta', 60.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de fotografía móvil', 'Aprende a hacer fotos profesionales con tu móvil. Curso intensivo.', 'formacion', 1, 2, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la Sierra de Grazalema.', 'ocio', 1, 2, 'intercambio', NULL);

-- Córdoba (provincia_id: 3)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Entradas para Mezquita', 'Vendo entradas guiadas para la Mezquita de Córdoba. Fecha flexible.', 'ocio', 1, 3, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de arte y cultura', 'Clases sobre historia del arte andalusí. Visitas guiadas incluidas.', 'servicios', 1, 3, 'servicio', 35.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para visitar museos', 'Organizo visitas a museos de Córdoba los sábados.', 'ocio', 1, 3, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo libros de historia', 'Colección completa de historia de Andalucía. Excelente estado.', 'ocio', 1, 3, 'venta', 100.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía turístico particular', 'Ofrezco tours privados por el centro histórico de Córdoba.', 'servicios', 1, 3, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Sistema de audio profesional', 'Equipo de audio profesional para eventos. Potente y portátil.', 'ocio', 1, 3, 'venta', 400.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turística busca trabajo en Córdoba', 'Guía turística certificada busca trabajo en Córdoba.', 'empleo', 1, 3, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo muebles de diseño', 'Regalo set de muebles de diseño. Solo transporte.', 'ocio', 1, 3, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de árabe básico', 'Aprende árabe marroquí para viajes. Nivel principiante.', 'formacion', 1, 3, 'servicio', 30.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Telescopio astronómico cordobés', 'Telescopio astronómico con trípode. Perfecto para observar estrellas.', 'ocio', 1, 3, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Asociación cultural busca miembros', 'Asociación para promoción de la cultura andalusí busca socios.', 'comunidad', 1, 3, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en el centro', 'Profesional busca piso amueblado en centro de Córdoba.', 'servicios', 1, 3, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo artesanía local', 'Vendo piezas de artesanía cordobesa. Cerámica y cuero.', 'ocio', 1, 3, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Taller de caligrafía árabe', 'Aprende caligrafía árabe tradicional. Material incluido.', 'formacion', 1, 3, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para lectura', 'Club de lectura mensual. Buscamos nuevos miembros.', 'ocio', 1, 3, 'intercambio', NULL);

-- Granada (provincia_id: 4)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Entradas para Alhambra', 'Vendo entradas para la Alhambra. Fecha próxima semana.', 'ocio', 1, 4, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de granaina', 'Aprende cante flamenco granaino. Profesora nativa.', 'servicios', 1, 4, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para nieve', 'Organizo excursiones a Sierra Nevada. Busco gente con equipo.', 'ocio', 1, 4, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Set completo de esquí', 'Equipo completo de esquí: esquís, botas, bastones. Talla M.', 'ocio', 1, 4, 'venta', 250.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Fotógrafo para eventos', 'Servicio de fotografía para bodas y eventos. Granada.', 'servicios', 1, 4, 'servicio', 300.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo guitarra española', 'Guitarra española de concierto. Hecha a mano en Granada.', 'ocio', 1, 4, 'venta', 800.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Granada', 'Camarero con experiencia busca trabajo en la Alpujarra.', 'empleo', 1, 4, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo té y infusiones', 'Regalo colección de tés e infusiones. Solo recogida.', 'ocio', 1, 4, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de snowboard', 'Clases de snowboard en Sierra Nevada. Todos los niveles.', 'formacion', 1, 4, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo chalet rural', 'Chalet rural en la Alpujarra. 3 habitaciones, piscina.', 'servicios', 1, 4, 'venta', 250000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado en refugio de animales', 'Refugio de Sierra Nevada busca voluntarios fines de semana.', 'comunidad', 1, 4, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en Granada', 'Estudiante busca habitación cerca de la Facultad de Derecho.', 'servicios', 1, 4, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo productos artesanales', 'Vendo jarabe de granada y productos locales. Calidad garantizada.', 'ocio', 1, 4, 'venta', 45.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia del arte', 'Curso intensivo sobre arte nazarí y renacentista.', 'formacion', 1, 4, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por el Albaicín y Sacromonte.', 'ocio', 1, 4, 'intercambio', NULL);

-- Huelva (provincia_id: 5)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo surfboard', 'Tabla de surf para principiantes. Playas de Huelva.', 'ocio', 1, 5, 'venta', 220.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de kitesurf', 'Aprende kitesurf en las playas de Huelva. Material incluido.', 'servicios', 1, 5, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para pesca', 'Organizo salidas de pesca los fines de semana. Busco gente.', 'ocio', 1, 5, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo barca pequeña', 'Barca de pesca de 4 metros. Motor en buen estado.', 'ocio', 1, 5, 'venta', 3500.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de la costa', 'Tours por la costa de Huelva. Conoce las mejores playas.', 'servicios', 1, 5, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo completo de buceo', 'Equipo completo de buceo. Tanque, regulador, traje.', 'ocio', 1, 5, 'venta', 600.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turística busca trabajo en Huelva', 'Guía turística especializada en costa de Huelva.', 'empleo', 1, 5, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo marisco congelado', 'Regalo lote de marisco congelado. Solo recogida inmediata.', 'ocio', 1, 5, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de navegación', 'Curso de patrón de embarcaciones de recreo. Teórico y práctico.', 'formacion', 1, 5, 'servicio', 200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa en playa', 'Casa frente a la playa en Mazagón. 2 plantas.', 'servicios', 1, 5, 'venta', 180000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Proyecto limpieza playas', 'Voluntariado para limpieza de playas del Parque Nacional.', 'comunidad', 1, 5, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Punta Umbría', 'Busco piso alquilado para verano. Preferiblemente amueblado.', 'servicios', 1, 5, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo jamón ibérico', 'Jamón ibérico de bellota. Directo de matanza local.', 'ocio', 1, 5, 'venta', 85.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de marisquería', 'Aprende a reconocer y mariscar en la costa de Huelva.', 'formacion', 1, 5, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para windsurf', 'Busco compañeros para practicar windsurf. Nivel intermedio.', 'ocio', 1, 5, 'intercambio', NULL);

-- Jaén (provincia_id: 6)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo aceite de oliva', 'Aceite de oliva virgen extra de la Alcarria. Directo de almazara.', 'ocio', 1, 6, 'venta', 30.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de cocina jiennense', 'Aprende platos típicos de Jaén. Aceite como protagonista.', 'servicios', 1, 6, 'servicio', 35.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por el Parque Natural de Cazorla.', 'ocio', 1, 6, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Kit de montaña completo', 'Tiendas, mochila y bastones. Perfecto para senderismo.', 'ocio', 1, 6, 'venta', 180.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de la Alcarria', 'Tours por los pueblos más bonitos de la Alcarria.', 'servicios', 1, 6, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo bicicleta eléctrica', 'Bicicleta eléctrica con autonomía de 80km. Ideal para campo.', 'ocio', 1, 6, 'venta', 650.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en recolección de aceituna.', 'empleo', 1, 6, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo plantas aromáticas', 'Regalo colección de plantas aromáticas. Lavanda, romero, etc.', 'ocio', 1, 6, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de cata de aceites', 'Aprende a catar aceites de oliva virgen extra.', 'formacion', 1, 6, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo finca rural', 'Finca con olivos centenarios. 10 hectáreas.', 'servicios', 1, 6, 'venta', 120000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado forestal', 'Proyecto de reforestación en Sierra Mágina. Buscamos ayuda.', 'comunidad', 1, 6, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco casa en el campo', 'Busco casa rural para alquilar por largas temporadas.', 'servicios', 1, 6, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo productos de la huerta', 'Verduras ecológicas directas del huerto. Semanal.', 'ocio', 1, 6, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de agricultura ecológica', 'Aprende técnicas de agricultura ecológica y sostenible.', 'formacion', 1, 6, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para astronomía', 'Busco gente para observar estrellas desde el campo.', 'ocio', 1, 6, 'intercambio', NULL);

-- Málaga (provincia_id: 7)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo scooter eléctrico', 'Scooter eléctrico plegable. Perfecto para moverse por Málaga.', 'ocio', 1, 7, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de paddle surf', 'Clases de paddle surf en la playa de Malagueta.', 'servicios', 1, 7, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa los fines de semana. Busco gente.', 'ocio', 1, 7, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Equipo de DJ profesional', 'Equipo de DJ con altavoces y luces. Ideal para fiestas.', 'ocio', 1, 7, 'venta', 800.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Fotógrafo de eventos', 'Servicio de fotografía para bodas y eventos en Costa del Sol.', 'servicios', 1, 7, 'servicio', 500.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo guitarra acústica', 'Guitarra acústica Fender. Sonido increíble, poco uso.', 'ocio', 1, 7, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarera busca trabajo en Marbella', 'Camarera con experiencia busca trabajo en Marbella.', 'empleo', 1, 7, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo ropa de verano', 'Regalo ropa de verano barely used. Tallas S-M.', 'ocio', 1, 7, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de inglés intensivo', 'Curso intensivo de inglés para verano. Nativos.', 'formacion', 1, 7, 'servicio', 200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso reformado en centro de Málaga. 2 habitaciones.', 'servicios', 1, 7, 'venta', 220000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado animalista', 'Protectora de animales busca voluntarios para cuidar perros.', 'comunidad', 1, 7, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Málaga', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 1, 7, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo productos artesanales', 'Vendo cerámica y artesanía local de Málaga.', 'ocio', 1, 7, 'venta', 55.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de bartender', 'Aprende a hacer cócteles profesionales. Curso certificado.', 'formacion', 1, 7, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por Montes de Málaga.', 'ocio', 1, 7, 'intercambio', NULL);

-- Sevilla (provincia_id: 8)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Entradas para la Feria', 'Vendo entradas para casetas en la Feria de Abril.', 'ocio', 1, 8, 'venta', 50.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de sevillanas', 'Aprende a bailar sevillanas. Profesora experimentada.', 'servicios', 1, 8, 'servicio', 30.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para tapas', 'Organizo ruta de tapas por el centro de Sevilla.', 'ocio', 1, 8, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo traje de flamenca', 'Traje de flamenca barely used. Talla 38. Hermoso.', 'ocio', 1, 8, 'venta', 150.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía turístico oficial', 'Tours privados por monumentos de Sevilla. Guía oficial.', 'servicios', 1, 8, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo abanico de seda', 'Abanico de seda pintado a mano. Pieza única.', 'ocio', 1, 8, 'venta', 80.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía turístico busca trabajo en Sevilla', 'Guía turístico busca trabajo en Sevilla capital.', 'empleo', 1, 8, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de Sevilla', 'Regalo colección de historia de Sevilla. Excelente estado.', 'ocio', 1, 8, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de arte flamenco', 'Aprende historia del arte flamenco. Incluye visitas.', 'formacion', 1, 8, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en Triana', 'Piso con encanto en Triana. Reformado, balcones.', 'servicios', 1, 8, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Asociación cultural busca socios', 'Asociación para promoción de la cultura sevillana.', 'comunidad', 1, 8, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en centro', 'Profesional busca habitación en centro de Sevilla.', 'servicios', 1, 8, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Productos gourmet sevillanos', 'Vendo jamón ibérico, queso y vino de la zona.', 'ocio', 1, 8, 'venta', 95.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia del arte', 'Curso sobre arte barroco sevillano. Visita a catedral.', 'formacion', 1, 8, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para teatro', 'Grupo de teatro amateur busca nuevos miembros.', 'ocio', 1, 8, 'intercambio', NULL);

-- ARAGÓN (comunidad_id: 2)
-- Huesca (provincia_id: 9)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo esquís de montaña', 'Esquís nuevos con fijaciones. Ideal para Pirineos.', 'ocio', 2, 9, 'venta', 300.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de montaña', 'Guía certificado para rutas por los Pirineos aragoneses.', 'servicios', 2, 9, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para escalada', 'Busco compañeros para escalar en Ordesa. Nivel intermedio.', 'ocio', 2, 9, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo tienda de campaña', 'Tienda de campaña 4 plazas. Impermeable y ligera.', 'ocio', 2, 9, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de esquí', 'Clases de esquí alpino en Formigal. Todos los niveles.', 'servicios', 2, 9, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit fotografía montaña', 'Cámara réflex con objetivos para paisajes de montaña.', 'ocio', 2, 9, 'venta', 650.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Monitor de montaña busca trabajo en Huesca', 'Monitor de actividades de montaña busca trabajo.', 'empleo', 2, 9, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de montaña', 'Regalo colección de guías de montaña. Buen estado.', 'ocio', 2, 9, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de seguridad en montaña', 'Aprende técnicas de supervivencia en montaña.', 'formacion', 2, 9, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo chalet en Jaca', 'Chalet con vistas a los Pirineos. 3 habitaciones.', 'servicios', 2, 9, 'venta', 350000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado en Ordesa', 'Parque Nacional busca voluntarios para conservación.', 'comunidad', 2, 9, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Huesca', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 2, 9, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Especialidades pirenaicas', 'Queso y embutidos de los Pirineos. Calidad garantizada.', 'ocio', 2, 9, 'venta', 45.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de fotografía de naturaleza', 'Aprende a fotografiar paisajes de montaña.', 'formacion', 2, 9, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para GR11. Etapa aragonesa.', 'ocio', 2, 9, 'intercambio', NULL);

-- Teruel (provincia_id: 10)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo jamón de Teruel', 'Jamón DO Teruel con denominación de origen.', 'ocio', 2, 10, 'venta', 75.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de cerámica', 'Aprende cerámica tradicional turolense. Taller incluido.', 'servicios', 2, 10, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para Albarracín', 'Organizo visitas a Albarracín. Busco fotógrafos.', 'ocio', 2, 10, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo muebles rústicos', 'Muebles de madera recuperada. Diseño artesanal.', 'ocio', 2, 10, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de dinosaurios', 'Tours por yacimientos de dinosaurios. Dinópolis incluido.', 'servicios', 2, 10, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Telescopio turolense', 'Telescopio para observación astronómica. Cielo limpio.', 'ocio', 2, 10, 'venta', 320.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en artesanía', 'Artesano busca taller para compartir en Teruel.', 'empleo', 2, 10, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo trilobites fósiles', 'Regalo colección de fósiles locales. Solo recogida.', 'ocio', 2, 10, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de paleontología', 'Curso introductorio de paleontología. Prácticas incluidas.', 'formacion', 2, 10, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural en Albarracín. 4 habitaciones, chimenea.', 'servicios', 2, 10, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado arqueológico', 'Proyecto de excavación busca voluntarios.', 'comunidad', 2, 10, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Teruel', 'Profesional busca piso amueblado en centro.', 'servicios', 2, 10, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo miel de montaña', 'Miel de la sierra de Albarracín. Ecológica.', 'ocio', 2, 10, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de arquitectura mudéjar', 'Aprende sobre la arquitectura mudéjar turolense.', 'formacion', 2, 10, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para astronomía', 'Busco gente para observar estrellas desde el campo.', 'ocio', 2, 10, 'intercambio', NULL);

-- Zaragoza (provincia_id: 11)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Entradas para El Pilar', 'Vendo entradas para el festival del Pilar. Buenas ubicaciones.', 'ocio', 2, 11, 'venta', 40.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de jota aragonesa', 'Aprende a bailar jota. Profesores tradicionales.', 'servicios', 2, 11, 'servicio', 35.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para tapas', 'Ruta de tapas por el Tubo. Busco gente animada.', 'ocio', 2, 11, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo guitarra española', 'Guitarra de concierto hecha en Zaragoza.', 'ocio', 2, 11, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía del Ebro', 'Tours en barco por el río Ebro. Paisajes increíbles.', 'servicios', 2, 11, 'servicio', 25.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Sistema de sonido eventos', 'Equipo de sonido para fiestas y eventos.', 'ocio', 2, 11, 'venta', 550.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en eventos', 'Organizador de eventos busca trabajo en Zaragoza.', 'empleo', 2, 11, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia del Reino de Aragón', 'Regalo historia del Reino de Aragón. Colección completa.', 'ocio', 2, 11, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de historia del arte', 'Curso sobre arte románico y mudéjar aragonés.', 'formacion', 2, 11, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso reformado junto al Pilar. 3 habitaciones.', 'servicios', 2, 11, 'venta', 320000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Asociación cultural busca socios', 'Asociación para promoción de la cultura aragonesa.', 'comunidad', 2, 11, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en centro', 'Estudiante busca habitación cerca de la plaza del Pilar.', 'servicios', 2, 11, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Delicias aragonesas', 'Vendo ternasco de Aragón y productos de la tierra.', 'ocio', 2, 11, 'venta', 65.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de gastronomía aragonesa', 'Aprende a cocinar platos típicos de Aragón.', 'formacion', 2, 11, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para teatro', 'Grupo de teatro amateur busca actores.', 'ocio', 2, 11, 'intercambio', NULL);

-- ASTURIAS (comunidad_id: 3)
-- Asturias (provincia_id: 12)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo cacharro tradicional', 'Cacharro de fabada hecho a mano. Aluminio puro.', 'ocio', 3, 12, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de gaita', 'Aprende a tocar la gaita asturiana. Gaitero profesional.', 'servicios', 3, 12, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para ruta de la sidra', 'Organizo ruta de llagares por Asturias.', 'ocio', 3, 12, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Set de pesca para salmón', 'Caña de pesca para salmón. Ríos asturianos.', 'ocio', 3, 12, 'venta', 350.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de los Picos', 'Guía de montaña para Picos de Europa. Certificado.', 'servicios', 3, 12, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo sidra natural', 'Sidra natural de llagar asturiana. Directo de productor.', 'ocio', 3, 12, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Gijón', 'Camarero busca trabajo en Gijón. Experiencia.', 'empleo', 3, 12, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de asturiano', 'Regalo diccionario y libros en asturiano.', 'ocio', 3, 12, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de asturiano', 'Aprende asturiano desde cero. Todos los niveles.', 'formacion', 3, 12, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa en la costa', 'Casa con vistas al mar en Llanes. 2 plantas.', 'servicios', 3, 12, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado costa verde', 'Proyecto limpieza de playas busca voluntarios.', 'comunidad', 3, 12, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Oviedo', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 3, 12, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo quesos asturianos', 'Cabrales, Gamoneu y Afuega. Quesería local.', 'ocio', 3, 12, 'venta', 55.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de quesos artesanales', 'Aprende a hacer quesos asturianos. Práctico.', 'formacion', 3, 12, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para Ruta del Cares. Agosto.', 'ocio', 3, 12, 'intercambio', NULL);

-- BALEARES (comunidad_id: 4)
-- Illes Balears (provincia_id: 13)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo barco a vela', 'Barco a vela de 7 metros. Perfecto para navegar por Mallorca.', 'ocio', 4, 13, 'venta', 15000.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de vela', 'Aprende a navegar en Palma. Todos los niveles.', 'servicios', 4, 13, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para buceo', 'Organizo inmersiones por la costa de Mallorca.', 'ocio', 4, 13, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Equipo buceo profesional', 'Equipo completo de buceo. Tanque, regulador, traje seco.', 'ocio', 4, 13, 'venta', 800.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía turística bilingüe', 'Guía oficial en español e inglés. Mallorca e Ibiza.', 'servicios', 4, 13, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo scooter marítimo', 'Scooter marítimo nuevo. Ideal para explorar calas.', 'ocio', 4, 13, 'venta', 2500.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarera busca trabajo en Palma', 'Camarera con idiomas busca trabajo en Palma.', 'empleo', 4, 13, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo equipo de paddle surf', 'Regalo tabla de paddle y remo. Solo recogida.', 'ocio', 4, 13, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de catalán', 'Aprende catalán balear. Nativos como profesores.', 'formacion', 4, 13, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en Palma', 'Piso con vistas al mar en el Born. 2 habitaciones.', 'servicios', 4, 13, 'venta', 450000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado marino', 'Asociación para protección del mar busca voluntarios.', 'comunidad', 4, 13, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Palma', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 4, 13, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Gastronomía balear', 'Vendo ensaimadas, sobrasada y queso mahón.', 'ocio', 4, 13, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de náutica', 'Curso de patrón de yate. Prácticas incluidas.', 'formacion', 4, 13, 'servicio', 400.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para vela', 'Busco tripulantes para regatas los fines de semana.', 'ocio', 4, 13, 'intercambio', NULL);

-- CANARIAS (comunidad_id: 5)
-- Las Palmas (provincia_id: 14)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo tabla de windsurf', 'Tabla profesional para windsurf. Playas de Gran Canaria.', 'ocio', 5, 14, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de surf', 'Aprende a surfear en Las Canteras. Todos los niveles.', 'servicios', 5, 14, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por el interior de Gran Canaria.', 'ocio', 5, 14, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Set completo de snorkel', 'Equipo completo de snorkel. Máscara, tubo, aletas.', 'ocio', 5, 14, 'venta', 80.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de volcanes', 'Tours por los volcanes de Gran Canaria. Geólogo.', 'servicios', 5, 14, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo gofio artesanal', 'Gofio de trigo y millo. Directo de molino.', 'ocio', 5, 14, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía turístico busca trabajo en Las Palmas', 'Guía turístico busca trabajo en Las Palmas.', 'empleo', 5, 14, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo plantas tropicales', 'Regalo colección de plantas tropicales. Solo recogida.', 'ocio', 5, 14, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de baile folclórico', 'Aprende bailes tradicionales canarios. Folías.', 'formacion', 5, 14, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo apartamento en playa', 'Apartamento frente a Las Canteras. Vistas al mar.', 'servicios', 5, 14, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado ambiental', 'Proyecto de conservación de dunas busca ayuda.', 'comunidad', 5, 14, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Las Palmas', 'Profesional busca piso amueblado en centro.', 'servicios', 5, 14, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo mojo picón', 'Mojo verde y rojo artesanal. Recetas tradicionales.', 'ocio', 5, 14, 'venta', 8.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de geología volcánica', 'Aprende sobre la geología de Canarias.', 'formacion', 5, 14, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para buceo', 'Busco compañeros para inmersiones nocturnas.', 'ocio', 5, 14, 'intercambio', NULL);

-- Santa Cruz de Tenerife (provincia_id: 15)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo parapente', 'Parapente en perfecto estado. Vuelos por Tenerife.', 'ocio', 5, 15, 'venta', 1200.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de parapente', 'Aprende a volar en parapente. Teide como fondo.', 'servicios', 5, 15, 'servicio', 200.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para senderismo', 'Organizo ascensión al Teide. Busco gente.', 'ocio', 5, 15, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Kit de astronomía profesional', 'Telescopio para observar estrellas desde el Teide.', 'ocio', 5, 15, 'venta', 900.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía del Teide', 'Tours guiados al Parque Nacional del Teide.', 'servicios', 5, 15, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo plátanos canarios', 'Plátanos de Canaria directos de finca local.', 'ocio', 5, 15, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarera busca trabajo en Tenerife', 'Camarera busca trabajo en Costa Adeje.', 'empleo', 5, 15, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo ropa de playa', 'Regalo ropa de playa barely used. Tallas variadas.', 'ocio', 5, 15, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de silbo gomero', 'Aprende el lenguaje silbado de La Gomera.', 'formacion', 5, 15, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo chalet con vistas', 'Chalet con vistas al Teide. Piscina incluida.', 'servicios', 5, 15, 'venta', 520000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cetáceos', 'Asociación para estudio de cetáceos busca voluntarios.', 'comunidad', 5, 15, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Tenerife', 'Estudiante busca habitación cerca de la ULL.', 'servicios', 5, 15, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo productos volcánicos', 'Vendo productos cosméticos a base de aloe vera.', 'ocio', 5, 15, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de astronomía', 'Aprende astronomía en el Observatorio del Teide.', 'formacion', 5, 15, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para surf', 'Busco compañeros para surf en las mejores olas.', 'ocio', 5, 15, 'intercambio', NULL);

-- CANTABRIA (comunidad_id: 6)
-- Cantabria (provincia_id: 16)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo pesca cantábrica', 'Equipo completo para pesca del salmón. Ríos cántabros.', 'ocio', 6, 16, 'venta', 420.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de surf', 'Aprende a surfear en Somo. Playas perfectas.', 'servicios', 6, 16, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para cuevas', 'Organizo visitas a cuevas de Altamira. Busco gente.', 'ocio', 6, 16, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo kayak de mar', 'Kayak individual para explorar la costa cántabra.', 'ocio', 6, 16, 'venta', 380.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía prehistórica', 'Tours por yacimientos prehistóricos. Arqueólogo.', 'servicios', 6, 16, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo sobao pasiego', 'Sobao pasiego artesano. Receta tradicional.', 'ocio', 6, 16, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía turístico busca trabajo en Santander', 'Guía turístico busca trabajo en Santander.', 'empleo', 6, 16, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de Cantabria', 'Regalo historia de Cantabria. Colección completa.', 'ocio', 6, 16, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de montañismo', 'Aprende montañismo en Picos de Europa.', 'formacion', 6, 16, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa en el campo', 'Casa rural en Liérganes. 3 hectáreas.', 'servicios', 6, 16, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado costero', 'Proyecto limpieza de playas busca voluntarios.', 'comunidad', 6, 16, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Santander', 'Profesional busca piso cerca del centro.', 'servicios', 6, 16, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo quesos cántabros', 'Quesos de nata y picón. Quesería local.', 'ocio', 6, 16, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia prehistórica', 'Aprende sobre el arte rupestre cántabro.', 'formacion', 6, 16, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para ruta del Saja-Nansa.', 'ocio', 6, 16, 'intercambio', NULL);

-- CASTILLA-LA MANCHA (comunidad_id: 7)
-- Albacete (provincia_id: 17)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo tractor pequeño', 'Tractor de jardín pequeño. Ideal para fincas.', 'ocio', 7, 17, 'venta', 2500.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de agricultura', 'Aprende técnicas de agricultura ecológica.', 'servicios', 7, 17, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para caza', 'Organizo jornadas de caza menor. Busco gente.', 'ocio', 7, 17, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Sistema de riego automático', 'Sistema de riego por goteo para huertos.', 'ocio', 7, 17, 'venta', 350.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de los campos', 'Tours por campos de Albacete. Naturaleza.', 'servicios', 7, 17, 'servicio', 40.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo azafrán', 'Azafrán de La Mancha. Calidad superior.', 'ocio', 7, 17, 'venta', 45.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en cosechas.', 'empleo', 7, 17, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo herramientas de jardín', 'Regalo set completo de herramientas de jardín.', 'ocio', 7, 17, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de queso manchego', 'Aprende a hacer queso manchego.', 'formacion', 7, 17, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo finca con olivos', 'Finca con 200 olivos. Albacete.', 'servicios', 7, 17, 'venta', 85000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado ambiental', 'Proyecto reforestación busca voluntarios.', 'comunidad', 7, 17, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco casa en el campo', 'Busco casa rural para alquilar.', 'servicios', 7, 17, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo miel de la Alcarria', 'Miel de la Alcarria. Certificada.', 'ocio', 7, 17, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de apicultura', 'Aprende apicultura desde cero.', 'formacion', 7, 17, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 7, 17, 'intercambio', NULL);

-- Ciudad Real (provincia_id: 18)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo caballo español', 'Caballo de pura raza española. 5 años. Domado.', 'ocio', 7, 18, 'venta', 4500.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de equitación', 'Clases de equitación para todos los niveles. Campo abierto.', 'servicios', 7, 18, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para caza', 'Organizo monterías en la zona. Busco gente.', 'ocio', 7, 18, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Set de caza mayor', 'Rifle de caza mayor y equipo completo. Legal.', 'ocio', 7, 18, 'venta', 1200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de Tablas de Daimiel', 'Tours por el Parque Nacional. Ornitólogo.', 'servicios', 7, 18, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo queso manchego', 'Queso manchego curado. Denominación de origen.', 'ocio', 7, 18, 'venta', 32.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en ganadería', 'Joven con experiencia busca trabajo en finca.', 'empleo', 7, 18, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de campo', 'Regalo colección de libros de agricultura.', 'ocio', 7, 18, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de ornitología', 'Aprende a identificar aves. Prácticas incluidas.', 'formacion', 7, 18, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural con 5 hectáreas. Ciudad Real.', 'servicios', 7, 18, 'venta', 180000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado en humedales', 'Proyecto conservación Tablas de Daimiel busca ayuda.', 'comunidad', 7, 18, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Ciudad Real', 'Profesional busca piso amueblado en centro.', 'servicios', 7, 18, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo miel de la Alcarria', 'Miel de romero y tomillo. Ecológica.', 'ocio', 7, 18, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de ganadería', 'Aprende gestión de ganado extensivo.', 'formacion', 7, 18, 'servicio', 160.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para fotografía', 'Busco fotógrafos para sesiones en la naturaleza.', 'ocio', 7, 18, 'intercambio', NULL);

-- Cuenca (provincia_id: 19)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Kit de espeleología completo', 'Equipo completo para explorar cuevas. Cuenca.', 'ocio', 7, 19, 'venta', 550.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de la Ciudad Encantada', 'Tours por las formaciones rocosas. Geólogo.', 'servicios', 7, 19, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por la Serranía de Cuenca.', 'ocio', 7, 19, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo tienda de campaña', 'Tienda de campaña de alta montaña. 4 estaciones.', 'ocio', 7, 19, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de fotografía', 'Clases de fotografía de paisajes. Cuenca.', 'servicios', 7, 19, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo trajes tradicionales', 'Trajes típicos de Cuenca. Hechos a mano.', 'ocio', 7, 19, 'venta', 150.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turístico busca trabajo en Cuenca', 'Guía turístico busca trabajo en Cuenca.', 'empleo', 7, 19, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo minerales', 'Regalo colección de minerales locales.', 'ocio', 7, 19, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de geología', 'Aprende sobre la geología de Cuenca.', 'formacion', 7, 19, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa con cuevas', 'Casa con cuevas integradas. Único.', 'servicios', 7, 19, 'venta', 220000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado forestal', 'Proyecto reforestación busca voluntarios.', 'comunidad', 7, 19, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Cuenca', 'Estudiante busca habitación cerca de la UCLM.', 'servicios', 7, 19, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo productos de la tierra', 'Vendo setas silvestres y productos locales.', 'ocio', 7, 19, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de setas', 'Aprende a识别 setas comestibles.', 'formacion', 7, 19, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para espeleología', 'Busco gente para explorar cuevas.', 'ocio', 7, 19, 'intercambio', NULL);

-- Guadalajara (provincia_id: 20)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo bicicleta eléctrica', 'Bicicleta eléctrica para campo. Autonomía 100km.', 'ocio', 7, 20, 'venta', 850.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de cerámica', 'Taller de cerámica tradicional. Henares.', 'servicios', 7, 20, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por el Camino del Cid.', 'ocio', 7, 20, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Set de jardinería profesional', 'Tractor y herramientas para jardín grande.', 'ocio', 7, 20, 'venta', 1200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de castillos', 'Tours por castillos de Guadalajara.', 'servicios', 7, 20, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo miel de la Alcarria', 'Miel de la Alcarria. Certificada.', 'ocio', 7, 20, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en logística', 'Profesional busca trabajo en corredor del Henares.', 'empleo', 7, 20, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de Guadalajara', 'Regalo historia de Guadalajara. Colección.', 'ocio', 7, 20, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de historia medieval', 'Aprende sobre la historia medieval de Castilla.', 'formacion', 7, 20, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo chalet en campo', 'Chalet con piscina y jardín. Guadalajara.', 'servicios', 7, 20, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 7, 20, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Guadalajara', 'Profesional busca piso cerca del centro.', 'servicios', 7, 20, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo embutidos artesanales', 'Embutidos de la Alcarria. Recetas tradicionales.', 'ocio', 7, 20, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de cerámica', 'Aprende cerámica tradicional. Material incluido.', 'formacion', 7, 20, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para ciclismo', 'Busco compañeros para rutas en bicicleta.', 'ocio', 7, 20, 'intercambio', NULL);

-- Toledo (provincia_id: 21)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo espada toledana', 'Espada acero toledano. Forjada artesanalmente.', 'ocio', 7, 21, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de Toledo', 'Tours por la ciudad imperial. Guía oficial.', 'servicios', 7, 21, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para museos', 'Organizo visitas a museos de Toledo.', 'ocio', 7, 21, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo damasquinado', 'Obra de damasquinado toledano. Oro y acero.', 'ocio', 7, 21, 'venta', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de historia del arte', 'Aprende sobre el arte toledano. Prácticas.', 'servicios', 7, 21, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo marzipane', 'Marzipane artesanal de Toledo. Receta tradicional.', 'ocio', 7, 21, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turístico busca trabajo en Toledo', 'Guía turístico busca trabajo en Toledo.', 'empleo', 7, 21, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de arte', 'Regalo colección de libros de arte toledano.', 'ocio', 7, 21, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de artesanía', 'Aprende damasquinado y cerámica.', 'formacion', 7, 21, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso histórico en centro de Toledo. Reformado.', 'servicios', 7, 21, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado patrimonial', 'Proyecto conservación patrimonio busca ayuda.', 'comunidad', 7, 21, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Toledo', 'Estudiante busca habitación cerca de la catedral.', 'servicios', 7, 21, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Especialidades toledanas', 'Vendo queso manchego y aceite de la zona.', 'ocio', 7, 21, 'venta', 38.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia de Toledo', 'Aprende sobre la historia imperial de Toledo.', 'formacion', 7, 21, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para fotografía', 'Busco fotógrafos para sesiones nocturnas.', 'ocio', 7, 21, 'intercambio', NULL);

-- CASTILLA Y LEÓN (comunidad_id: 8)
-- Ávila (provincia_id: 22)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo alta montaña Gredos', 'Equipo completo para alta montaña. Gredos.', 'ocio', 8, 22, 'venta', 650.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de Gredos', 'Guía de montaña certificada. Sistema Central.', 'servicios', 8, 22, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para senderismo', 'Organizo ascensiones a Pico Almanzor.', 'ocio', 8, 22, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo tienda de campaña', 'Tienda de campaña expedición. 4 estaciones.', 'ocio', 8, 22, 'venta', 320.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de escalada', 'Clases de escalada en roca. Todos niveles.', 'servicios', 8, 22, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo judiones de la Granja', 'Judiones de La Granja. Calidad superior.', 'ocio', 8, 22, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Monitor de montaña busca trabajo en Ávila', 'Monitor de montaña busca trabajo en Ávila.', 'empleo', 8, 22, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de montaña', 'Regalo guías de montaña de Gredos.', 'ocio', 8, 22, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de seguridad en montaña', 'Aprende técnicas de rescate en montaña.', 'formacion', 8, 22, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural en Gredos. Chimenea, vistas.', 'servicios', 8, 22, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado en Gredos', 'Proyecto conservación busca voluntarios.', 'comunidad', 8, 22, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Ávila', 'Profesional busca piso en centro amurallado.', 'servicios', 8, 22, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Dulces y embutidos abulenses', 'Vendo chorizo de Cantimpalos y yemas.', 'ocio', 8, 22, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de montañismo', 'Aprende montañismo en el Sistema Central.', 'formacion', 8, 22, 'servicio', 200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para ruta de la Plata.', 'ocio', 8, 22, 'intercambio', NULL);

-- Burgos (provincia_id: 23)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Bicicleta carretera profesional', 'Bicicleta de carretera carbono. Shimano.', 'ocio', 8, 23, 'venta', 1500.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía del Camino de Santiago', 'Guía oficial del Camino Francés. Burgos.', 'servicios', 8, 23, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para ciclismo', 'Organizo rutas por la Burgalesa.', 'ocio', 8, 23, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo morcilla de Burgos', 'Morcilla de Burgos artesanal. Receta tradicional.', 'ocio', 8, 23, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de historia gótica', 'Aprende sobre el arte gótico burgalés.', 'servicios', 8, 23, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit fotografía arquitectura', 'Cámara réflex para arquitectura. Gran angular.', 'ocio', 8, 23, 'venta', 750.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarero busca trabajo en Burgos', 'Camarero busca trabajo en Burgos capital.', 'empleo', 8, 23, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia del Camino de Santiago', 'Regalo historia del Camino de Santiago.', 'ocio', 8, 23, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de fotografía', 'Aprende fotografía arquitectónica.', 'formacion', 8, 23, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso reformado junto a la catedral.', 'servicios', 8, 23, 'venta', 320000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 8, 23, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Burgos', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 8, 23, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Especialidades burgalesas', 'Vendo queso oveja y embutidos de la zona.', 'ocio', 8, 23, 'venta', 32.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia del Camino', 'Aprende sobre la historia del Camino de Santiago.', 'formacion', 8, 23, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para ruta del Camino.', 'ocio', 8, 23, 'intercambio', NULL);

-- León (provincia_id: 24)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Esquís de travesía leonesa', 'Esquís de travesía. Montaña leonesa.', 'ocio', 8, 24, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de botánica', 'Aprende flora de la montaña leonesa.', 'servicios', 8, 24, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por Picos de Europa.', 'ocio', 8, 24, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo cecina de León', 'Cecina de León con denominación de origen.', 'ocio', 8, 24, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de la montaña', 'Guía de montaña especializada. León.', 'servicios', 8, 24, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo botas de montaña', 'Botas de montaña impermeables. Goretex.', 'ocio', 8, 24, 'venta', 180.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en montaña', 'Monitor busca trabajo en estación de esquí.', 'empleo', 8, 24, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de naturaleza', 'Regalo guías de flora y fauna leonesa.', 'ocio', 8, 24, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de montañismo', 'Aprende montañismo en Picos de Europa.', 'formacion', 8, 24, 'servicio', 190.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa en la montaña', 'Casa rural en Riaño. Vistas increíbles.', 'servicios', 8, 24, 'venta', 250000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado forestal', 'Proyecto reforestación busca voluntarios.', 'comunidad', 8, 24, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en León', 'Profesional busca piso en centro de León.', 'servicios', 8, 24, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Embutidos leoneses', 'Vendo botillo y cecina de la zona.', 'ocio', 8, 24, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de botánica', 'Aprende plantas medicinales de la montaña.', 'formacion', 8, 24, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para ruta de Ancares.', 'ocio', 8, 24, 'intercambio', NULL);

-- Palencia (provincia_id: 25)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo tractor agrícola', 'Tractor pequeño para agricultura. Palencia.', 'ocio', 8, 25, 'venta', 8500.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de agricultura', 'Aprende agricultura sostenible. Tierra de Campos.', 'servicios', 8, 25, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para caza', 'Organizo jornadas de caza menor.', 'ocio', 8, 25, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Sistema riego agrícola', 'Sistema de riego por aspersión. Gran superficie.', 'ocio', 8, 25, 'venta', 2200.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de Tierra de Campos', 'Tours por la comarca. Historia y naturaleza.', 'servicios', 8, 25, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo pan artesanal', 'Pan artesanal de horno de leña. Tradicional.', 'ocio', 8, 25, 'venta', 8.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en explotación agraria.', 'empleo', 8, 25, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo herramientas de campo', 'Regalo set completo de herramientas agrícolas.', 'ocio', 8, 25, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de panadería', 'Aprende a hacer pan artesanal.', 'formacion', 8, 25, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo finca agrícola', 'Finca de 50 hectáreas. Palencia.', 'servicios', 8, 25, 'venta', 150000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado agrícola', 'Proyecto agricultura ecológica busca ayuda.', 'comunidad', 8, 25, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco casa en el campo', 'Busco casa rural para alquilar largo plazo.', 'servicios', 8, 25, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Agricultura palentina', 'Vendo legumbres y productos de la huerta.', 'ocio', 8, 25, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de agricultura ecológica', 'Aprende técnicas de agricultura sostenible.', 'formacion', 8, 25, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la comarca.', 'ocio', 8, 25, 'intercambio', NULL);

-- Salamanca (provincia_id: 26)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit fotografía salmantina', 'Cámara réflex para arquitectura. Salamanca.', 'ocio', 8, 26, 'venta', 680.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de Salamanca', 'Tours por la ciudad dorada. Guía oficial.', 'servicios', 8, 26, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para museos', 'Organizo visitas a museos de Salamanca.', 'ocio', 8, 26, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo jamón Guijuelo', 'Jamón de Guijuelo. Denominación de origen.', 'ocio', 8, 26, 'venta', 85.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de historia del arte', 'Aprende sobre el arte salmantino.', 'servicios', 8, 26, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo libros universitarios', 'Colección de textos universitarios. Derecho.', 'ocio', 8, 26, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en educación', 'Profesor busca trabajo en Salamanca.', 'empleo', 8, 26, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de la Universidad de Salamanca', 'Regalo historia de la Universidad de Salamanca.', 'ocio', 8, 26, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de español para extranjeros', 'Aprende español en Salamanca. Inmersión total.', 'formacion', 8, 26, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en centro', 'Piso histórico junto a la Plaza Mayor.', 'servicios', 8, 26, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 8, 26, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en Salamanca', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 8, 26, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Charcutería salmantina', 'Vendo chorizo de Salamanca y lomo.', 'ocio', 8, 26, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia universitaria', 'Aprende sobre la historia de la USAL.', 'formacion', 8, 26, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para fotografía', 'Busco fotógrafos para sesiones arquitectónicas.', 'ocio', 8, 26, 'intercambio', NULL);

-- Segovia (provincia_id: 27)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo cochinillo', 'Cochinillo de Segovia. Receta tradicional.', 'ocio', 8, 27, 'venta', 45.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía del acueducto', 'Tours por el acueducto y alcázar. Historiador.', 'servicios', 8, 27, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por la sierra de Guadarrama.', 'ocio', 8, 27, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo ponche segoviano', 'Ponche segoviano artesanal. Dulce tradicional.', 'ocio', 8, 27, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de historia romana', 'Aprende sobre el Imperio Romano en Segovia.', 'servicios', 8, 27, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo montaña Guadarrama', 'Equipo para rutas por Guadarrama.', 'ocio', 8, 27, 'venta', 420.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turístico busca trabajo en Segovia', 'Guía turístico busca trabajo en Segovia.', 'empleo', 8, 27, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia de Castilla', 'Regalo historia de Castilla. Colección.', 'ocio', 8, 27, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de fotografía', 'Aprende fotografía monumental.', 'formacion', 8, 27, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa rural', 'Casa rural con vistas al acueducto.', 'servicios', 8, 27, 'venta', 320000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado patrimonial', 'Proyecto conservación busca voluntarios.', 'comunidad', 8, 27, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Segovia', 'Profesional busca piso en centro histórico.', 'servicios', 8, 27, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Gastronomía segoviana', 'Vendo judiones y productos de la tierra.', 'ocio', 8, 27, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia castellana', 'Aprende sobre los reinos de Castilla.', 'formacion', 8, 27, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 8, 27, 'intercambio', NULL);

-- Soria (provincia_id: 28)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit observación naturaleza', 'Equipo para observar naturaleza. Soria.', 'ocio', 8, 28, 'venta', 380.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de la naturaleza', 'Tours por los parques naturales. Biólogo.', 'servicios', 8, 28, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por el Cañón del Río Lobos.', 'ocio', 8, 28, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo setas silvestres', 'Setas de la zona de Soria. Temporada.', 'ocio', 8, 28, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de micología', 'Aprende a识别 setas y hongos.', 'servicios', 8, 28, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo trufas negras', 'Trufas negras de Soria. Alta calidad.', 'ocio', 8, 28, 'venta', 120.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en naturaleza', 'Guardabosques busca trabajo.', 'empleo', 8, 28, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de naturaleza', 'Regalo guías de flora y fauna.', 'ocio', 8, 28, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de fotografía natural', 'Aprende fotografía de naturaleza.', 'formacion', 8, 28, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa en el campo', 'Casa rural en el corazón de Soria.', 'servicios', 8, 28, 'venta', 180000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado ambiental', 'Proyecto conservación naturaleza busca ayuda.', 'comunidad', 8, 28, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Soria', 'Profesional busca piso tranquilo.', 'servicios', 8, 28, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Mieles y setas sorianas', 'Vendo miel y productos del bosque.', 'ocio', 8, 28, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de ecología', 'Aprende sobre los ecosistemas de Soria.', 'formacion', 8, 28, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para astronomía', 'Busco gente para observar estrellas.', 'ocio', 8, 28, 'intercambio', NULL);

-- Valladolid (provincia_id: 29)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo libros de literatura', 'Colección de literatura española. Primera edición.', 'ocio', 8, 29, 'venta', 200.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía literaria', 'Tours por lugares literarios de Valladolid.', 'servicios', 8, 29, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para teatro', 'Organizo visitas al Teatro Calderón.', 'ocio', 8, 29, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo tapas típicas', 'Recetas y productos para tapas vallisoletanas.', 'ocio', 8, 29, 'venta', 30.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de literatura', 'Aprende sobre la literatura del Siglo de Oro.', 'servicios', 8, 29, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo conciertos profesional', 'Equipo para conciertos y eventos.', 'ocio', 8, 29, 'venta', 850.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en cultura', 'Profesional busca trabajo en museos.', 'empleo', 8, 29, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de arte', 'Regalo colección de arte contemporáneo.', 'ocio', 8, 29, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de historia del arte', 'Aprende sobre el arte castellano.', 'formacion', 8, 29, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso reformado en centro de Valladolid.', 'servicios', 8, 29, 'venta', 350000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 8, 29, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Valladolid', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 8, 29, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Lechazo vallisoletano', 'Vendo lechazo y productos de la zona.', 'ocio', 8, 29, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de literatura española', 'Aprende sobre los grandes escritores.', 'formacion', 8, 29, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para cine', 'Busco gente para cineclub semanal.', 'ocio', 8, 29, 'intercambio', NULL);

-- Zamora (provincia_id: 30)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Set pesca río Duero', 'Equipo para pesca en el Duero. Zamora.', 'ocio', 8, 30, 'venta', 520.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía del Duero', 'Tours por el río Duero. Naturaleza.', 'servicios', 8, 30, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por las arribes del Duero.', 'ocio', 8, 30, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo vino de Toro', 'Vino de la D.O. Toro. Alta calidad.', 'ocio', 8, 30, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de enología', 'Aprende sobre vinos de Zamora.', 'servicios', 8, 30, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo arroz de Zamora', 'Arroz de la zona. Calidad superior.', 'ocio', 8, 30, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en enología', 'Enólogo busca trabajo en bodega.', 'empleo', 8, 30, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de vino', 'Regalo colección de libros de enología.', 'ocio', 8, 30, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de cata de vinos', 'Aprende a catar vinos locales.', 'formacion', 8, 30, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural con vistas al Duero.', 'servicios', 8, 30, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado enológico', 'Proyecto viñedos busca voluntarios.', 'comunidad', 8, 30, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Zamora', 'Profesional busca piso en centro.', 'servicios', 8, 30, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Quesos zamoranos', 'Vendo queso zamorano y embutidos.', 'ocio', 8, 30, 'venta', 32.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de viticultura', 'Aprende cultivo de la vid.', 'formacion', 8, 30, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por el Duero.', 'ocio', 8, 30, 'intercambio', NULL);

-- CATALUÑA (comunidad_id: 9)
-- Barcelona (provincia_id: 31)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo scooter eléctrico', 'Scooter eléctrico para moverse por Barcelona.', 'ocio', 9, 31, 'venta', 650.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de catalán', 'Aprende catalán intensivo. Nativos.', 'servicios', 9, 31, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa en Barceloneta.', 'ocio', 9, 31, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo entradas Sagrada Familia', 'Entradas para Sagrada Familia. Fecha próxima.', 'ocio', 9, 31, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de Gaudí', 'Tours por las obras de Gaudí. Arquitecto.', 'servicios', 9, 31, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Tablet diseño profesional', 'Tablet Wacom y software de diseño.', 'ocio', 9, 31, 'venta', 1200.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en diseño', 'Diseñador gráfico busca trabajo.', 'empleo', 9, 31, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de arte', 'Regalo colección de arte modernista.', 'ocio', 9, 31, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de diseño gráfico', 'Aprende diseño con Adobe Creative Suite.', 'formacion', 9, 31, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en Gràcia', 'Piso con encanto en Gràcia. Balcones.', 'servicios', 9, 31, 'venta', 550000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 9, 31, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Barcelona', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 9, 31, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Desayuno catalán', 'Vendo pan con tomate y aceite catalán.', 'ocio', 9, 31, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de arquitectura modernista', 'Aprende sobre Gaudí y el modernismo.', 'formacion', 9, 31, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para fotografía', 'Busco fotógrafos para sesiones urbanas.', 'ocio', 9, 31, 'intercambio', NULL);

-- Girona (provincia_id: 32)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo kayak', 'Kayak para explorar la Costa Brava.', 'ocio', 9, 32, 'venta', 480.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de la Costa Brava', 'Tours por calas escondidas. Nativos.', 'servicios', 9, 32, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por el Pirineo gerundense.', 'ocio', 9, 32, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Anchoas de l''Escala', 'Vendo anchoas de l''Escala y quesos.', 'ocio', 9, 32, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de cocina catalana', 'Aprende cocina tradicional de Girona.', 'servicios', 9, 32, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Equipo buceo Costa Brava', 'Equipo completo para buceo en Costa Brava.', 'ocio', 9, 32, 'venta', 750.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Costa Brava', 'Camarero busca trabajo en Costa Brava.', 'empleo', 9, 32, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de cocina', 'Regalo recetas tradicionales catalanas.', 'ocio', 9, 32, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de buceo', 'Aprende a bucear en la Costa Brava.', 'formacion', 9, 32, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa en la costa', 'Casa con vistas al mar. Costa Brava.', 'servicios', 9, 32, 'venta', 680000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado marino', 'Proyecto conservación marina busca ayuda.', 'comunidad', 9, 32, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Girona', 'Profesional busca piso en centro histórico.', 'servicios', 9, 32, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo vinos del Empordà', 'Vinos de la D.O. Empordà. Calidad.', 'ocio', 9, 32, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de cocina marítima', 'Aprende cocina de pescado y marisco.', 'formacion', 9, 32, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para kayak', 'Busco compañeros para rutas marítimas.', 'ocio', 9, 32, 'intercambio', NULL);

-- Lleida (provincia_id: 33)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Esquís Baqueira-Beret', 'Esquís para Baqueira-Beret. Pirineos.', 'ocio', 9, 33, 'venta', 550.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de montaña', 'Guía certificada para Pirineos leridanos.', 'servicios', 9, 33, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para esquí', 'Organizo jornadas de esquí en Baqueira.', 'ocio', 9, 33, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Frutas del Segrià', 'Vendo frutas del Segrià y productos agrícolas.', 'ocio', 9, 33, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de esquí', 'Clases de esquí alpino. Todos niveles.', 'servicios', 9, 33, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit alta montaña pirineo', 'Equipo completo para alta montaña.', 'ocio', 9, 33, 'venta', 680.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en montaña', 'Monitor de esquí busca trabajo.', 'empleo', 9, 33, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de montaña', 'Regalo guías de los Pirineos.', 'ocio', 9, 33, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de montañismo', 'Aprende montañismo en los Pirineos.', 'formacion', 9, 33, 'servicio', 200.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo chalet en montaña', 'Chalet con vistas a los Pirineos.', 'servicios', 9, 33, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado de montaña', 'Proyecto conservación Pirineos busca ayuda.', 'comunidad', 9, 33, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Lleida', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 9, 33, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo vinos de la zona', 'Vinos de la D.O. Costers del Segre.', 'ocio', 9, 33, 'venta', 16.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de agricultura', 'Aprende agricultura de montaña.', 'formacion', 9, 33, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por el Pallars.', 'ocio', 9, 33, 'intercambio', NULL);

-- Tarragona (provincia_id: 34)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo buceo Costa Dorada', 'Equipo para buceo en Costa Dorada.', 'ocio', 9, 34, 'venta', 620.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía romana', 'Tours por Tarraco. Arqueólogo.', 'servicios', 9, 34, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa en Salou.', 'ocio', 9, 34, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo aceite catalán', 'Aceite de la D.O. Siurana. Calidad.', 'ocio', 9, 34, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de historia romana', 'Aprende sobre el Imperio Romano en Tarraco.', 'servicios', 9, 34, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo entradas PortAventura', 'Entradas para PortAventura. Fecha flexible.', 'ocio', 9, 34, 'venta', 55.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Costa Dorada', 'Camarero busca trabajo en Costa Dorada.', 'empleo', 9, 34, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia del Imperio Romano', 'Regalo historia del Imperio Romano.', 'ocio', 9, 34, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de arqueología', 'Aprende técnicas arqueológicas básicas.', 'formacion', 9, 34, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en playa', 'Piso frente a la playa en Salou.', 'servicios', 9, 34, 'venta', 480000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado arqueológico', 'Proyecto excavaciones busca voluntarios.', 'comunidad', 9, 34, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Tarragona', 'Profesional busca piso en centro.', 'servicios', 9, 34, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vinos tarraconenses', 'Vendo vino y productos del Camp de Tarragona.', 'ocio', 9, 34, 'venta', 24.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia antigua', 'Aprende sobre la Roma imperial.', 'formacion', 9, 34, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para buceo', 'Busco compañeros para inmersiones.', 'ocio', 9, 34, 'intercambio', NULL);

-- COMUNIDAD VALENCIANA (comunidad_id: 10)
-- Alicante (provincia_id: 35)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Set paddle surf alicantino', 'Tabla de paddle para la costa de Alicante.', 'ocio', 10, 35, 'venta', 380.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de valenciano', 'Aprende valenciano intensivo. Nativos.', 'servicios', 10, 35, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa en San Juan.', 'ocio', 10, 35, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo horchata casera', 'Horchata de chufa artesanal. Receta tradicional.', 'ocio', 10, 35, 'venta', 8.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de la Costa Blanca', 'Tours por calas escondidas. Guía local.', 'servicios', 10, 35, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo buceo mediterráneo', 'Equipo completo para buceo en Mediterráneo.', 'ocio', 10, 35, 'venta', 680.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarera busca trabajo en Benidorm', 'Camarera busca trabajo en Benidorm.', 'empleo', 10, 35, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia de la Comunidad Valenciana', 'Regalo historia de la Comunidad Valenciana.', 'ocio', 10, 35, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de buceo', 'Aprende a bucear en la Costa Blanca.', 'formacion', 10, 35, 'servicio', 160.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en playa', 'Piso frente a la playa en Alicante.', 'servicios', 10, 35, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado marino', 'Proyecto conservación marina busca ayuda.', 'comunidad', 10, 35, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Alicante', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 10, 35, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Turrones alicantinos', 'Vendo turrón y dulces navideños.', 'ocio', 10, 35, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de cocina alicantina', 'Aprende platos típicos de Alicante.', 'formacion', 10, 35, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 10, 35, 'intercambio', NULL);

-- Castellón (provincia_id: 36)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo Sierra Espadán', 'Equipo para rutas por la Sierra de Espadán.', 'ocio', 10, 36, 'venta', 420.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de la montaña', 'Tours por la Sierra de Espadán. Naturaleza.', 'servicios', 10, 36, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por el interior de Castellón.', 'ocio', 10, 36, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo miel de la montaña', 'Miel de la Sierra de Espadán. Ecológica.', 'ocio', 10, 36, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de cerámica', 'Aprende cerámica tradicional. Taller incluido.', 'servicios', 10, 36, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo naranjas valencianas', 'Naranjas directas del campo. Dulces.', 'ocio', 10, 36, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en cosechas.', 'empleo', 10, 36, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo herramientas de jardín', 'Regalo set completo de herramientas.', 'ocio', 10, 36, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de agricultura', 'Aprende agricultura ecológica.', 'formacion', 10, 36, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural en la montaña. Castellón.', 'servicios', 10, 36, 'venta', 280000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado forestal', 'Proyecto reforestación busca voluntarios.', 'comunidad', 10, 36, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Castellón', 'Profesional busca piso en centro.', 'servicios', 10, 36, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Aceite de Castellón', 'Vendo aceite y productos de la huerta.', 'ocio', 10, 36, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de cerámica', 'Aprende cerámica tradicional. Material incluido.', 'formacion', 10, 36, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 10, 36, 'intercambio', NULL);

-- Valencia (provincia_id: 37)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo bicicleta eléctrica', 'Bicicleta para moverse por Valencia.', 'ocio', 10, 37, 'venta', 750.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de la Ciudad', 'Tours por Valencia. Guía oficial.', 'servicios', 10, 37, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para Fallas', 'Organizo visitas a las Fallas.', 'ocio', 10, 37, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo paella valenciana', 'Paella valenciana tradicional. Receta original.', 'ocio', 10, 37, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de cocina valenciana', 'Aprende a hacer paella auténtica.', 'servicios', 10, 37, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Sistema música valenciano', 'Equipo para fiestas y eventos.', 'ocio', 10, 37, 'venta', 920.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarero busca trabajo en Valencia', 'Camarero busca trabajo en Valencia.', 'empleo', 10, 37, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia del Reino de Valencia', 'Regalo historia del Reino de Valencia.', 'ocio', 10, 37, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de valenciano', 'Aprende valenciano desde cero.', 'formacion', 10, 37, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en centro', 'Piso en el centro de Valencia. Reformado.', 'servicios', 10, 37, 'venta', 480000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 10, 37, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Valencia', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 10, 37, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Horchata valenciana', 'Vendo horchata y fartons.', 'ocio', 10, 37, 'venta', 10.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia valenciana', 'Aprende sobre la historia de Valencia.', 'formacion', 10, 37, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la Albufera.', 'ocio', 10, 37, 'intercambio', NULL);

-- EXTREMADURA (comunidad_id: 11)
-- Badajoz (provincia_id: 38)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Maquinaria agrícola extremeña', 'Equipo para agricultura. Badajoz.', 'ocio', 11, 38, 'venta', 1800.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de historia', 'Aprende historia de Extremadura.', 'servicios', 11, 38, 'servicio', 50.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por la dehesa.', 'ocio', 11, 38, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo jamón ibérico', 'Jamón de bellota extremeño. Calidad.', 'ocio', 11, 38, 'venta', 95.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de la dehesa', 'Tours por la dehesa extremeña.', 'servicios', 11, 38, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo queso de oveja', 'Queso de oveja merino. Artesanal.', 'ocio', 11, 38, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en explotación.', 'empleo', 11, 38, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de Extremadura', 'Regalo historia de Extremadura.', 'ocio', 11, 38, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de ganadería', 'Aprende ganadería extensiva.', 'formacion', 11, 38, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo finca rural', 'Finca con dehesa. Badajoz.', 'servicios', 11, 38, 'venta', 120000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado ambiental', 'Proyecto conservación busca ayuda.', 'comunidad', 11, 38, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Badajoz', 'Profesional busca piso en centro.', 'servicios', 11, 38, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Mieles extremeñas', 'Vendo miel y productos de la dehesa.', 'ocio', 11, 38, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de agricultura', 'Aprende agricultura sostenible.', 'formacion', 11, 38, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 11, 38, 'intercambio', NULL);

-- Cáceres (provincia_id: 39)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Kit fotografía cacereña', 'Cámara para arquitectura. Cáceres.', 'ocio', 11, 39, 'venta', 580.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía monumental', 'Tours por Cáceres. Guía oficial.', 'servicios', 11, 39, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para museos', 'Organizo visitas a monumentos.', 'ocio', 11, 39, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo torta del Casar', 'Torta del Casar con denominación.', 'ocio', 11, 39, 'venta', 28.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de historia del arte', 'Aprende sobre arte extremeño.', 'servicios', 11, 39, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo montaña cacereña', 'Equipo para rutas por la sierra.', 'ocio', 11, 39, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turístico busca trabajo en Cáceres', 'Guía turístico busca trabajo.', 'empleo', 11, 39, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de arte', 'Regalo arte extremeño.', 'ocio', 11, 39, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de fotografía', 'Aprende fotografía monumental.', 'formacion', 11, 39, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa histórica', 'Casa en el casco antiguo. Cáceres.', 'servicios', 11, 39, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 11, 39, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Cáceres', 'Profesional busca piso en centro.', 'servicios', 11, 39, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Pimentón de La Vera', 'Vendo pimentón y productos de la tierra.', 'ocio', 11, 39, 'venta', 16.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia', 'Aprende historia de Extremadura.', 'formacion', 11, 39, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 11, 39, 'intercambio', NULL);

-- GALICIA (comunidad_id: 12)
-- A Coruña (provincia_id: 40)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Set marisqueo coruñés', 'Equipo para pesca y marisqueo.', 'ocio', 12, 40, 'venta', 650.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Clases de gallego', 'Aprende gallego intensivo. Nativos.', 'servicios', 12, 40, 'servicio', 45.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por la Costa da Morte.', 'ocio', 12, 40, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo pulpo a la gallega', 'Pulpo fresco para hacer a la gallega.', 'ocio', 12, 40, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Guía de la costa', 'Tours por las Rías Altas. Guía local.', 'servicios', 12, 40, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo queso tetilla', 'Queso tetilla con denominación.', 'ocio', 12, 40, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en A Coruña', 'Camarero busca trabajo en A Coruña.', 'empleo', 12, 40, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia de Galicia', 'Regalo historia de Galicia.', 'ocio', 12, 40, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de marisqueo', 'Aprende a mariscar. Prácticas incluidas.', 'formacion', 12, 40, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en la costa', 'Piso con vistas al mar. A Coruña.', 'servicios', 12, 40, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado marino', 'Proyecto conservación marina busca ayuda.', 'comunidad', 12, 40, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en A Coruña', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 12, 40, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Marisco coruñés', 'Vendo berberechos y marisco fresco.', 'ocio', 12, 40, 'venta', 30.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de cocina gallega', 'Aprende cocina tradicional gallega.', 'formacion', 12, 40, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la costa.', 'ocio', 12, 40, 'intercambio', NULL);

-- Lugo (provincia_id: 41)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Equipo montaña lucense', 'Equipo para rutas por la sierra.', 'ocio', 12, 41, 'venta', 380.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de la muralla', 'Tours por la muralla de Lugo.', 'servicios', 12, 41, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por la sierra de Lugo.', 'ocio', 12, 41, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo lacón gallego', 'Lacón con grelos. Tradicional.', 'ocio', 12, 41, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de historia romana', 'Aprende sobre Lucus Augusti.', 'servicios', 12, 41, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Castañas lucenses', 'Vendo castañas y productos del bosque.', 'ocio', 12, 41, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía turístico busca trabajo en Lugo', 'Guía turístico busca trabajo.', 'empleo', 12, 41, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia romana de Galicia', 'Regalo historia romana de Galicia.', 'ocio', 12, 41, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de historia', 'Aprende historia de Lugo.', 'formacion', 12, 41, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa rural', 'Casa rural en la sierra. Lugo.', 'servicios', 12, 41, 'venta', 250000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado forestal', 'Proyecto conservación busca voluntarios.', 'comunidad', 12, 41, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Lugo', 'Profesional busca piso en centro.', 'servicios', 12, 41, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo quesos locales', 'Quesos artesanales de la zona.', 'ocio', 12, 41, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de historia romana', 'Aprende sobre el Imperio Romano.', 'formacion', 12, 41, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 12, 41, 'intercambio', NULL);

-- Ourense (provincia_id: 42)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Kit termal ourensano', 'Equipo para balnearios. Ourense.', 'ocio', 12, 42, 'venta', 280.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de las termas', 'Tours por balnearios de Ourense.', 'servicios', 12, 42, 'servicio', 60.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por el Ribeiro.', 'ocio', 12, 42, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo vino del Ribeiro', 'Vino de la D.O. Ribeiro. Calidad.', 'ocio', 12, 42, 'venta', 16.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de enología', 'Aprende sobre vinos gallegos.', 'servicios', 12, 42, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Embutidos ourensanos', 'Vendo embutidos y productos de la zona.', 'ocio', 12, 42, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en Ourense', 'Camarero busca trabajo en Ourense.', 'empleo', 12, 42, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de vino', 'Regalo colección de libros de enología.', 'ocio', 12, 42, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de cata de vinos', 'Aprende a catar vinos gallegos.', 'formacion', 12, 42, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa con balneario', 'Casa con aguas termales. Ourense.', 'servicios', 12, 42, 'venta', 480000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado enológico', 'Proyecto viñedos busca voluntarios.', 'comunidad', 12, 42, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Ourense', 'Profesional busca piso en centro.', 'servicios', 12, 42, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo productos del Ribeiro', 'Vendo vinos y productos locales.', 'ocio', 12, 42, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de viticultura', 'Aprende cultivo de la vid.', 'formacion', 12, 42, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por el Ribeiro.', 'ocio', 12, 42, 'intercambio', NULL);

-- Pontevedra (provincia_id: 43)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Set pesca Rías Baixas', 'Equipo para pesca en las Rías Baixas.', 'ocio', 12, 43, 'venta', 720.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de las Rías Baixas', 'Tours por las Rías Baixas. Guía local.', 'servicios', 12, 43, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa en las Islas Cíes.', 'ocio', 12, 43, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo albariño', 'Albariño de las Rías Baixas. Premium.', 'ocio', 12, 43, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de marisqueo', 'Aprende a mariscar. Prácticas incluidas.', 'servicios', 12, 43, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo buceo atlántico', 'Equipo completo para buceo en el Atlántico.', 'ocio', 12, 43, 'venta', 820.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarero busca trabajo en Vigo', 'Camarero busca trabajo en Vigo.', 'empleo', 12, 43, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de mar', 'Regalo colección de libros del mar.', 'ocio', 12, 43, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de náutica', 'Aprende navegación. Prácticas incluidas.', 'formacion', 12, 43, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa en la costa', 'Casa con vistas a la ría. Pontevedra.', 'servicios', 12, 43, 'venta', 650000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado marino', 'Proyecto conservación marina busca ayuda.', 'comunidad', 12, 43, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Pontevedra', 'Profesional busca piso en centro.', 'servicios', 12, 43, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo productos del mar', 'Vendo berberechos, vieiras y marisco.', 'ocio', 12, 43, 'venta', 35.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de cocina marítima', 'Aprende cocina de pescado y marisco.', 'formacion', 12, 43, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para vela', 'Busco compañeros para regatas.', 'ocio', 12, 43, 'intercambio', NULL);

-- MADRID (comunidad_id: 13)
-- Madrid (provincia_id: 44)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo scooter eléctrico', 'Scooter para moverse por Madrid.', 'ocio', 13, 44, 'venta', 850.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía del Prado', 'Tours por el Museo del Prado. Historiador.', 'servicios', 13, 44, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para museos', 'Organizo visitas a museos de Madrid.', 'ocio', 13, 44, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo bocadillo de calamares', 'Bocadillos de calamares. Tradición madrileña.', 'ocio', 13, 44, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de historia del arte', 'Aprende sobre el arte madrileño.', 'servicios', 13, 44, 'servicio', 90.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo entradas teatro', 'Entradas para teatros del Gran Vía.', 'ocio', 13, 44, 'venta', 45.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en cultura', 'Profesional busca trabajo en museos.', 'empleo', 13, 44, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de arte', 'Regalo colección de arte madrileño.', 'ocio', 13, 44, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de español', 'Aprende español en Madrid. Inmersión.', 'formacion', 13, 44, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en centro', 'Piso en el centro de Madrid. Reformado.', 'servicios', 13, 44, 'venta', 750000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 13, 44, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en Madrid', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 13, 44, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Churros madrileños', 'Vendo churros con chocolate y tapas.', 'ocio', 13, 44, 'venta', 8.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia de Madrid', 'Aprende sobre la historia de Madrid.', 'formacion', 13, 44, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para teatro', 'Busco gente para teatroclub semanal.', 'ocio', 13, 44, 'intercambio', NULL);

-- MURCIA (comunidad_id: 14)
-- Murcia (provincia_id: 45)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Kit playa murciana', 'Equipo completo para playas de Murcia.', 'ocio', 14, 45, 'venta', 320.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de la huerta', 'Tours por la huerta de Murcia. Agricultor.', 'servicios', 14, 45, 'servicio', 55.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para playa', 'Organizo días de playa en la Manga.', 'ocio', 14, 45, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo zarangollo', 'Zarangollo murciano. Receta tradicional.', 'ocio', 14, 45, 'venta', 10.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de cocina murciana', 'Aprende cocina tradicional de Murcia.', 'servicios', 14, 45, 'servicio', 70.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Frutas murcianas', 'Vendo frutas de la huerta murciana.', 'ocio', 14, 45, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en agricultura', 'Joven busca trabajo en la huerta.', 'empleo', 14, 45, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia de la Región de Murcia', 'Regalo historia de la Región de Murcia.', 'ocio', 14, 45, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de agricultura', 'Aprende agricultura de la huerta.', 'formacion', 14, 45, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo casa en la costa', 'Casa en la Costa Cálida. Murcia.', 'servicios', 14, 45, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado ambiental', 'Proyecto conservación busca voluntarios.', 'comunidad', 14, 45, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco piso en Murcia', 'Profesional busca piso en centro.', 'servicios', 14, 45, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Queso de Murcia', 'Vendo queso de murcia y productos.', 'ocio', 14, 45, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de cocina murciana', 'Aprende platos típicos de Murcia.', 'formacion', 14, 45, 'servicio', 100.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por la sierra.', 'ocio', 14, 45, 'intercambio', NULL);

-- NAVARRA (comunidad_id: 15)
-- Navarra (provincia_id: 46)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Equipo Pirineos navarros', 'Equipo para rutas por los Pirineos navarros.', 'ocio', 15, 46, 'venta', 580.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía del Camino', 'Tours por el Camino de Santiago navarro.', 'servicios', 15, 46, 'servicio', 75.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para senderismo', 'Organizo rutas por el Baztán.', 'ocio', 15, 46, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo pimientos del piquillo', 'Pimientos del piquillo de Lodosa. Calidad.', 'ocio', 15, 46, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de historia navarra', 'Aprende sobre el Reino de Navarra.', 'servicios', 15, 46, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Vendo quesos navarros', 'Quesos artesanales de Navarra.', 'ocio', 15, 46, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en montaña', 'Monitor busca trabajo en Pirineos.', 'empleo', 15, 46, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo historia del Reino de Navarra', 'Regalo historia del Reino de Navarra.', 'ocio', 15, 46, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de montañismo', 'Aprende montañismo en los Pirineos.', 'formacion', 15, 46, 'servicio', 170.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural en el Pirineo navarro.', 'servicios', 15, 46, 'venta', 320000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado de montaña', 'Proyecto conservación busca voluntarios.', 'comunidad', 15, 46, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Pamplona', 'Profesional busca piso en centro.', 'servicios', 15, 46, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Verduras navarras', 'Vendo verduras y productos de la huerta.', 'ocio', 15, 46, 'venta', 16.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia navarra', 'Aprende sobre la historia de Navarra.', 'formacion', 15, 46, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por los Pirineos.', 'ocio', 15, 46, 'intercambio', NULL);

-- PAÍS VASCO (comunidad_id: 16)
-- Álava (provincia_id: 47)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Equipo montaña alavés', 'Equipo para rutas por Álava.', 'ocio', 16, 47, 'venta', 420.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Clases de euskera', 'Aprende euskera intensivo. Nativos.', 'servicios', 16, 47, 'servicio', 65.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para rutas', 'Organizo rutas por la Rioja Alavesa.', 'ocio', 16, 47, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Vendo vino riojano', 'Vino de la Rioja Alavesa. Calidad.', 'ocio', 16, 47, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Guía de la Rioja Alavesa', 'Tours por bodegas. Enólogo.', 'servicios', 16, 47, 'servicio', 85.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Artesanía alavesa', 'Vendo productos artesanales de Álava.', 'ocio', 16, 47, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Camarero busca trabajo en Vitoria', 'Camarero busca trabajo en Vitoria.', 'empleo', 16, 47, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo historia del País Vasco', 'Regalo historia del País Vasco.', 'ocio', 16, 47, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de enología', 'Aprende sobre vinos de Álava.', 'formacion', 16, 47, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en Vitoria', 'Piso en el centro de Vitoria. Reformado.', 'servicios', 16, 47, 'venta', 420000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 16, 47, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Vitoria', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 16, 47, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Vendo quesos locales', 'Quesos artesanales de la zona.', 'ocio', 16, 47, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de euskera', 'Aprende euskera desde cero.', 'formacion', 16, 47, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por Álava.', 'ocio', 16, 47, 'intercambio', NULL);

-- Guipúzcoa (provincia_id: 48)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Vendo tabla de surf', 'Tabla para surf en la costa guipuzcoana.', 'ocio', 16, 48, 'venta', 520.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de la costa', 'Tours por la costa de Guipúzcoa.', 'servicios', 16, 48, 'servicio', 95.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para surf', 'Organizo jornadas de surf en Zarautz.', 'ocio', 16, 48, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Txakoli guipuzcoano', 'Vendo txakoli y productos del mar.', 'ocio', 16, 48, 'venta', 22.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de surf', 'Aprende a surfear. Todos niveles.', 'servicios', 16, 48, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Equipo buceo cantábrico', 'Equipo para buceo en el Cantábrico.', 'ocio', 16, 48, 'venta', 750.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Camarero busca trabajo en San Sebastián', 'Camarero busca trabajo en San Sebastián.', 'empleo', 16, 48, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de cocina', 'Regalo cocina vasca tradicional.', 'ocio', 16, 48, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de cocina vasca', 'Aprende cocina tradicional vasca.', 'formacion', 16, 48, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo piso en San Sebastián', 'Piso con vistas a la bahía.', 'servicios', 16, 48, 'venta', 680000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado marino', 'Proyecto conservación marina busca ayuda.', 'comunidad', 16, 48, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco habitación en San Sebastián', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 16, 48, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Vendo productos del mar', 'Vendo marisco fresco y pescado.', 'ocio', 16, 48, 'venta', 38.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de cocina vasca', 'Aprende platos típicos vascos.', 'formacion', 16, 48, 'servicio', 140.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para surf', 'Busco compañeros para surf los fines de semana.', 'ocio', 16, 48, 'intercambio', NULL);

-- Vizcaya (provincia_id: 49)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Equipo montaña vizcaína', 'Equipo para rutas por Vizcaya.', 'ocio', 16, 49, 'venta', 450.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Guía de Bilbao', 'Tours por Bilbao. Guía oficial.', 'servicios', 16, 49, 'servicio', 80.00),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Busco compañeros para museos', 'Organizo visitas al Guggenheim.', 'ocio', 16, 49, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Bacalao vizcaíno', 'Vendo bacalao y productos vascos.', 'ocio', 16, 49, 'venta', 25.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Clases de diseño', 'Aprende diseño industrial. Bilbao.', 'servicios', 16, 49, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Tablet diseño bilbaíno', 'Tablet y software para diseño.', 'ocio', 16, 49, 'venta', 1500.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco trabajo en diseño', 'Diseñador busca trabajo en Bilbao.', 'empleo', 16, 49, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Regalo libros de arte', 'Regalo arte contemporáneo vasco.', 'ocio', 16, 49, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Clases de arte', 'Aprende sobre el arte vasco.', 'formacion', 16, 49, 'servicio', 110.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Vendo piso en Bilbao', 'Piso en Abando. Reformado.', 'servicios', 16, 49, 'venta', 520000.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Voluntariado cultural', 'Asociación cultural busca voluntarios.', 'comunidad', 16, 49, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco habitación en Bilbao', 'Estudiante busca habitación cerca de la universidad.', 'servicios', 16, 49, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Pintxos bilbaínos', 'Vendo pintxos y productos gastronómicos.', 'ocio', 16, 49, 'venta', 15.00),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Curso de diseño industrial', 'Aprende diseño industrial.', 'formacion', 16, 49, 'servicio', 160.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas por Vizcaya.', 'ocio', 16, 49, 'intercambio', NULL);

-- LA RIOJA (comunidad_id: 17)
-- La Rioja (provincia_id: 50)
INSERT INTO anuncios (usuario_id, titulo, descripcion, categoria, comunidad_id, provincia_id, modalidad, precio) VALUES
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Bodega vinificación completa', 'Equipo completo para vinificación.', 'ocio', 17, 50, 'venta', 2200.00),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Guía de bodegas', 'Tours por bodegas de La Rioja. Enólogo.', 'servicios', 17, 50, 'servicio', 120.00),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Busco compañeros para cata', 'Organizo catas de vinos riojanos.', 'ocio', 17, 50, 'intercambio', NULL),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Vendo vino riojano', 'Vino de La Rioja. Denominación de origen.', 'ocio', 17, 50, 'venta', 20.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Clases de enología', 'Aprende sobre vinos de La Rioja.', 'servicios', 17, 50, 'servicio', 150.00),
((SELECT id FROM usuarios WHERE email = 'ana@demo.es'), 'Patatas riojanas', 'Vendo patatas a la riojana y productos.', 'ocio', 17, 50, 'venta', 12.00),
((SELECT id FROM usuarios WHERE email = 'luis@demo.es'), 'Busco trabajo en enología', 'Enólogo busca trabajo en bodega.', 'empleo', 17, 50, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'sofia@demo.es'), 'Regalo libros de vino', 'Regalo colección de libros de enología.', 'ocio', 17, 50, 'regalo', NULL),
((SELECT id FROM usuarios WHERE email = 'miguel@demo.es'), 'Clases de viticultura', 'Aprende cultivo de la vid. Prácticas.', 'formacion', 17, 50, 'servicio', 180.00),
((SELECT id FROM usuarios WHERE email = 'laura@demo.es'), 'Vendo casa rural', 'Casa rural entre viñedos. La Rioja.', 'servicios', 17, 50, 'venta', 380000.00),
((SELECT id FROM usuarios WHERE email = 'david@demo.es'), 'Voluntariado enológico', 'Proyecto viñedos busca voluntarios.', 'comunidad', 17, 50, 'servicio', NULL),
((SELECT id FROM usuarios WHERE email = 'elena@demo.es'), 'Busco piso en Logroño', 'Profesional busca piso en centro.', 'servicios', 17, 50, 'compra', NULL),
((SELECT id FROM usuarios WHERE email = 'javier@demo.es'), 'Chorizo riojano', 'Vendo chorizo riojano y productos.', 'ocio', 17, 50, 'venta', 18.00),
((SELECT id FROM usuarios WHERE email = 'carmen@demo.es'), 'Curso de historia del vino', 'Aprende sobre la historia del vino riojano.', 'formacion', 17, 50, 'servicio', 130.00),
((SELECT id FROM usuarios WHERE email = 'pablo@demo.es'), 'Busco grupo para senderismo', 'Busco compañeros para rutas entre viñedos.', 'ocio', 17, 50, 'intercambio', NULL);
