-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: citypaj
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_activity_logs`
--

DROP TABLE IF EXISTS `admin_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `entidad` varchar(100) DEFAULT NULL,
  `entidad_id` varchar(255) DEFAULT NULL,
  `detalles` text DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_tareas`
--

DROP TABLE IF EXISTS `admin_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('pendiente','en_progreso','completada','cancelada') DEFAULT 'pendiente',
  `prioridad` enum('baja','media','alta','urgente') DEFAULT 'media',
  `asignado_a` varchar(36) DEFAULT NULL,
  `creado_por` varchar(36) DEFAULT NULL,
  `entidad_tipo` varchar(50) DEFAULT NULL,
  `entidad_id` varchar(255) DEFAULT NULL,
  `vencimiento` datetime DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agenda_notas`
--

DROP TABLE IF EXISTS `agenda_notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agenda_notas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `cuerpo` text DEFAULT NULL,
  `fecha` date NOT NULL,
  `color` varchar(20) DEFAULT 'orange',
  `usuario_id` varchar(36) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anuncios`
--

DROP TABLE IF EXISTS `anuncios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anuncios` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `usuario_id` varchar(36) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `subcategoria` varchar(50) DEFAULT NULL,
  `comunidad_id` int(11) NOT NULL,
  `provincia_id` int(11) NOT NULL,
  `comunidad_autonoma` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `barrio` varchar(100) DEFAULT NULL,
  `modalidad` enum('venta','regalo','intercambio','servicio','compra') NOT NULL,
  `contacto_email` tinyint(1) DEFAULT 1,
  `contacto_telefono` tinyint(1) DEFAULT 1,
  `contacto_anonimo` tinyint(1) DEFAULT 0,
  `visible` tinyint(1) DEFAULT 1,
  `estado_moderacion` enum('pending','approved','rejected','flagged') DEFAULT 'pending',
  `motivo_rechazo` text DEFAULT NULL,
  `vistas` int(11) DEFAULT 0,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `precio` decimal(10,2) DEFAULT NULL,
  `ip_creador` varchar(45) DEFAULT NULL,
  `cartel_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_comunidad` (`comunidad_id`),
  KEY `idx_provincia` (`provincia_id`),
  KEY `idx_estado` (`estado_moderacion`),
  KEY `idx_visible` (`visible`),
  KEY `idx_anuncios_provincia` (`provincia`),
  FULLTEXT KEY `idx_busqueda` (`titulo`,`descripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anuncios_guardados`
--

DROP TABLE IF EXISTS `anuncios_guardados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anuncios_guardados` (
  `id` varchar(36) NOT NULL,
  `usuario_id` varchar(36) NOT NULL,
  `anuncio_id` varchar(36) NOT NULL,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`anuncio_id`),
  KEY `anuncio_id` (`anuncio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunicaciones_adjuntos`
--

DROP TABLE IF EXISTS `comunicaciones_adjuntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunicaciones_adjuntos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comunicacion_id` int(11) NOT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_guardado` varchar(255) NOT NULL,
  `tipo_mime` varchar(100) NOT NULL,
  `tamano` int(11) NOT NULL,
  `ruta_storage` varchar(500) NOT NULL,
  `subido_por` varchar(36) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_comunicacion` (`comunicacion_id`),
  CONSTRAINT `fk_com_adj_com` FOREIGN KEY (`comunicacion_id`) REFERENCES `comunicaciones_institucionales` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunicaciones_entidades`
--

DROP TABLE IF EXISTS `comunicaciones_entidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunicaciones_entidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comunicacion_id` int(11) NOT NULL,
  `entidad_tipo` varchar(50) NOT NULL,
  `entidad_id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunicaciones_institucionales`
--

DROP TABLE IF EXISTS `comunicaciones_institucionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunicaciones_institucionales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) DEFAULT NULL,
  `contacto_id` int(11) DEFAULT NULL,
  `remitente_id` varchar(36) DEFAULT NULL,
  `asunto` varchar(255) NOT NULL,
  `cuerpo` text NOT NULL,
  `estado` enum('borrador','enviado','programada','cancelada') DEFAULT 'borrador',
  `provincia` varchar(100) DEFAULT NULL,
  `comunidad_autonoma` varchar(100) DEFAULT NULL,
  `institucion` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `email_destino` varchar(255) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunidad_comentarios`
--

DROP TABLE IF EXISTS `comunidad_comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunidad_comentarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `publicacion_id` int(11) NOT NULL,
  `usuario_id` varchar(36) DEFAULT NULL,
  `autor_nombre` varchar(100) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `contenido` text NOT NULL,
  `visible` tinyint(1) DEFAULT 1,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado_moderacion` enum('pending','approved','rejected','flagged') NOT NULL DEFAULT 'approved',
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `publicacion_id` (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `comunidad_comentarios_ibfk_1` FOREIGN KEY (`publicacion_id`) REFERENCES `comunidad_publicaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comunidad_comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunidad_likes`
--

DROP TABLE IF EXISTS `comunidad_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunidad_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('publicacion','respuesta') DEFAULT NULL,
  `objeto_id` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_like` (`tipo`,`objeto_id`,`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunidad_publicaciones`
--

DROP TABLE IF EXISTS `comunidad_publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunidad_publicaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `autor_nombre` varchar(100) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `tema` varchar(50) NOT NULL,
  `visible` tinyint(1) DEFAULT 1,
  `estado_moderacion` enum('pending','approved','rejected','flagged') DEFAULT 'approved',
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ip_creador` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_provincia` (`provincia`),
  KEY `idx_tema` (`tema`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `comunidad_publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunidad_reportes`
--

DROP TABLE IF EXISTS `comunidad_reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunidad_reportes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `autor_nombre` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `tipo` enum('publicacion','respuesta') NOT NULL,
  `objeto_id` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'pendiente',
  `nota_moderacion` text DEFAULT NULL,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `revisado` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_objeto` (`tipo`,`objeto_id`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comunidades`
--

DROP TABLE IF EXISTS `comunidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comunidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contactos_institucionales`
--

DROP TABLE IF EXISTS `contactos_institucionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactos_institucionales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institucion` varchar(255) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `area_departamento` varchar(255) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `comunidad_autonoma` varchar(100) DEFAULT NULL,
  `email_oficial` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `persona_contacto` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','verificado','inactivo') DEFAULT 'pendiente',
  `verificado` tinyint(1) DEFAULT 0,
  `verificado_at` timestamp NULL DEFAULT NULL,
  `verificado_por` varchar(36) DEFAULT NULL,
  `notas_internas` text DEFAULT NULL,
  `creado_por` varchar(36) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT 0.00,
  `ubicacion` varchar(255) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT 1,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_creador` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fecha` (`fecha_inicio`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_provincia` (`provincia`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) NOT NULL,
  `anuncio_id` varchar(36) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorito` (`usuario_id`,`anuncio_id`),
  KEY `anuncio_id` (`anuncio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mensajes_adjuntos`
--

DROP TABLE IF EXISTS `mensajes_adjuntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensajes_adjuntos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mensaje_id` int(11) NOT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `nombre_guardado` varchar(255) NOT NULL,
  `tipo_mime` varchar(100) NOT NULL,
  `tamano` int(11) NOT NULL,
  `ruta_storage` varchar(500) NOT NULL,
  `subido_por` varchar(36) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_mensaje` (`mensaje_id`),
  CONSTRAINT `fk_adjunto_mensaje` FOREIGN KEY (`mensaje_id`) REFERENCES `mensajes_staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mensajes_entidades_adjuntas`
--

DROP TABLE IF EXISTS `mensajes_entidades_adjuntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensajes_entidades_adjuntas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mensaje_id` int(11) NOT NULL,
  `entidad_tipo` varchar(50) NOT NULL,
  `entidad_id` varchar(36) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mensajes_staff`
--

DROP TABLE IF EXISTS `mensajes_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensajes_staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `remitente_id` varchar(36) NOT NULL,
  `destinatario_id` varchar(36) DEFAULT NULL,
  `asunto` varchar(255) NOT NULL,
  `cuerpo` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `leido_at` timestamp NULL DEFAULT NULL,
  `anuncio_id` varchar(36) DEFAULT NULL,
  `padre_id` int(11) DEFAULT NULL,
  `prioridad` enum('baja','normal','alta','urgente') DEFAULT 'normal',
  `estado` enum('borrador','enviado') DEFAULT 'enviado',
  `eliminado_remitente` tinyint(1) DEFAULT 0,
  `eliminado_destinatario` tinyint(1) DEFAULT 0,
  `archivado_remitente` tinyint(1) DEFAULT 0,
  `archivado_destinatario` tinyint(1) DEFAULT 0,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `moderacion_logs`
--

DROP TABLE IF EXISTS `moderacion_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `moderacion_logs` (
  `id` varchar(36) NOT NULL,
  `anuncio_id` varchar(36) NOT NULL,
  `moderador_id` varchar(36) NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) NOT NULL,
  `notas` text DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_anuncio` (`anuncio_id`),
  KEY `idx_moderador` (`moderador_id`),
  KEY `idx_creado` (`creado_at`),
  CONSTRAINT `fk_moderacion_logs_anuncio` FOREIGN KEY (`anuncio_id`) REFERENCES `anuncios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_moderacion_logs_moderador` FOREIGN KEY (`moderador_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plantillas_comunicacion`
--

DROP TABLE IF EXISTS `plantillas_comunicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plantillas_comunicacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `cuerpo` text NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(100) DEFAULT 'institucional',
  `activa` tinyint(1) DEFAULT 1,
  `eliminada` tinyint(1) DEFAULT 0,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `creado_por` varchar(36) DEFAULT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `propuestas`
--

DROP TABLE IF EXISTS `propuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propuestas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `apoyos` int(11) DEFAULT 0,
  `visible` tinyint(1) DEFAULT 1,
  `estado_moderacion` enum('pending','approved','rejected','flagged') DEFAULT 'approved',
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `trasladada` tinyint(1) NOT NULL DEFAULT 0,
  `trasladada_at` timestamp NULL DEFAULT NULL,
  `trasladada_por` varchar(36) DEFAULT NULL,
  `ip_creador` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_provincia` (`provincia`),
  KEY `idx_categoria` (`categoria`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `propuestas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `propuestas_apoyos`
--

DROP TABLE IF EXISTS `propuestas_apoyos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propuestas_apoyos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propuesta_id` int(11) NOT NULL,
  `usuario_id` varchar(36) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_apoyo` (`propuesta_id`,`usuario_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `propuestas_apoyos_ibfk_1` FOREIGN KEY (`propuesta_id`) REFERENCES `propuestas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `propuestas_apoyos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `provincias`
--

DROP TABLE IF EXISTS `provincias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provincias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `comunidad_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_provincia_comunidad` (`nombre`,`comunidad_id`),
  KEY `idx_comunidad` (`comunidad_id`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `visible` tinyint(1) DEFAULT 1,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_provincia` (`provincia`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reportes_anuncios`
--

DROP TABLE IF EXISTS `reportes_anuncios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reportes_anuncios` (
  `id` varchar(36) NOT NULL,
  `anuncio_id` varchar(36) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creado` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(50) DEFAULT 'pendiente',
  `nota_moderacion` text DEFAULT NULL,
  `revisado_por` varchar(36) DEFAULT NULL,
  `revisado_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `anuncio_id` (`anuncio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sugerencias`
--

DROP TABLE IF EXISTS `sugerencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sugerencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `edad` varchar(20) DEFAULT NULL,
  `categoria` enum('educacion','empleo','ocio','deportes','salud','vivienda','transporte','tecnologia','medioambiente','participacion','inclusion','otros') NOT NULL,
  `prioridad` enum('baja','media','alta','critica') NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `solicitud_ayuntamiento` text DEFAULT NULL,
  `anonimo` tinyint(1) DEFAULT 0,
  `comunidad_autonoma` varchar(100) NOT NULL,
  `fecha` datetime NOT NULL,
  `estado` enum('pendiente','revisada','en_progreso','resuelta','rechazada') DEFAULT 'pendiente',
  `trasladada` tinyint(1) NOT NULL DEFAULT 0,
  `trasladada_at` timestamp NULL DEFAULT NULL,
  `trasladada_por` varchar(36) DEFAULT NULL,
  `ip_creador` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_prioridad` (`prioridad`),
  KEY `idx_estado` (`estado`),
  KEY `idx_comunidad` (`comunidad_autonoma`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_estado_prioridad` (`estado`,`prioridad`),
  KEY `idx_busqueda` (`comunidad_autonoma`,`categoria`,`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=42680 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rol` varchar(20) NOT NULL DEFAULT 'usuario',
  `provincia` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `ultima_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuarios_provincia` (`provincia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-22 14:38:45
