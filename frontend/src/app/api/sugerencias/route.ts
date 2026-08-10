import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = 'http://backend:3002';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { titulo, descripcion, categoria, prioridad } = body;
    
    if (!titulo || !descripcion || !categoria || !prioridad) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Aquí conectarías con tu backend real
    // Por ahora, simulamos el guardamiento y lo guardamos en localStorage como fallback
    const sugerencia = {
      id: Date.now().toString(),
      ...body,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    // Enviar sugerencia al backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/sugerencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: body.nombre?.trim(),
        email: body.email?.trim(),
        edad: body.edad,
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        solicitud_ayuntamiento: body.solicitud_ayuntamiento?.trim(),
        tipo: body.tipo || 'sugerencia',
        categoria: body.categoria || 'general',
        prioridad: body.prioridad || 'media',
        anonimo: body.anonimo || false,
        comunidad_autonoma: body.comunidad_autonoma
      })
    });

    const result = await backendResponse.json();

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error al procesar sugerencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await fetch(`${BACKEND_URL}/api/sugerencias?${searchParams.toString()}`);
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy sugerencias:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
