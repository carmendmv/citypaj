'use client';

/**
 * StatusCard Component - Componente de estado de plataforma
 * 
 * Propósito: Mostrar estado operativo de los servicios de CityPaj
 * Arquitectura: Componente funcional con animaciones y transiciones
 * Optimización: Memoización y CSS-in-JS para rendimiento
 * Accesibilidad: Indicadores visuales y semánticos
 * 
 * @component StatusCard
 * @returns {JSX.Element} Tarjeta de estado con indicadores en tiempo real
 */

import React, { memo, useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Activity, Database, Server, Globe } from 'lucide-react';

// Interfaces para tipado estricto
interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'loading';
  description: string;
  lastCheck: string;
  responseTime?: number;
}

interface StatusCardProps {
  className?: string;
}

/**
 * Hook personalizado para simulación de estado de servicios
 * En producción, esto conectaría con APIs reales de monitoreo
 */
const useServiceStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Frontend',
      status: 'healthy',
      description: 'Interfaz de usuario operativa',
      lastCheck: new Date().toISOString(),
      responseTime: 45
    },
    {
      name: 'Backend',
      status: 'healthy',
      description: 'API funcionando correctamente',
      lastCheck: new Date().toISOString(),
      responseTime: 120
    },
    {
      name: 'Base de datos',
      status: 'healthy',
      description: 'PostgreSQL conectado y estable',
      lastCheck: new Date().toISOString(),
      responseTime: 8
    },
    {
      name: 'Redis',
      status: 'healthy',
      description: 'Caché operativa',
      lastCheck: new Date().toISOString(),
      responseTime: 2
    }
  ]);

  // Simulación de actualización de estado cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastCheck: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 200) + 10
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return services;
};

/**
 * Componente ServiceIndicator - Indicador individual de servicio
 * 
 * Optimizado con memoización para evitar re-renders
 */
const ServiceIndicator = memo(({ service }: { service: ServiceStatus }) => {
  /**
   * Obtener icono según estado - memoizado
   */
  const getStatusIcon = () => {
    switch (service.status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" aria-hidden="true" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />;
      case 'loading':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" aria-hidden="true" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" aria-hidden="true" />;
    }
  };

  /**
   * Obtener color de texto según estado
   */
  const getStatusColor = () => {
    switch (service.status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'loading':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * Obtener texto de estado
   */
  const getStatusText = () => {
    switch (service.status) {
      case 'healthy':
        return 'Operativo';
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Caído';
      case 'loading':
        return 'Verificando';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <div className="font-medium text-sm text-gray-900">
            {service.name}
          </div>
          <div className="text-xs text-gray-600">
            {service.description}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        {service.responseTime && (
          <div className="text-xs text-gray-500">
            {service.responseTime}ms
          </div>
        )}
      </div>
    </div>
  );
});

ServiceIndicator.displayName = 'ServiceIndicator';

/**
 * Componente StatusCard principal
 * 
 * Características:
 * - Monitoreo en tiempo real de servicios
 * - Animaciones y transiciones suaves
 * - Diseño profesional y accesible
 * - Actualización automática cada 30 segundos
 */
const StatusCard: React.FC<StatusCardProps> = memo(({ className = '' }) => {
  const services = useServiceStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  /**
   * Calcular estado general de la plataforma
   */
  const getOverallStatus = () => {
    const hasError = services.some(s => s.status === 'error');
    const hasWarning = services.some(s => s.status === 'warning');
    const allHealthy = services.every(s => s.status === 'healthy');

    if (hasError) return { status: 'error', text: 'Degradado', color: 'red' };
    if (hasWarning) return { status: 'warning', text: 'Advertencia', color: 'yellow' };
    if (allHealthy) return { status: 'healthy', text: 'Operativo', color: 'green' };
    return { status: 'loading', text: 'Verificando', color: 'blue' };
  };

  /**
   * Toggle expanded state para servicios individuales
   */
  const toggleExpanded = (serviceId: string) => {
    setExpandedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() < 0.9); // 90% uptime
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`cp-card cp-card--status ${className}`} role="status" aria-live="polite">
      {/* Header con indicador de estado */}
      <div className="cp-flex cp-items-center cp-justify-between cp-mb-6">
        <h3 className="cp-font-serif cp-text-xl cp-font-bold cp-text-gray-900">
          ESTADO DE LA PLATAFORMA
        </h3>
        <div className="cp-flex cp-items-center cp-gap-2">
          <div className={`cp-w-3 cp-h-3 cp-rounded-full ${isOnline ? 'cp-bg-green-500' : 'cp-bg-red-500'} cp-animate-pulse`}></div>
          <span className={`cp-text-sm cp-font-medium ${isOnline ? 'cp-text-green-600' : 'cp-text-red-600'}`}>
            {isOnline ? 'EN LÍNEA' : 'DESCONECTADO'}
          </span>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="cp-space-y-4">
        {services.map((service, index) => (
          <div key={index} className="cp-flex cp-justify-between cp-items-center cp-py-3 cp-border-b cp-border-gray-100">
            <div className="cp-flex cp-items-center cp-gap-3">
              <div className={`cp-w-2 cp-h-2 cp-rounded-full ${
                service.status === 'healthy' ? 'cp-bg-green-500' : 
                service.status === 'warning' ? 'cp-bg-yellow-500' : 
                'cp-bg-red-500'
              }`}></div>
              <div>
                <div className="cp-font-medium cp-text-sm cp-text-gray-900">
                  {service.name}
                </div>
                <div className="cp-text-xs cp-text-gray-600">
                  {service.description}
                </div>
              </div>
            </div>
            <div className="cp-text-right">
              <div className={`cp-font-medium cp-text-xs ${
                service.status === 'healthy' ? 'cp-text-green-600' : 
                service.status === 'warning' ? 'cp-text-yellow-600' : 
                'cp-text-red-600'
              }`}>
                {service.status === 'healthy' ? 'OPERATIVO' : 
                 service.status === 'warning' ? 'ADVERTENCIA' : 
                 'CAÍDO'}
              </div>
              {service.responseTime && (
                <div className="cp-text-xs cp-text-gray-500">
                  {service.responseTime}ms
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer del card con información adicional */}
      <div className="cp-mt-6 cp-pt-4 cp-border-t cp-border-gray-200">
        <div className="cp-flex cp-items-center cp-justify-between cp-text-xs cp-text-gray-500">
          <span>Actualizado: {new Date().toLocaleTimeString('es-ES')}</span>
          <button 
            onClick={() => window.location.reload()}
            className="cp-text-blue-600 hover:cp-text-blue-800 cp-font-medium"
          >
            VERIFICAR ESTADO
          </button>
        </div>
      </div>
    </div>
  );
});

StatusCard.displayName = 'StatusCard';

export default StatusCard;
