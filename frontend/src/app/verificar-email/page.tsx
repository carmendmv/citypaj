'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function VerificarEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se ha proporcionado un token de verificación.');
      return;
    }

    fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verificado correctamente.');
        } else {
          setStatus('error');
          setMessage(data.error || 'El token es inválido o ha caducado.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Error de conexión. Inténtalo de nuevo.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="w-[90%] sm:w-[65%] max-w-6xl mx-auto px-6 py-14">
        <div className="border border-black p-6 max-w-md mx-auto text-center">
          <h1 className="font-serif text-2xl font-bold text-black mb-4">Verificación de email</h1>
          <p className="font-sans text-sm text-gray-700 mb-6">{message}</p>
          {status !== 'loading' && (
            <Link
              href="/acceder"
              className="inline-block bg-black text-white px-6 py-2 font-sans text-sm hover:bg-orange-500 transition-colors"
            >
              {status === 'success' ? 'Iniciar sesión' : 'Volver'}
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VerificarEmailContent />
    </Suspense>
  );
}
