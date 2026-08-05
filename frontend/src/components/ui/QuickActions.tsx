'use client';

import React, { memo, useCallback } from 'react';
import { PlusCircle, Search, Bell, Heart, Share2, MessageSquare, Star, Zap } from 'lucide-react';

// Interfaces para tipado estricto
interface ActionButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
  analyticsEvent: string;
}

interface QuickActionsProps {
  onPublicar?: () => void;
  onBuscar?: () => void;
  onNotificaciones?: () => void;
  onFavoritos?: () => void;
  onCompartir?: () => void;
  onContactar?: () => void;
  onValorar?: () => void;
  onDestacar?: () => void;
}

const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Simulación de tracking - en producción usar servicio real
    
    // Ejemplo de implementación real:
    // gtag('event', eventName, {
    //   'event_category': 'QuickActions',
    //   'event_label': properties?.label,
    //   'value': properties?.value
    // });
  }, []);

  return { trackEvent };
};

const ActionButton = memo(({ 
  label, 
  icon, 
  description, 
  color, 
  hoverColor, 
  onClick, 
  analyticsEvent 
}: ActionButton) => {
  const { trackEvent } = useAnalytics();

  const handleClick = useCallback(() => {
    // Trackear evento antes de ejecutar acción
    trackEvent(analyticsEvent, { label, timestamp: Date.now() });
    
    // Ejecutar acción principal
    onClick();
  }, [onClick, analyticsEvent, trackEvent]);

  return (
    <button
      onClick={handleClick}
      className={`
        w-full p-4 border border-gray-300 rounded-lg text-left
        transition-all duration-200 group
        hover:shadow-md hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`${label} - ${description}`}
    >
      {/* Icono y contenido */}
      <div className="flex items-start gap-3">
        <div className={`
          w-10 h-10 rounded-lg ${color} 
          flex items-center justify-center
          group-hover:${hoverColor}
          transition-colors duration-200
          flex-shrink-0
        `}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 mb-1">
            {label}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Indicador de hover */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

const QuickActions: React.FC<QuickActionsProps> = memo(({
  onPublicar,
  onBuscar,
  onNotificaciones,
  onFavoritos,
  onCompartir,
  onContactar,
  onValorar,
  onDestacar
}) => {
  const actions: ActionButton[] = [
    {
      id: 'publicar',
      label: 'PUBLICAR ANUNCIO',
      icon: <PlusCircle className="w-5 h-5 text-white" />,
      description: 'Crea un nuevo anuncio en segundos',
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      onClick: onPublicar || (() => {}),
      analyticsEvent: 'click_publicar_anuncio'
    },
    {
      id: 'buscar',
      label: 'BUSCAR ANUNCIOS',
      icon: <Search className="w-5 h-5 text-white" />,
      description: 'Encuentra lo que necesitas',
      color: 'bg-green-600',
      hoverColor: 'bg-green-700',
      onClick: onBuscar || (() => {}),
      analyticsEvent: 'click_buscar_anuncios'
    },
    {
      id: 'notificaciones',
      label: 'NOTIFICACIONES',
      icon: <Bell className="w-5 h-5 text-white" />,
      description: 'Mantente informado',
      color: 'bg-purple-600',
      hoverColor: 'bg-purple-700',
      onClick: onNotificaciones || (() => {}),
      analyticsEvent: 'click_notificaciones'
    },
    {
      id: 'favoritos',
      label: 'MIS FAVORITOS',
      icon: <Heart className="w-5 h-5 text-white" />,
      description: 'Guarda tus anuncios preferidos',
      color: 'bg-red-600',
      hoverColor: 'bg-red-700',
      onClick: onFavoritos || (() => {}),
      analyticsEvent: 'click_favoritos'
    },
    {
      id: 'compartir',
      label: 'COMPARTIR',
      icon: <Share2 className="w-5 h-5 text-white" />,
      description: 'Comparte en redes sociales',
      color: 'bg-indigo-600',
      hoverColor: 'bg-indigo-700',
      onClick: onCompartir || (() => {}),
      analyticsEvent: 'click_compartir'
    },
    {
      id: 'contactar',
      label: 'CONTACTAR',
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      description: 'Chatea con otros usuarios',
      color: 'bg-teal-600',
      hoverColor: 'bg-teal-700',
      onClick: onContactar || (() => {}),
      analyticsEvent: 'click_contactar'
    },
    {
      id: 'valorar',
      label: 'VALORAR',
      icon: <Star className="w-5 h-5 text-white" />,
      description: 'Deja tu opinión',
      color: 'bg-yellow-600',
      hoverColor: 'bg-yellow-700',
      onClick: onValorar || (() => {}),
      analyticsEvent: 'click_valorar'
    },
    {
      id: 'destacar',
      label: 'DESTACAR',
      icon: <Zap className="w-5 h-5 text-white" />,
      description: 'Destaca tus anuncios',
      color: 'bg-orange-600',
      hoverColor: 'bg-orange-700',
      onClick: onDestacar || (() => {}),
      analyticsEvent: 'click_destacar'
    }
  ];

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Atajos de teclado para acciones principales
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'p':
          event.preventDefault();
          onPublicar?.();
          break;
        case 'f':
          event.preventDefault();
          onBuscar?.();
          break;
        case 'n':
          event.preventDefault();
          onNotificaciones?.();
          break;
      }
    }
  }, [onPublicar, onBuscar, onNotificaciones]);

  const handleActionClick = (action: ActionButton) => {
    action.onClick();
  };

  return (
    <div className="cp-card cp-card--actions" role="region" aria-label="Acciones rápidas de CityPaj">
      {/* Header con título */}
      <div className="cp-flex cp-items-center cp-justify-between cp-mb-6">
        <h3 className="cp-font-serif cp-text-xl cp-font-bold cp-text-gray-900">
          ACCIONES RÁPIDAS
        </h3>
        <div className="cp-flex cp-items-center cp-gap-2">
          <Zap className="w-4 h-4 cp-text-blue-600" aria-hidden="true" />
          <span className="cp-text-xs cp-text-blue-600 cp-font-medium">
            ACCESO DIRECTO
          </span>
        </div>
      </div>

      {/* Grid de acciones */}
      <div className="cp-grid cp-grid-cols-2 cp-gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="cp-action-button"
            aria-label={action.label}
          >
            {/* Icono */}
            <div className="cp-flex cp-justify-center cp-mb-2">
              <div className="cp-w-10 cp-h-10 cp-bg-gray-100 cp-rounded-full cp-flex cp-items-center cp-justify-center hover:cp-bg-blue-100 cp-transition-fast">
                {action.icon}
              </div>
            </div>
            
            {/* Label */}
            <div className="cp-text-sm cp-font-medium cp-text-gray-900 cp-mb-1">
              {action.label}
            </div>
            
            {/* Description */}
            <div className="cp-text-xs cp-text-gray-600 cp-line-clamp-2">
              {action.description}
            </div>
          </button>
        ))}
      </div>

      {/* Footer con atajos de teclado */}
      <div className="cp-mt-6 cp-pt-4 cp-border-t cp-border-gray-200">
        <div className="cp-flex cp-items-center cp-justify-between cp-text-xs cp-text-gray-500">
          <span>Atajos: Ctrl+P (Publicar) • Ctrl+F (Buscar)</span>
          <button 
            onClick={() => {}}
            className="cp-text-blue-600 hover:cp-text-blue-800 cp-font-medium"
          >
            VER ATAJOS
          </button>
        </div>
      </div>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
