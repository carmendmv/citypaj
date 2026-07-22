'use client';

import React from 'react';
import { useTranslation } from '@/components/ui/TranslationProvider';

interface TranslationStatusProps {
  className?: string;
  showDetails?: boolean;
}

const TranslationStatus: React.FC<TranslationStatusProps> = ({ 
  className = '',
  showDetails = false 
}) => {
  const { currentLanguage, isLoading, isTranslationReady } = useTranslation();

  if (!showDetails) {
    return (
      <div className={`translation-status flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-600">
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </span>
        {isLoading && <span className="text-xs text-orange-500 animate-pulse">🔄</span>}
        {!isTranslationReady && <span className="text-xs text-red-500">❌</span>}
      </div>
    );
  }

  return (
    <div className={`translation-status bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Estado de Traducción</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="text-sm font-medium">{currentLanguage?.nativeName}</span>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Sistema:</span>
          <span className="font-medium">Google Translate AI</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Estado:</span>
          <span className={`font-medium ${
            isLoading ? 'text-orange-500' : 
            isTranslationReady ? 'text-green-500' : 
            'text-red-500'
          }`}>
            {isLoading ? '🔄 Traduciendo...' : 
             isTranslationReady ? '✅ Listo' : 
             '❌ Error'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Idioma actual:</span>
          <span className="font-medium">{currentLanguage?.code}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Motor IA:</span>
          <span className="font-medium text-blue-500">Google Translate</span>
        </div>
      </div>
      
      {!isTranslationReady && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            ⚠️ El sistema de traducción está cargando. Por favor, espera unos segundos.
          </p>
        </div>
      )}
    </div>
  );
};

export default TranslationStatus;
