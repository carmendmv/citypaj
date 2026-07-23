'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import {
  getKeyTranslation,
  getTextTranslation,
  SUPPORTED_LANGUAGES,
  Language,
  SupportedLang,
} from '@/lib/translations';

interface CustomTranslationContextType {
  currentLanguage: Language;
  currentLanguageCode: SupportedLang;
  changeLanguage: (language: Language) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string, fallback?: string) => string;
}

const STORAGE_KEY = 'citypaj-language';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE', 'TEXTAREA']);
const TRANSlatable_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

const CustomTranslationContext = createContext<CustomTranslationContextType | undefined>(undefined);

export const CustomTranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = SUPPORTED_LANGUAGES.find((lang) => lang.code === saved);
        if (found) {
          setCurrentLanguage(found);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const changeLanguage = useCallback((language: Language) => {
    setIsLoading(true);
    setCurrentLanguage(language);
    try {
      localStorage.setItem(STORAGE_KEY, language.code);
      document.documentElement.lang = language.code;
    } catch {
      // ignore
    }
    setTimeout(() => setIsLoading(false), 150);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return getKeyTranslation(currentLanguage.code as SupportedLang, key, fallback);
    },
    [currentLanguage]
  );

  const translateText = useCallback(
    (text: string, fallback?: string) => {
      return getTextTranslation(currentLanguage.code as SupportedLang, text, fallback);
    },
    [currentLanguage]
  );

  return (
    <CustomTranslationContext.Provider
      value={{
        currentLanguage,
        currentLanguageCode: currentLanguage.code as SupportedLang,
        changeLanguage,
        isLoading,
        t,
        translateText,
      }}
    >
      {children}
      <PageTranslator currentLanguageCode={currentLanguage.code as SupportedLang} />
    </CustomTranslationContext.Provider>
  );
};

export const useCustomTranslation = (): CustomTranslationContextType => {
  const context = useContext(CustomTranslationContext);
  if (!context) {
    throw new Error('useCustomTranslation must be used within a CustomTranslationProvider');
  }
  return context;
};

// Motor de traducción de página completa
const PageTranslator: React.FC<{ currentLanguageCode: SupportedLang }> = ({ currentLanguageCode }) => {
  const originalTextNodes = useRef(new Map<Text, string>());
  const originalAttrs = useRef(new Map<Element, Record<string, string>>());

  useEffect(() => {
    const lang = currentLanguageCode;
    const textMap = originalTextNodes.current;
    const attrMap = originalAttrs.current;

    const translateString = (text: string) => getTextTranslation(lang, text);

    const translateTextNode = (node: Text) => {
      if (!node.textContent) return;
      const parent = node.parentElement;
      if (parent && SKIP_TAGS.has(parent.tagName)) return;

      const original = textMap.get(node) ?? node.textContent;
      textMap.set(node, original);

      if (lang === 'es') {
        node.textContent = original;
        return;
      }

      const translated = translateString(original);
      if (translated !== original) {
        node.textContent = translated;
      }
    };

    const translateAttributes = (el: Element) => {
      for (const attr of TRANSlatable_ATTRS) {
        if (!el.hasAttribute(attr)) continue;
        const value = el.getAttribute(attr) || '';
        const stored = attrMap.get(el)?.[attr];
        const original = stored ?? value;

        if (!stored) {
          const current = attrMap.get(el) || {};
          current[attr] = original;
          attrMap.set(el, current);
        }

        if (lang === 'es') {
          el.setAttribute(attr, original);
          continue;
        }

        const translated = translateString(original);
        if (translated !== value) {
          el.setAttribute(attr, translated);
        }
      }
    };

    const translateElement = (el: Element) => {
      if (SKIP_TAGS.has(el.tagName)) return;

      translateAttributes(el);

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (parent && SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let node: Node | null;
      while ((node = walker.nextNode())) {
        translateTextNode(node as Text);
      }
    };

    // Traducir documento actual
    translateElement(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        Array.from(mutation.addedNodes).forEach((addedNode) => {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            translateElement(addedNode as Element);
          } else if (addedNode.nodeType === Node.TEXT_NODE) {
            translateTextNode(addedNode as Text);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [currentLanguageCode]);

  return null;
};
