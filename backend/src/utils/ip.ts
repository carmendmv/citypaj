import { Request } from 'express';

export function getClientIp(req: Request): string {
  const xf = req.headers['x-forwarded-for'];
  if (Array.isArray(xf)) {
    return xf[0]?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress || '0.0.0.0';
  }
  if (typeof xf === 'string' && xf) {
    return xf.split(',')[0].trim() || req.ip || req.socket?.remoteAddress || '0.0.0.0';
  }
  return req.ip || req.socket?.remoteAddress || '0.0.0.0';
}
