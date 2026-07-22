import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/comunidad/publicacion/${params.id}`);
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy publicación:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
