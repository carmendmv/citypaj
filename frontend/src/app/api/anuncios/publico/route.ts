import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

const CATEGORIA_MAP: Record<string, string> = {
  educacion: 'formacion',
  intercambios: 'comunidad',
  cultura: 'Cultura',
};

export async function POST(request: NextRequest) {
  try {
    const { 
      titulo, 
      descripcion, 
      categoria, 
      subcategoria,
      nombre, 
      comunidad_autonoma, 
      provincia,
      email, 
      telefono,
      cartel_url,
      precio,
      turnstile_token 
    } = await request.json();

    // Validaciones básicas
    if (!titulo || !descripcion || !categoria || !nombre || !comunidad_autonoma || !email) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const categoriaBackend = CATEGORIA_MAP[categoria] || categoria;
    const authHeader = request.headers.get('authorization') || '';

    // Conectar con backend real para guardar el anuncio
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (authHeader) {
      headers['Authorization'] = authHeader.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`;
    }

    const response = await fetch(`${BACKEND_URL}/api/anuncios`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoriaBackend,
        subcategoria: subcategoria || null,
        comunidad_autonoma: comunidad_autonoma.trim(),
        provincia: (provincia || comunidad_autonoma).trim(),
        precio: precio !== undefined && precio !== '' ? Number(precio) : undefined,
        modalidad: 'servicio',
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono || undefined,
        cartel_url: cartel_url || undefined,
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
