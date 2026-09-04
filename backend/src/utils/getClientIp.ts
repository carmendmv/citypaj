import { Request } from 'express';

export interface ClientIpInfo {
  clientIp: string;
  source: 'req.ip' | 'socket.remoteAddress' | 'unknown';
  rawRemoteAddress: string | undefined;
  xForwardedFor: string | undefined;
  xRealIp: string | undefined;
  forwarded: string | undefined;
  trustedProxyEnabled: boolean;
}

function normalizeHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function getClientIpInfo(req: Request): ClientIpInfo {
  const rawRemoteAddress = req.socket?.remoteAddress;
  const xForwardedFor = normalizeHeader(req.headers['x-forwarded-for']);
  const xRealIp = normalizeHeader(req.headers['x-real-ip']);
  const forwarded = normalizeHeader(req.headers['forwarded']);

  const trustProxy = req.app.get('trust proxy');
  const trustedProxyEnabled = Boolean(trustProxy) && trustProxy !== false;

  if (trustedProxyEnabled && req.ip) {
    return {
      clientIp: req.ip,
      source: 'req.ip',
      rawRemoteAddress,
      xForwardedFor,
      xRealIp,
      forwarded,
      trustedProxyEnabled,
    };
  }

  return {
    clientIp: rawRemoteAddress || 'unknown',
    source: 'socket.remoteAddress',
    rawRemoteAddress,
    xForwardedFor,
    xRealIp,
    forwarded,
    trustedProxyEnabled,
  };
}

export function getClientIp(req: Request): string {
  return getClientIpInfo(req).clientIp;
}
