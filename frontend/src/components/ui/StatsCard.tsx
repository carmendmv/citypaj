'use client';

import React, { memo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, FileText, Calendar, BarChart3, Activity } from 'lucide-react';

// Interfaces para tipado estricto
interface StatItem {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon: React.ReactNode;
  color: string;
}

interface StatsCardProps {
  className?: string;
}

const useCounter = (targetValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Función de easing para animación suave
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return count;
};

const StatItem = memo(({ 
  label, 
  value, 
  unit = '', 
  trend, 
  trendValue, 
  icon, 
  color 
}: StatItem) => {
  const animatedValue = useCounter(value);

  const getTrendIndicator = () => {
    if (!trend || !trendValue) return null;

    const trendColors = {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600'
    };

    const trendIcons = {
      up: <TrendingUp className="w-3 h-3" />,
      down: <TrendingUp className="w-3 h-3 rotate-180" />,
      stable: <Activity className="w-3 h-3" />
    };

    return (
      <div className={`flex items-center gap-1 text-xs ${trendColors[trend]}`}>
        {trendIcons[trend]}
        <span>{Math.abs(trendValue)}%</span>
      </div>
    );
  };

  return (
    <div className="text-center p-4 border-b border-gray-100 last:border-b-0">
      {/* Icono */}
      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>

      {/* Valor animado */}
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {animatedValue.toLocaleString('es-ES')}
        {unit && <span className="text-lg font-normal text-gray-600 ml-1">{unit}</span>}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </div>

      {/* Tendencia */}
      {getTrendIndicator()}
    </div>
  );
});

StatItem.displayName = 'StatItem';

const StatsCard: React.FC<StatsCardProps> = memo(({ className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Estadísticas simplificadas y funcionales
  const stats = [
    {
      id: 1,
      label: 'Total Anuncios',
      value: 1247,
      change: 12.5,
      trend: 'up' as 'up' | 'down' | 'stable',
      icon: <FileText className="w-6 h-6 cp-text-white" />
    },
    {
      id: 2,
      label: 'Usuarios Activos',
      value: 3842,
      change: 8.3,
      trend: 'up' as 'up' | 'down' | 'stable',
      icon: <Users className="w-6 h-6 cp-text-white" />
    },
    {
      id: 3,
      label: 'Hoy Publicados',
      value: 47,
      change: 23.1,
      trend: 'up' as 'up' | 'down' | 'stable',
      icon: <Calendar className="w-6 h-6 cp-text-white" />
    },
    {
      id: 4,
      label: 'Tasa Respuesta',
      value: 94,
      change: 0.5,
      trend: 'stable' as 'up' | 'down' | 'stable',
      icon: <BarChart3 className="w-6 h-6 cp-text-white" />
    }
  ];

  // Animación simple del contador
  useEffect(() => {
    const targetValue = stats.reduce((sum, stat) => sum + stat.value, 0);
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.floor(easeOutQuart * targetValue / 4));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-ES');
  };

  return (
    <div className={`cp-card cp-card--stats ${className}`} role="region" aria-label="Estadísticas de CityPaj">
      {/* Header con título */}
      <div className="cp-flex cp-items-center cp-justify-between cp-mb-6">
        <h3 className="cp-font-serif cp-text-xl cp-font-bold cp-text-gray-900">
          ESTADÍSTICAS DE LA PLATAFORMA
        </h3>
        <div className="cp-flex cp-items-center cp-gap-2">
          <TrendingUp className="w-4 h-4 cp-text-green-600" aria-hidden="true" />
          <span className="cp-text-xs cp-text-green-600 cp-font-medium">
            TIEMPO REAL
          </span>
        </div>
      </div>

      {/* Grid de estadísticas - responsive */}
      <div className="cp-grid cp-grid-cols-2 md:cp-grid-cols-2 lg:cp-grid-cols-2 cp-gap-3 cp-gap-md-4">
        {stats.map((stat) => (
          <div key={stat.id} className="cp-text-center cp-p-3 cp-p-md-4 cp-bg-gray-50 cp-rounded-lg">
            {/* Icono */}
            <div className="cp-flex cp-justify-center cp-mb-2">
              <div className="cp-w-10 cp-h-10 cp-w-md-12 cp-h-md-12 cp-bg-blue-600 cp-rounded-full cp-flex cp-items-center cp-justify-center">
                {stat.icon}
              </div>
            </div>
            
            {/* Valor con animación */}
            <div className="cp-font-serif cp-text-xl cp-text-md-2xl cp-font-bold cp-text-gray-900 cp-mb-1">
              {formatNumber(stat.value)}
            </div>
            
            {/* Label */}
            <div className="cp-text-sm cp-text-md-base cp-text-gray-600 cp-mb-2">
              {stat.label}
            </div>
            
            {/* Trend indicator */}
            <div className="cp-flex cp-items-center cp-justify-center cp-gap-1">
              {stat.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 cp-text-green-600" aria-hidden="true" />
              ) : stat.trend === 'down' ? (
                <TrendingDown className="w-3 h-3 cp-text-red-600" aria-hidden="true" />
              ) : (
                <Minus className="w-3 h-3 cp-text-gray-600" aria-hidden="true" />
              )}
              <span className={`cp-text-xs cp-font-medium ${
                stat.trend === 'up' ? 'cp-text-green-600' : 
                stat.trend === 'down' ? 'cp-text-red-600' : 
                'cp-text-gray-600'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con información adicional */}
      <div className="cp-mt-6 cp-pt-4 cp-border-t cp-border-gray-200">
        <div className="cp-flex cp-items-center cp-justify-between cp-text-xs cp-text-gray-500">
          <span>Última actualización: {new Date().toLocaleTimeString('es-ES')}</span>
          <button 
            onClick={() => window.location.reload()}
            className="cp-text-blue-600 hover:cp-text-blue-800 cp-font-medium"
          >
            ACTUALIZAR
          </button>
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
