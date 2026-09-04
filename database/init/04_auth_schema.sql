-- Tablas adicionales para autenticación segura
-- Se ejecuta después de 01_schema.sql y los seeds

CREATE TABLE IF NOT EXISTS `auth_sessions` (
  `id` varchar(36) NOT NULL,
  `usuario_id` varchar(36) DEFAULT NULL,
  `refresh_token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `replaced_by_token_id` varchar(36) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sessions_usuario` (`usuario_id`),
  KEY `idx_sessions_token` (`refresh_token_hash`),
  KEY `idx_sessions_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_reset_usuario` (`usuario_id`),
  KEY `idx_reset_token` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_verification_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_verify_usuario` (`usuario_id`),
  KEY `idx_verify_token` (`token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `auth_audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` varchar(36) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `evento` varchar(50) NOT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `resultado` varchar(50) NOT NULL,
  `detalles` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_auth_audit_evento` (`evento`),
  KEY `idx_auth_audit_usuario` (`usuario_id`),
  KEY `idx_auth_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
