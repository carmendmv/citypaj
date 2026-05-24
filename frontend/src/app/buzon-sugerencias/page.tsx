'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BuzonSugerencias() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    categoria: '',
    prioridad: '',
    titulo: '',
    descripcion: '',
    solicitud_ayuntamiento: '',
    anonimo: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.categoria || !formData.prioridad) {
      setSubmitMessage('Por favor, completa los campos obligatorios marcados con *');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          comunidad_autonoma: 'Todas',
          fecha: new Date().toISOString(),
          estado: 'pendiente'
        }),
      });

      if (response.ok) {
        setSubmitMessage('¡Gracias por tu sugerencia! La hemos recibido correctamente y será analizada por el equipo.');
        // Resetear formulario
        setFormData({
          nombre: '',
          email: '',
          edad: '',
          categoria: '',
          prioridad: '',
          titulo: '',
          descripcion: '',
          solicitud_ayuntamiento: '',
          anonimo: false
        });
      } else {
        setSubmitMessage('Error al enviar la sugerencia. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar sugerencia:', error);
      setSubmitMessage('Error al enviar la sugerencia. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4">
            Buzón de Sugerencias Juvenil
          </h1>
          <p className="font-sans text-lg text-gray-700 max-w-2xl mx-auto">
            Tu opinión es fundamental para mejorar los servicios juveniles de tu comunidad. 
            Cuéntanos qué necesitas y qué podemos hacer mejor.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-black">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Información Personal */}
            <div className="border border-black p-6">
              <h2 className="font-serif text-xl font-semibold text-black mb-4">
                Información Personal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Nombre completo {formData.anonimo && '(Opcional - Anónimo)'}
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={formData.anonimo}
                    className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none disabled:bg-gray-100"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Email {formData.anonimo && '(Opcional - Anónimo)'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={formData.anonimo}
                    className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none disabled:bg-gray-100"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Edad {formData.anonimo && '(Opcional - Anónimo)'}
                  </label>
                  <select
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    disabled={formData.anonimo}
                    className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Selecciona tu rango de edad</option>
                    <option value="12-15">12-15 años</option>
                    <option value="16-18">16-18 años</option>
                    <option value="19-22">19-22 años</option>
                    <option value="23-25">23-25 años</option>
                    <option value="26-30">26-30 años</option>
                    <option value="31+">31 años o más</option>
                  </select>
                </div>
                
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="anonimo"
                    id="anonimo"
                    checked={formData.anonimo}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor="anonimo" className="font-sans text-sm text-black">
                    Enviar sugerencia de forma anónima
                  </label>
                </div>
              </div>
            </div>

            {/* Detalles de la Sugerencia */}
            <div className="border border-black p-6">
              <h2 className="font-serif text-xl font-semibold text-black mb-4">
                Detalles de la Sugerencia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="educacion">Educación y Formación</option>
                    <option value="empleo">Empleo y Prácticas</option>
                    <option value="ocio">Ocio y Cultura</option>
                    <option value="deportes">Deportes</option>
                    <option value="salud">Salud y Bienestar</option>
                    <option value="vivienda">Vivienda</option>
                    <option value="transporte">Transporte</option>
                    <option value="tecnologia">Tecnología y Digital</option>
                    <option value="medioambiente">Medio Ambiente</option>
                    <option value="participacion">Participación Juvenil</option>
                    <option value="inclusion">Inclusión y Diversidad</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-sans text-sm font-medium text-black mb-2">
                    Prioridad *
                  </label>
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none"
                    required
                  >
                    <option value="">Selecciona la prioridad</option>
                    <option value="baja">Baja - Sería bueno tenerlo</option>
                    <option value="media">Media - Importante mejorarlo</option>
                    <option value="alta">Alta - Necesario urgentemente</option>
                    <option value="critica">Crítica - Problema grave que resolver</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block font-sans text-sm font-medium text-black mb-2">
                  Título de la sugerencia *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none"
                  placeholder="Ej: Necesitamos más espacios de estudio gratuitos"
                  required
                />
              </div>
              
              <div className="mt-4">
                <label className="block font-sans text-sm font-medium text-black mb-2">
                  Descripción detallada *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full h-32 px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none resize-none"
                  placeholder="Describe tu sugerencia en detalle. ¿Qué problema identificas? ¿Qué solución propones? ¿Cómo beneficiaría a la juventud?"
                  required
                />
              </div>
            </div>

            {/* Solicitud al Ayuntamiento */}
            <div className="border border-black p-6">
              <h2 className="font-serif text-xl font-semibold text-black mb-4">
                ¿Qué solicitas específicamente al Ayuntamiento?
              </h2>
              <p className="font-sans text-sm text-gray-700 mb-4">
                Sé específico sobre qué acción o recurso necesitas del ayuntamiento.
              </p>
              <textarea
                name="solicitud_ayuntamiento"
                value={formData.solicitud_ayuntamiento}
                onChange={handleInputChange}
                className="w-full h-24 px-4 py-2 font-sans text-sm border border-black bg-white focus:outline-none resize-none"
                placeholder="Ej: Solicito la creación de un programa de becas para transporte juvenil, o la habilitación de espacios gratuitos para estudios..."
              />
            </div>

            {/* Mensaje de respuesta */}
            {submitMessage && (
              <div className={`p-4 border ${
                submitMessage.includes('Gracias') 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="font-sans text-sm">{submitMessage}</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-6 border-t border-black">
              <Link 
                href="/"
                className="px-6 py-2 font-sans text-sm border border-black text-black hover:bg-gray-100 transition-colors"
              >
                Volver al inicio
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 font-sans text-sm bg-black text-white border border-black hover:bg-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Sugerencia'}
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <p className="font-sans text-sm text-gray-600">
            Todas las sugerencias son revisadas por nuestro equipo. 
            Las sugerencias anónimas son tratadas con la misma importancia que las identificadas.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
