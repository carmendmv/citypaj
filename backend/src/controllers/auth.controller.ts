import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createTransport } from 'nodemailer';
import { AuthRequest } from '../middleware/auth';
import { pool } from '../config/database';
import { config } from '../config';
import { logger } from '../utils/logger';
import { getClientIpInfo, ClientIpInfo } from '../utils/getClientIp';

const REFRESH_COOKIE_NAME = 'citypaj_refresh_token';
const GENERIC_AUTH_ERROR = 'Email o contraseña incorrectos';
const GENERIC_USER_ERROR = 'Usuario o contraseña incorrectos';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  nombre: string;
  verificado: number;
  activo: number;
  rol: string;
  intentos_fallidos: number;
  bloqueado_hasta: Date | null;
  ultima_ip?: string | null;
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

function getUserAgent(req: Request): string {
  return req.get('User-Agent') || 'unknown';
}

function parseCookies(req: Request): Record<string, string> {
  const cookie = req.headers.cookie;
  if (!cookie) return {};
  const result: Record<string, string> = {};
  cookie.split(';').forEach((part) => {
    const [key, ...value] = part.trim().split('=');
    if (key) result[key] = value.join('=');
  });
  return result;
}

function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

async function auditLog(
  connection: any,
  evento: string,
  usuarioId: string | null,
  email: string | null,
  resultado: string,
  ipInfo: ClientIpInfo,
  userAgent: string,
  detalles?: string
): Promise<void> {
  try {
    await connection.execute(
      `INSERT INTO auth_audit_logs (usuario_id, email, evento, ip, remote_address, x_forwarded_for, user_agent, resultado, detalles)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        email,
        evento,
        ipInfo.clientIp,
        ipInfo.rawRemoteAddress || null,
        ipInfo.xForwardedFor || null,
        userAgent,
        resultado,
        detalles || null,
      ]
    );
  } catch (err) {
    logger.error('Error escribiendo auth_audit_log', { error: (err as Error).message });
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const emailConfig = config.email;
  const from = emailConfig.from || 'noreply@citypaj.es';

  if (!emailConfig.host || !emailConfig.auth.user) {
    logger.info('Email no configurado. Enlace en modo desarrollo:');
    logger.info(`  To: ${to}`);
    logger.info(`  Subject: ${subject}`);
    logger.info(`  Body preview: ${html.replace(/<[^>]+>/g, '').slice(0, 200)}`);
    return;
  }

  const transporter = createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });

  await transporter.sendMail({ from, to, subject, html });
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol || 'usuario',
    verificado: Boolean(user.verificado),
    activo: Boolean(user.activo),
  };
}

function isAccountLocked(user: UserRow): boolean {
  if (!user.bloqueado_hasta) return false;
  return new Date(user.bloqueado_hasta).getTime() > Date.now();
}

// =========================
// Registro
// =========================
export const register = async (req: Request, res: Response): Promise<void> => {
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const { email: rawEmail, password, confirmPassword, nombre } = req.body;
    const email = (rawEmail || '').trim().toLowerCase();
    const nombreTrim = (nombre || '').trim();

    if (!email || !password || !nombreTrim) {
      res.status(400).json({ success: false, error: 'Email, contraseña y nombre son obligatorios' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, error: 'Email no válido' });
      return;
    }

    if (password.length < 8 || password.length > 128) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener entre 8 y 128 caracteres' });
      return;
    }

    if (confirmPassword && confirmPassword !== password) {
      res.status(400).json({ success: false, error: 'Las contraseñas no coinciden' });
      return;
    }

    if (nombreTrim.length < 2 || nombreTrim.length > 100) {
      res.status(400).json({ success: false, error: 'El nombre debe tener entre 2 y 100 caracteres' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.execute(
        'SELECT id FROM usuarios WHERE LOWER(email) = ?',
        [email]
      );

      if ((existing as any[]).length > 0) {
        res.status(409).json({ success: false, error: 'El email ya está registrado' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds || 12);
      const userId = crypto.randomUUID();
      const verificado = config.features.emailVerification ? 0 : 1;

      await connection.execute(
        `INSERT INTO usuarios (id, email, password_hash, nombre, verificado, activo, rol, ip_registro, user_agent_registro, creado_at, actualizado_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, passwordHash, nombreTrim, verificado, 1, 'usuario', ipInfo.clientIp, userAgent, new Date(), new Date()]
      );

      const response: any = {
        success: true,
        message: 'Usuario registrado correctamente',
        data: {
          user: {
            id: userId,
            email,
            nombre: nombreTrim,
            rol: 'usuario',
            verificado: Boolean(verificado),
          },
          requiresVerification: false,
        },
      };

      if (config.features.emailVerification) {
        response.data.requiresVerification = true;
        const token = generateSecureToken();
        const tokenHash = sha256(token);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await connection.execute(
          `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
           VALUES (?, ?, ?)`,
          [userId, tokenHash, expiresAt]
        );

        const verificationUrl = `${config.frontendUrl}/verificar-email?token=${token}`;

        const html = `<p>Para verificar tu cuenta en CityPAJ, haz clic en el siguiente enlace:</p>
                        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                        <p>Si no has solicitado este registro, ignora este mensaje.</p>`;

        await sendEmail(email, 'Verifica tu cuenta en CityPAJ', html);

        if (config.env === 'development') {
          response.data.debugVerificationUrl = verificationUrl;
        }
      }

      await auditLog(connection, 'register_success', userId, email, 'success', ipInfo, userAgent);
      res.status(201).json(response);
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en registro:', { error: (error as Error).message, stack: (error as Error).stack });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Login
// =========================
export const login = async (req: Request, res: Response): Promise<void> => {
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const { email: rawEmail, password } = req.body;
    const email = (rawEmail || '').trim().toLowerCase();

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email y contraseña son obligatorios' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, email, password_hash, nombre, verificado, activo, rol, intentos_fallidos, bloqueado_hasta
         FROM usuarios WHERE LOWER(email) = ?`,
        [email]
      );

      const user = ((rows as any[])[0] as UserRow) || null;

      if (!user) {
        await auditLog(connection, 'login_failed', null, email, 'failed', ipInfo, userAgent, 'Usuario no encontrado');
        res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
        return;
      }

      if (user.activo !== 1) {
        await auditLog(connection, 'login_failed', user.id, email, 'failed', ipInfo, userAgent, 'Cuenta inactiva');
        res.status(401).json({ success: false, error: GENERIC_USER_ERROR });
        return;
      }

      if (isAccountLocked(user)) {
        await auditLog(connection, 'account_locked', user.id, email, 'blocked', ipInfo, userAgent);
        res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        const attempts = (user.intentos_fallidos || 0) + 1;
        const maxAttempts = config.security.maxLoginAttempts || 5;
        const lockoutTime = config.security.lockoutTime || 15 * 60 * 1000;
        const bloqueado = attempts >= maxAttempts ? new Date(Date.now() + lockoutTime) : null;

        await connection.execute(
          `UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?`,
          [attempts, bloqueado, user.id]
        );

        await auditLog(connection, 'login_failed', user.id, email, 'failed', ipInfo, userAgent, `Intentos: ${attempts}`);
        res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
        return;
      }

      // Resetear intentos
      await connection.execute(
        `UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_login_at = ?, ultima_ip = ?, ultimo_login_user_agent = ? WHERE id = ?`,
        [new Date(), ipInfo.clientIp, userAgent, user.id]
      );

      // Sesión / refresh token
      const refreshToken = generateSecureToken(32);
      const refreshTokenHash = sha256(refreshToken);
      const sessionId = crypto.randomUUID();
      const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await connection.execute(
        `INSERT INTO auth_sessions (id, usuario_id, refresh_token_hash, expires_at, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sessionId, user.id, refreshTokenHash, refreshExpiresAt, ipInfo.clientIp, userAgent]
      );

      // Access token
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol, verificado: Boolean(user.verificado) },
        config.jwt.secret as jwt.Secret,
        { expiresIn: config.jwt.expiresIn || '15m' } as jwt.SignOptions
      );

      setRefreshCookie(res, refreshToken, refreshExpiresAt);

      await auditLog(connection, 'login_success', user.id, email, 'success', ipInfo, userAgent);

      res.status(200).json({
        success: true,
        message: 'Login correcto',
        data: {
          user: publicUser(user),
          accessToken,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en login:', { error: (error as Error).message, stack: (error as Error).stack });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Usuario actual
// =========================
export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'No autenticado' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, email, password_hash, nombre, verificado, activo, rol, intentos_fallidos, bloqueado_hasta
         FROM usuarios WHERE id = ?`,
        [req.user.id]
      );

      const user = ((rows as any[])[0] as UserRow) || null;
      if (!user) {
        res.status(401).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json({ success: true, data: publicUser(user) });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en me:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Logout
// =========================
export const logout = async (req: Request, res: Response): Promise<void> => {
  const cookies = parseCookies(req);
  const token = cookies[REFRESH_COOKIE_NAME];
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const connection = await pool.getConnection();
    try {
      if (token) {
        const tokenHash = sha256(token);
        await connection.execute(
          `UPDATE auth_sessions SET revoked_at = ? WHERE refresh_token_hash = ?`,
          [new Date(), tokenHash]
        );

        const [sessions] = await connection.execute(
          `SELECT usuario_id FROM auth_sessions WHERE refresh_token_hash = ?`,
          [tokenHash]
        );

        const userId = (sessions as any[])[0]?.usuario_id || null;
        if (userId) {
          await auditLog(connection, 'logout', userId, null, 'success', ipInfo, userAgent);
        }
      }

      clearRefreshCookie(res);
      res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en logout:', { error: (error as Error).message });
    clearRefreshCookie(res);
    res.status(200).json({ success: true, message: 'Sesión cerrada' });
  }
};

// =========================
// Refresh token
// =========================
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const cookies = parseCookies(req);
  const token = cookies[REFRESH_COOKIE_NAME];
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  if (!token) {
    res.status(401).json({ success: false, error: 'Sesión no válida' });
    return;
  }

  const connection = await pool.getConnection();
  try {
    const tokenHash = sha256(token);

    const [sessions] = await connection.execute(
      `SELECT s.id, s.usuario_id, s.expires_at, u.id as user_id, u.email, u.nombre, u.rol, u.activo, u.verificado
       FROM auth_sessions s
       JOIN usuarios u ON s.usuario_id = u.id
       WHERE s.refresh_token_hash = ? AND s.expires_at > ? AND s.revoked_at IS NULL`,
      [tokenHash, new Date()]
    );

    const session = (sessions as any[])[0];
    if (!session || session.activo !== 1) {
      await auditLog(connection, 'login_failed', session?.usuario_id || null, null, 'failed', ipInfo, userAgent, 'Refresh token inválido');
      res.status(401).json({ success: false, error: 'Sesión no válida' });
      return;
    }

    // Revocar sesión anterior y crear nueva
    const newSessionId = crypto.randomUUID();
    const newRefreshToken = generateSecureToken(32);
    const newRefreshTokenHash = sha256(newRefreshToken);
    const newRefreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await connection.execute(
      `UPDATE auth_sessions SET revoked_at = ?, replaced_by_token_id = ? WHERE id = ?`,
      [new Date(), newSessionId, session.id]
    );

    await connection.execute(
      `INSERT INTO auth_sessions (id, usuario_id, refresh_token_hash, expires_at, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [newSessionId, session.user_id, newRefreshTokenHash, newRefreshExpiresAt, ipInfo.clientIp, userAgent]
    );

    const accessToken = jwt.sign(
      { id: session.user_id, email: session.email, nombre: session.nombre, rol: session.rol, verificado: Boolean(session.verificado) },
      config.jwt.secret as jwt.Secret,
      { expiresIn: config.jwt.expiresIn || '15m' } as jwt.SignOptions
    );

    setRefreshCookie(res, newRefreshToken, newRefreshExpiresAt);

    await auditLog(connection, 'login_success', session.user_id, session.email, 'success', ipInfo, userAgent, 'Refresh token rotado');

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    logger.error('Error en refresh token:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
};

// =========================
// Recuperación de contraseña
// =========================
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const { email: rawEmail } = req.body;
    const email = (rawEmail || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, error: 'Email no válido' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, email FROM usuarios WHERE LOWER(email) = ?',
        [email]
      );

      const user = (rows as any[])[0];
      if (user) {
        const token = generateSecureToken(32);
        const tokenHash = sha256(token);
        const expiresAt = new Date(Date.now() + (config.security.passwordResetTokenMinutes || 30) * 60 * 1000);

        await connection.execute(
          `INSERT INTO password_reset_tokens (usuario_id, token_hash, expires_at, ip)
           VALUES (?, ?, ?, ?)`,
          [user.id, tokenHash, expiresAt, ipInfo.clientIp]
        );

        const resetUrl = `${config.frontendUrl}/recuperar-contrasena?token=${token}`;

        const html = `<p>Has solicitado restablecer tu contraseña en CityPAJ. Haz clic en el enlace:</p>
                        <p><a href="${resetUrl}">${resetUrl}</a></p>
                        <p>El enlace expira en 30 minutos. Si no lo solicitaste, ignora este mensaje.</p>`;

        await sendEmail(email, 'Recuperación de contraseña - CityPAJ', html);

        if (config.env === 'development') {
          logger.info(`[DEV] Reset URL para ${email}: ${resetUrl}`);
        }
      }

      await auditLog(connection, 'password_reset_requested', user?.id || null, email, 'success', ipInfo, userAgent);

      res.status(200).json({
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para restablecer la contraseña',
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en forgot-password:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Restablecer contraseña
// =========================
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ success: false, error: 'Token y nueva contraseña son obligatorios' });
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ success: false, error: 'La contraseña debe tener entre 8 y 128 caracteres' });
      return;
    }

    const tokenHash = sha256(token);
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, usuario_id FROM password_reset_tokens
         WHERE token_hash = ? AND expires_at > ? AND used_at IS NULL`,
        [tokenHash, new Date()]
      );

      const tokenRow = (rows as any[])[0];
      if (!tokenRow) {
        res.status(400).json({ success: false, error: 'Token inválido o caducado' });
        return;
      }

      const passwordHash = await bcrypt.hash(newPassword, config.security.bcryptRounds || 12);

      await connection.execute(
        `UPDATE usuarios SET password_hash = ?, actualizado_at = ? WHERE id = ?`,
        [passwordHash, new Date(), tokenRow.usuario_id]
      );

      await connection.execute(
        `UPDATE password_reset_tokens SET used_at = ? WHERE id = ?`,
        [new Date(), tokenRow.id]
      );

      // Revocar sesiones anteriores
      await connection.execute(
        `UPDATE auth_sessions SET revoked_at = ? WHERE usuario_id = ? AND revoked_at IS NULL`,
        [new Date(), tokenRow.usuario_id]
      );

      await auditLog(connection, 'password_reset_success', tokenRow.usuario_id, null, 'success', ipInfo, userAgent);

      clearRefreshCookie(res);

      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada correctamente',
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en reset-password:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Verificación de email
// =========================
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const ipInfo = getClientIpInfo(req);
  const userAgent = getUserAgent(req);

  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, error: 'Token obligatorio' });
      return;
    }

    const tokenHash = sha256(token);
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, usuario_id FROM email_verification_tokens
         WHERE token_hash = ? AND expires_at > ? AND used_at IS NULL`,
        [tokenHash, new Date()]
      );

      const tokenRow = (rows as any[])[0];
      if (!tokenRow) {
        res.status(400).json({ success: false, error: 'Token inválido o caducado' });
        return;
      }

      await connection.execute(
        `UPDATE usuarios SET verificado = 1, actualizado_at = ? WHERE id = ?`,
        [new Date(), tokenRow.usuario_id]
      );

      await connection.execute(
        `UPDATE email_verification_tokens SET used_at = ? WHERE id = ?`,
        [new Date(), tokenRow.id]
      );

      await auditLog(connection, 'email_verified', tokenRow.usuario_id, null, 'success', ipInfo, userAgent);

      res.status(200).json({
        success: true,
        message: 'Email verificado correctamente',
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error en verify-email:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// =========================
// Actualizar perfil
// =========================
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'No autenticado' });
      return;
    }

    const { nombre } = req.body;
    const nombreTrim = (nombre || '').trim();

    if (!nombreTrim || nombreTrim.length < 2 || nombreTrim.length > 100) {
      res.status(400).json({ success: false, error: 'El nombre debe tener entre 2 y 100 caracteres' });
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'UPDATE usuarios SET nombre = ?, actualizado_at = ? WHERE id = ?',
        [nombreTrim, new Date(), userId]
      );

      res.status(200).json({ success: true, data: { id: userId, nombre: nombreTrim } });
    } finally {
      connection.release();
    }
  } catch (error) {
    logger.error('Error actualizando perfil:', { error: (error as Error).message });
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
