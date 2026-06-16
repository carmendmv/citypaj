import React from 'react';

interface AnuncioDetailProps {
  anuncio: {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    comunidad_autonoma: string;
    provincia: string;
    barrio?: string;
    precio?: number;
    modalidad: string;
    creado_at: string;
    vistas: number;
    usuario_nombre?: string;
    usuario_email?: string;
    contacto_email: boolean;
    contacto_telefono: boolean;
    contacto_anonimo: boolean;
    telefono?: string;
  };
}

export default function AnuncioDetail({ anuncio }: AnuncioDetailProps) {
  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Fecha no disponible';
    
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrecio = (precio?: number) => {
    if (!precio) return 'Precio no especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{anuncio.titulo}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {anuncio.categoria}
          </span>
          <span>{anuncio.comunidad_autonoma}</span>
          <span>{anuncio.provincia}</span>
        </div>
      </div>

      {/* Info Principal */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          {/* Descripción */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {anuncio.descripcion}
            </p>
          </div>

          {/* Ubicación */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Ubicación</h2>
            <div className="space-y-1 text-gray-700">
              <p><strong>Comunidad:</strong> {anuncio.comunidad_autonoma}</p>
              <p><strong>Provincia:</strong> {anuncio.provincia}</p>
              {anuncio.barrio && <p><strong>Barrio:</strong> {anuncio.barrio}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Precio */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Precio</h2>
            <p className="text-2xl font-bold text-green-600">
              {formatPrecio(anuncio.precio)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Modalidad: {anuncio.modalidad}
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Contacto</h2>
            
            {/* Nombre del usuario - SIEMPRE visible */}
            {anuncio.usuario_nombre && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Publicado por:</p>
                <p className="font-medium text-gray-900">{anuncio.usuario_nombre}</p>
              </div>
            )}

            {/* Email - SIEMPRE visible (obligatorio) */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Email:</p>
              <p className="font-medium text-blue-600">
                {anuncio.usuario_email || 'email@ejemplo.com'}
              </p>
            </div>

            {/* Teléfono - Solo si está disponible */}
            {anuncio.contacto_telefono && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Teléfono:</p>
                <p className="font-medium text-gray-900">
                  {anuncio.telefono || 'No proporcionado'}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-3">
              <p>✓ Email siempre visible</p>
              {anuncio.contacto_telefono && <p>✓ Teléfono disponible</p>}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Estadísticas</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Publicado:</strong> {formatFecha(anuncio.creado_at)}</p>
              <p><strong>Visualizaciones:</strong> {anuncio.vistas}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
