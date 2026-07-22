'use client';

import React, { useState } from 'react';
import ProductionLanguageSelector from './ProductionLanguageSelector';
import SmartTranslateButton from './SmartTranslateButton';

const TranslationTestPage: React.FC = () => {
  const [testText, setTestText] = useState('Bienvenido a CityPAJ - Tu plataforma de anuncios juvenil');
  const [translatedText, setTranslatedText] = useState('');

  const sampleTexts = [
    'Bienvenido a CityPAJ',
    'Tu ciudad, tus anuncios, tu comunidad',
    'Conectando jóvenes con oportunidades',
    'Publica tus anuncios gratis',
    'Encuentra servicios en tu comunidad',
    'Únete a la red juvenil',
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🌐 Pruebas de Traducción IA</h1>
        
        {/* Selectores de idiomas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Variante Compact</h3>
            <ProductionLanguageSelector variant="compact" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Variante Dropdown</h3>
            <ProductionLanguageSelector variant="dropdown" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Variante Banderas</h3>
            <ProductionLanguageSelector variant="flags" />
          </div>
        </div>

        {/* Tests de traducción */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">🧪 Tests de Traducción</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de prueba:
              </label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Botón de traducción individual:
              </label>
              <SmartTranslateButton 
                text={testText}
                variant="button"
                className="mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textos de ejemplo:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleTexts.map((text, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{text}</span>
                    <SmartTranslateButton 
                      text={text}
                      variant="icon"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">📊 Estado del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Información Técnica</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Motor:</span>
                  <span className="font-medium">Google Translate API</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idiomas:</span>
                  <span className="font-medium">11 idiomas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache:</span>
                  <span className="font-medium">LocalStorage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-medium">Next.js 14</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Idiomas Soportados</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>🇪🇸 Español</div>
                <div>🇬🇧 Inglés</div>
                <div>🇫🇷 Francés</div>
                <div>🇮🇹 Italiano</div>
                <div>🇩🇪 Alemán</div>
                <div>🇳🇱 Neerlandés</div>
                <div>🇨🇭 Suizo</div>
                <div>🇸🇦 Árabe</div>
                <div>🇨🇳 Chino</div>
                <div>🇯🇵 Japonés</div>
                <div>🇵🇹 Portugués</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Instrucciones de Prueba</h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Selecciona un idioma diferente del español usando los selectores</li>
            <li>Observa cómo se traducen los textos automáticamente</li>
            <li>Usa los botones de traducción individuales para textos específicos</li>
            <li>Verifica que el idioma se guarde en localStorage</li>
            <li>Cambia a español para restaurar el texto original</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TranslationTestPage;
