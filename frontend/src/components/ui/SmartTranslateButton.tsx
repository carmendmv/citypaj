'use client';

import React, { useState } from 'react';
import { useTranslateText } from './TranslationProvider';

interface SmartTranslateButtonProps {
  text: string;
  className?: string;
  variant?: 'icon' | 'button' | 'inline';
  targetLang?: string;
}

const SmartTranslateButton: React.FC<SmartTranslateButtonProps> = ({
  text,
  className = '',
  variant = 'icon',
  targetLang
}) => {
  const { translate, currentLang } = useTranslateText();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [showOriginal, setShowOriginal] = useState(true);

  const handleTranslate = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      const translated = await translate(text, targetLang);
      setTranslatedText(translated);
      setShowOriginal(false);
    } catch (error) {
      console.error('Error translating:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleText = () => {
    setShowOriginal(!showOriginal);
  };

  // Variante icono
  if (variant === 'icon') {
    return (
      <div className={`smart-translate inline-flex items-center gap-2 ${className}`}>
        <span className="text-sm">
          {showOriginal ? text : translatedText}
        </span>
        <button
          onClick={currentLang !== 'es' ? handleTranslate : toggleText}
          className="p-1 text-blue-500 hover:text-blue-700 transition-colors duration-200"
          title={showOriginal ? 'Traducir' : 'Mostrar original'}
          disabled={isTranslating}
        >
          {isTranslating ? (
            <span className="animate-spin">🔄</span>
          ) : (
            <span>🌐</span>
          )}
        </button>
      </div>
    );
  }

  // Variante botón completo
  if (variant === 'button') {
    return (
      <div className={`smart-translate ${className}`}>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="text-sm mb-2">
            {showOriginal ? text : translatedText}
          </div>
          <div className="flex gap-2">
            <button
              onClick={currentLang !== 'es' ? handleTranslate : toggleText}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors duration-200"
              disabled={isTranslating}
            >
              {isTranslating ? '🔄 Traduciendo...' : showOriginal ? '🌐 Traducir' : '📝 Original'}
            </button>
            {currentLang !== 'es' && (
              <button
                onClick={toggleText}
                className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors duration-200"
              >
                {showOriginal ? '📝 Traducción' : '🌐 Original'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Variante inline (por defecto)
  return (
    <div className={`smart-translate inline-block ${className}`}>
      <span 
        className="text-sm cursor-pointer hover:text-blue-600 transition-colors duration-200"
        onClick={currentLang !== 'es' ? handleTranslate : toggleText}
        title={showOriginal ? 'Click para traducir' : 'Click para ver original'}
      >
        {showOriginal ? text : translatedText}
        {currentLang !== 'es' && !showOriginal && (
          <span className="ml-1 text-xs text-blue-500">🌐</span>
        )}
      </span>
    </div>
  );
};

export default SmartTranslateButton;
