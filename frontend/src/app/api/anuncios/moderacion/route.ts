import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = 'http://backend:3002';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';

    const response = await fetch(`${BACKEND_URL}/api/anuncios/moderacion`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy moderación:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
