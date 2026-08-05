import React from 'react';

interface ContactInfoProps {
  usuario_email?: string;
  usuario_nombre?: string;
  contacto_email: boolean;
  contacto_telefono: boolean;
  telefono?: string;
  contacto_anonimo: boolean;
}

export default function ContactInfo({ 
  usuario_email, 
  usuario_nombre, 
  contacto_email, 
  contacto_telefono, 
  telefono,
  contacto_anonimo 
}: ContactInfoProps) {
  // El email siempre debe mostrarse (es obligatorio)
  const emailToShow = usuario_email || 'email@ejemplo.com';
  
  // El teléfono se muestra solo si está disponible y el usuario lo permite
  const telefonoToShow = contacto_telefono && telefono ? telefono : null;
  
  return (
    <div className="space-y-2">
      {/* Información del usuario */}
      {usuario_nombre && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {usuario_nombre}
          </span>
        </div>
      )}
      
      {/* Email - Siempre visible (obligatorio) */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-sm text-gray-600">{emailToShow}</span>
      </div>
      
      {/* Teléfono - Solo si está disponible y el usuario lo permite */}
      {telefonoToShow && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
          </svg>
          <span className="text-sm text-gray-600">{telefonoToShow}</span>
        </div>
      )}
    </div>
  );
}
