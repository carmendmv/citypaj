import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, password, turnstile_token } = await request.json();

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Nombre, email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Conectar con backend real para registro
    const response = await fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        nombre, 
        email, 
        password, 
        turnstile_token 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || 'Error al registrar usuario' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
