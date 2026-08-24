-- Datos de demo para la comunidad de CityPAJ

INSERT INTO comunidad_publicaciones (autor_nombre, ip, titulo, contenido, provincia, tema, visible, estado_moderacion) VALUES
('AnaViveZgz', '127.0.0.1', 'Faltan espacios de estudio abiertos por la tarde', 'En época de exámenes muchas bibliotecas cierran pronto y no hay espacios suficientes para estudiar en Zaragoza. ¿Sabéis de alguna sala alternativa?', 'Zaragoza', 'Formación', 1, 'approved'),
('Mikel_86', '127.0.0.1', 'Los autobuses no se adaptan a los horarios universitarios', 'Las líneas de bus que pasan por los campus llegan tarde y no coinciden con los turnos de mañana. ¿A quién se le puede proponer un cambio?', 'Zaragoza', 'Transporte', 1, 'approved'),
('Sara_Cultura', '127.0.0.1', 'Propuesta: conciertos gratuitos en barrios', 'Me gustaría que hubiera ciclos de música local en parques o plazas para jóvenes. Sería una forma de dinamizar el ocio.', 'Zaragoza', 'Cultura', 1, 'approved'),
('Diego_BH', '127.0.0.1', 'Viviendas compartidas para jóvenes', 'Los alquileres en Madrid son imposibles. ¿Conocéis alguna asociación o ayuda para compartir piso con precio asequible?', 'Madrid', 'Vivienda', 1, 'approved'),
('Lucía_CV', '127.0.0.1', 'Ayudas para emprender con menos papeleo', 'He estado mirando ayudas a emprendedores y el papeleo es tremendo. ¿Alguien sabe si hay asesorías gratuitas?', 'Valencia', 'Ayudas', 1, 'approved'),
('Pablo_SEV', '127.0.0.1', 'Parques con puntos de recarga para móvil', 'Sería útil que algunos bancos de parques tuvieran USB o enchufes para cargar el móvil mientras estudiamos al aire libre.', 'Sevilla', 'Ocio', 1, 'approved'),
('Marta_BCN', '127.0.0.1', 'Salud mental en el bachillerato', 'Creo que debería haber más recursos de apoyo emocional en institutos. Muchos compañeros pasan por momentos difíciles y no saben a quién acudir.', 'Barcelona', 'Salud mental', 1, 'approved'),
('Jon_Ávila', '127.0.0.1', 'Voluntariado para limpiar espacios naturales', 'Me apunto a iniciativas de limpieza de ríos o montes los fines de semana. ¿Conocéis algún grupo activo?', 'Ávila', 'Voluntariado', 1, 'approved');

SET @p1 = LAST_INSERT_ID();

INSERT INTO comunidad_comentarios (publicacion_id, autor_nombre, ip, contenido, visible, estado_moderacion) VALUES
(@p1, 'LauraEstudia', '127.0.0.1', 'Tienes toda la razón. La pública de la ciudad cierra a las 20h.', 1, 'approved'),
(@p1, 'PedroBiblio', '127.0.0.1', 'En la facultad suelen dejar alguna sala abierta hasta las 22h.', 1, 'approved'),

(@p1+1, 'NataliaRedes', '127.0.0.1', 'Hay un buzón en la web del ayuntamiento para sugerencias.', 1, 'approved'),
(@p1+1, 'Mikel_86', '127.0.0.1', 'Algunas líneas están en prueba por obras, pero el horario es un caos.', 1, 'approved'),

(@p1+2, 'Raul_Música', '127.0.0.1', 'Apoyo total. Mi grupo toca en garitos y sería genial un escenario abierto.', 1, 'approved'),

(@p1+3, 'Carmen_Vivienda', '127.0.0.1', 'En Carabanchel hay asociaciones de cooperativa de vivienda. Pregunta por aquí.', 1, 'approved'),
(@p1+3, 'Diego_BH', '127.0.0.1', 'Lo miro, gracias.', 1, 'approved'),

(@p1+4, 'Toni_CV', '127.0.0.1', 'La Oficina Joven de la Diputación tiene asesorías gratuitas.', 1, 'approved'),

(@p1+5, 'Andrea_SEV', '127.0.0.1', 'Buena idea. En mi facultad sí hay enchufes, pero no en parques.', 1, 'approved'),

(@p1+6, 'Nuria_BCN', '127.0.0.1', 'Totalmente. Yo debería tener más acceso a recursos.', 1, 'approved'),

(@p1+7, 'Raúl_Ávila', '127.0.0.1', 'Mi asociación hace rutas el tercer sábado. ¡Apúntate!', 1, 'approved');

-- Likes demo
INSERT INTO comunidad_likes (tipo, objeto_id, ip, usuario_id) VALUES
('publicacion', @p1, '127.0.0.1', NULL),
('publicacion', @p1, '10.0.0.1', NULL),
('publicacion', @p1, '10.0.0.2', NULL),
('publicacion', @p1+1, '127.0.0.1', NULL),
('publicacion', @p1+1, '10.0.0.1', NULL),
('publicacion', @p1+2, '127.0.0.1', NULL),
('publicacion', @p1+3, '10.0.0.3', NULL),
('publicacion', @p1+3, '10.0.0.4', NULL),
('publicacion', @p1+4, '127.0.0.1', NULL),
('publicacion', @p1+5, '10.0.0.5', NULL),
('publicacion', @p1+6, '127.0.0.1', NULL),
('publicacion', @p1+6, '10.0.0.6', NULL),
('publicacion', @p1+7, '127.0.0.1', NULL);
