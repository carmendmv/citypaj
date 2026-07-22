import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comunidad/provincias`);
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy provincias:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
