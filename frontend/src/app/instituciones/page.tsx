'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function InstitucionesPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    institucion: '',
    cargo: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario de contacto institucional:', formData);
    alert('Gracias por tu interés. Nos pondremos en contacto contigo pronto.');
    setFormData({
      nombre: '',
      email: '',
      institucion: '',
      cargo: '',
      mensaje: ''
    });
  };

  const BENEFICIOS = [
    {
      titulo: 'Participación Ciudadana',
      descripcion: 'Accede a las necesidades y propuestas reales de la juventud de tu territorio.'
    },
    {
      titulo: 'Escucha Joven',
      descripcion: 'Conoce directamente las preocupaciones, demandas e ideas de los jóvenes.'
    },
    {
      titulo: 'Observatorio de Necesidades',
      descripcion: 'Datos agregados y análisis sobre las necesidades juveniles por provincia.'
    },
    {
      titulo: 'Recursos Verificados',
      descripcion: 'Publica recursos oficiales y asegúrate de que lleguen a quien los necesita.'
    },
    {
      titulo: 'Comunidad Moderada',
      descripcion: 'Espacio seguro de participación con moderación y herramientas de gestión.'
    },
    {
      titulo: 'Estadísticas Territoriales',
      descripcion: 'Informes y métricas sobre el impacto de tus políticas juveniles.'
    }
  ];

  const MODALIDADES = [
    {
      nombre: 'Básico',
      precio: 'Contactar',
      features: [
        'Publicación de recursos oficiales',
        'Acceso a estadísticas básicas',
        'Panel de administración simple',
        'Soporte técnico básico'
      ],
      destacado: false
    },
    {
      nombre: 'Avanzado',
      precio: 'Contactar',
      features: [
        'Todo lo básico +',
        'Análisis de necesidades juveniles',
        'Informes territoriales personalizados',
        'Herramientas de participación avanzada',
        'Integración con sistemas municipales',
        'Soporte técnico prioritario'
      ],
      destacado: true
    },
    {
      nombre: 'Enterprise',
      precio: 'Contactar',
      features: [
        'Todo lo avanzado +',
        'IA interna de apoyo municipal',
        'API completa para integraciones',
        'Formación a técnicos municipales',
        'Desarrollo de funcionalidades a medida',
        'Gestor de cuenta dedicado'
      ],
      destacado: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Institucional */}
        <section className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-black mb-6">
            CityPAJ para Instituciones
          </h1>
          <p className="font-sans text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transforma la forma en que tu institución escucha, comprende y actúa 
            frente a las necesidades de la juventud. Una plataforma que conecta 
            voces jóvenes con acción institucional.
          </p>
        </section>

        {/* Propuesta de Valor */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Valor para Ayuntamientos y Diputaciones
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              CityPAJ no es solo una plataforma de anuncios. Es una herramienta estratégica 
              para la gestión pública juvenil moderna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFICIOS.map((beneficio, index) => (
              <div key={index} className="text-center p-6 border border-gray-300 hover:border-orange-500 transition-colors aspect-square flex flex-col justify-center">
                <h3 className="font-serif text-xl font-bold text-black mb-3">
                  {beneficio.titulo}
                </h3>
                <p className="font-sans text-gray-600">
                  {beneficio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo Funciona */}
        <section className="mb-20 bg-gray-50 p-8 border border-black">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Cómo Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-3">
                Implementación
              </h3>
              <p className="font-sans text-sm text-gray-600">
                Configuración personalizada de tu instancia de CityPAJ 
                con tu branding y necesidades específicas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-3">
                Formación
              </h3>
              <p className="font-sans text-sm text-gray-600">
                Capacitación a tus técnicos para gestionar la plataforma, 
                moderar contenido y analizar datos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-3">
                Participación
              </h3>
              <p className="font-sans text-sm text-gray-600">
                Los jóvenes comienzan a participar, compartir necesidades 
                y proponer mejoras para su territorio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                4
              </div>
              <h3 className="font-serif text-lg font-bold text-black mb-3">
                Acción
              </h3>
              <p className="font-sans text-sm text-gray-600">
                Tu institución accede a datos reales para tomar decisiones 
                informadas y mejorar políticas públicas.
              </p>
            </div>
          </div>
        </section>

        {/* IA Interna de Apoyo */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              IA Interna de Apoyo Municipal
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              Tecnología al servicio de la gestión pública, con supervisión humana 
              y control por roles. No decidimos por la ciudadanía, ayudamos a escucharla mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Clasificación automática de sugerencias',
              'Detección de temas repetidos',
              'Generación de borradores de informes',
              'Asistencia en moderación de contenido',
              'Orientación hacia recursos verificados',
              'Análisis de sentimiento y tendencias'
            ].map((funcion, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-300 rounded aspect-square justify-center">
                <span className="font-sans text-sm text-gray-700 text-center">{funcion}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-300 rounded max-w-3xl mx-auto">
            <h3 className="font-serif text-lg font-bold text-black mb-3">
              Principios Éticos
            </h3>
            <ul className="font-sans text-sm text-gray-700 space-y-2">
              <li>• Supervisión humana en todas las decisiones importantes</li>
              <li>• Trazabilidad completa de todas las acciones</li>
              <li>• Sin perfiles invasivos ni uso de datos personales sin consentimiento</li>
              <li>• La IA apoya, no sustituye a técnicos municipales</li>
              <li>• Transparencia en el funcionamiento y limitaciones del sistema</li>
            </ul>
          </div>
        </section>

        {/* Modalidades */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
              Modalidades de Servicio
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-3xl mx-auto">
              Soluciones adaptadas a diferentes tamaños y necesidades institucionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MODALIDADES.map((modalidad, index) => (
              <div key={index} className={`border-2 p-8 ${modalidad.destacado ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                {modalidad.destacado && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-medium">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold text-black mb-4 text-center">
                  {modalidad.nombre}
                </h3>
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-black">{modalidad.precio}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {modalidad.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="font-sans text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => document.getElementById('contacto-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-3 font-semibold border-2 transition-colors ${
                    modalidad.destacado
                      ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Solicitar Información
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Formulario de Contacto */}
        <section id="contacto-form" className="mb-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mb-4">
                Solicita una Demo
              </h2>
              <p className="font-sans text-lg text-gray-600">
                Cuéntanos sobre tu institución y te prepararemos una demo personalizada.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border border-black p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Institución
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institucion}
                    onChange={(e) => setFormData({...formData, institucion: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Ayuntamiento, Diputación, etc."
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                    placeholder="Tu cargo en la institución"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-black mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  className="w-full px-4 py-2 border border-black focus:outline-none focus:border-orange-500"
                  placeholder="Cuéntanos tus necesidades y qué te gustaría ver en la demo..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white font-semibold border-2 border-black hover:bg-orange-500 hover:border-orange-500 transition-colors"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center py-16 bg-black text-white">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            La juventud tiene voz. ¿Tu institución está escuchando?
          </h2>
          <p className="font-sans text-lg mb-8 text-white/90 max-w-3xl mx-auto">
            CityPAJ es el puente entre las necesidades juveniles y la acción institucional. 
            Únete a la transformación digital de la participación ciudadana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('contacto-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-white text-black font-semibold border-2 border-white hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              Solicitar Demo
            </button>
            <a
              href="/buzon-sugerencias"
              className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black transition-colors inline-block"
            >
              Ver Ejemplo Real
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
