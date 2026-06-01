import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      titulo, 
      descripcion, 
      categoria, 
      nombre, 
      comunidad_autonoma, 
      email, 
      telefono,
      turnstile_token 
    } = await request.json();

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !nombre || !comunidad_autonoma || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Conectar con backend real para guardar el anuncio
    const response = await fetch('http://localhost:3002/api/anuncios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.headers.get('authorization')?.replace('Bearer ', '') || ''}`
      },
      body: JSON.stringify({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        comunidad_autonoma: comunidad_autonoma.trim(),
        provincia: comunidad_autonoma, // Por ahora usamos la misma comunidad como provincia
        precio: null,
        modalidad: 'servicio',
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono || undefined,
        turnstile_token
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
    console.error('Error al publicar anuncio:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
