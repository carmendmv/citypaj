import { NextResponse } from 'next/server';
const BACKEND_URL = 'http://backend:3002';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/estadisticas/home`);
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy estadísticas:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
