import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = 'http://backend:3002';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { anuncio_id, motivo, descripcion } = await request.json();

    if (!anuncio_id || !motivo) {
      return NextResponse.json(
        { success: false, error: 'ID de anuncio y motivo son obligatorios' },
        { status: 400 }
      );
    }

    // Obtener token de autorización (opcional para reportes anónimos)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    // Conectar con backend real para reportar anuncio
    const response = await fetch(`${BACKEND_URL}/api/anuncios/reportar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ 
        anuncio_id, 
        motivo: motivo.trim(),
        descripcion: descripcion?.trim() || ''
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
