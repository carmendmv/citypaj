import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-black mb-4">Política de Privacidad</h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">1. Información que Recopilamos</h2>
            <p className="mb-4">
              En CityPAJ recopilamos información personal que nos proporcionas voluntariamente 
              al utilizar nuestros servicios, incluyendo:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Información sobre anuncios publicados</li>
              <li>Datos de uso y preferencias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">2. Uso de la Información</h2>
            <p className="mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Facilitar la comunicación entre usuarios</li>
              <li>Mejorar la calidad de nuestros servicios</li>
              <li>Enviar notificaciones importantes</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">3. Compartir Información</h2>
            <p className="mb-4">
              No vendemos tu información personal a terceros. Solo compartimos tu información 
              en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Con tu consentimiento explícito</li>
              <li>Para facilitar transacciones entre usuarios</li>
              <li>Cuando sea requerido por ley</li>
              <li>Para proteger nuestros derechos y seguridad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">4. Seguridad de Datos</h2>
            <p className="mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu 
              información contra acceso no autorizado, alteración o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">5. Derechos del Usuario</h2>
            <p className="mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar eliminación de tu información</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Portabilidad de tus datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">6. Cookies</h2>
            <p className="mb-4">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
              analizar el uso del sitio y personalizar contenido.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">7. Menores de Edad</h2>
            <p className="mb-4">
              CityPAJ está dirigido a mayores de 18 años. No recopilamos intencionadamente 
              información de menores de 18 años.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">8. Cambios en esta Política</h2>
            <p className="mb-4">
              Podemos actualizar esta política de privacidad periódicamente. Te notificaremos 
              cualquier cambio significativo a través de nuestros servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-black mb-4">9. Contacto</h2>
            <p className="mb-4">
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> privacidad@citypaj.es</p>
              <p><strong>Teléfono:</strong> 900 123 456</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/" 
            className="inline-flex items-center text-black hover:text-orange-500 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
