'use client';

import React from 'react';

interface TerminosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminosModal: React.FC<TerminosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white border border-black rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-black">
              Términos y Condiciones
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <section>
            <h3 className="font-serif text-lg font-bold text-black mb-3">1. Compromiso de Contenido Apropiado</h3>
            <p className="font-light text-gray-700 leading-relaxed">
              Al utilizar CityPaj, te comprometes a no publicar anuncios que contengan:
            </p>
            <ul className="mt-3 ml-6 space-y-2 list-disc text-gray-700">
              <li>Contenido violento, amenazante o discriminatorio</li>
              <li>Material sexualmente explícito o pornográfico</li>
              <li>Información sobre drogas, sustancias ilegales o parafernalia</li>
              <li>Contenido que promueva prácticas ilegales o fraudulentas</li>
              <li>Material ofensivo, insultante o que incite al odio</li>
              <li>Información falsa, engañosa o maliciosa</li>
              <li>Contenido que viole derechos de autor o propiedad intelectual</li>
              <li>Publicidad no solicitada o spam</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-black mb-3">2. Responsabilidad del Usuario</h3>
            <p className="font-light text-gray-700 leading-relaxed">
              Eres el único responsable del contenido que publicas. CityPaj no se responsabiliza por:
            </p>
            <ul className="mt-3 ml-6 space-y-2 list-disc text-gray-700">
              <li>La veracidad de la información proporcionada en los anuncios</li>
              <li>La calidad o legitimidad de los productos y servicios ofrecidos</li>
              <li>Las transacciones realizadas entre usuarios</li>
              <li>Las consecuencias derivadas del uso de la plataforma</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-black mb-3">3. Exención de Responsabilidad</h3>
            <p className="font-light text-gray-700 leading-relaxed">
              CityPaj actúa como plataforma de intermediación. No somos responsables de:
            </p>
            <ul className="mt-3 ml-6 space-y-2 list-disc text-gray-700">
              <li>Disputas entre usuarios</li>
              <li>Pérdidas económicas o daños derivados de transacciones</li>
              <li>Contenido publicado por terceros</li>
              <li>Indisponibilidad temporal del servicio</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-black mb-3">4. Moderación y Sanciones</h3>
            <p className="font-light text-gray-700 leading-relaxed">
              CityPaj se reserva el derecho de:
            </p>
            <ul className="mt-3 ml-6 space-y-2 list-disc text-gray-700">
              <li>Eliminar contenido que infrinja estos términos</li>
              <li>Suspender o cancelar cuentas de usuarios infractores</li>
              <li>Reportar actividades ilegales a las autoridades competentes</li>
              <li>Modificar estos términos en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-lg font-bold text-black mb-3">5. Contacto</h3>
            <p className="font-light text-gray-700 leading-relaxed">
              Para cualquier duda, reporte de contenido inapropiado o incidencia, puedes contactarnos en:
            </p>
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded">
              <p className="font-medium text-black">hola@citypaj.es</p>
            </div>
          </section>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Al aceptar estos términos, reconoces haber leído y comprendido completamente tu compromiso 
              con las políticas de CityPaj.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminosModal;
