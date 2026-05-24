import { NextRequest, NextResponse } from 'next/server';

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

    // Simular API call al backend
    console.log('Sugerencia recibida:', sugerencia);
    
    // En un entorno real, aquí harías:
    // const response = await fetch('http://localhost:3002/api/sugerencias', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(sugerencia)
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Sugerencia guardada correctamente',
        id: sugerencia.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al procesar sugerencia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Aquí obtendrías las estadísticas del backend
    return NextResponse.json({
      total: 0,
      porCategoria: {},
      porPrioridad: {},
      recientes: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
