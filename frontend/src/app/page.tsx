'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              CityPaj
            </h1>
            <p className="text-gray-600">
              Tu ciudad, tus anuncios, tu comunidad
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Bienvenido a CityPaj
          </h2>
          <p className="text-xl mb-8">
            La plataforma de anuncios juvenil del siglo XXI
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            CityPaj está funcionando correctamente
          </h3>
          <p className="text-gray-600 mb-8">
            Backend: http://localhost:3001/api/health
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">
              ✅ Frontend funcional
            </h4>
            <p className="text-gray-600">
              Aplicación Next.js 14 con App Router funcionando correctamente
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 CityPaj. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
