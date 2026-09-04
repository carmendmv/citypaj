import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://backend:3002';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { motivo, descripcion } = body;

    if (!motivo) {
      return NextResponse.json(
        { success: false, error: 'El motivo es requerido' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization') || '';

    const response = await fetch(`${BACKEND_URL}/api/anuncios/${id}/reportar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify({
        motivo: motivo.trim(),
        descripcion: (descripcion || '').trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.error || 'Error del backend' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error reportando anuncio:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
