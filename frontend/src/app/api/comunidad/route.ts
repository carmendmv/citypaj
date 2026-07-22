import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await fetch(`${BACKEND_URL}/api/comunidad?${searchParams.toString()}`);
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy comunidad:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/comunidad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error proxy comunidad POST:', error);
    return NextResponse.json({ success: false, error: 'Error de conexión' }, { status: 500 });
  }
}
