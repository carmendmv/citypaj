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
  const [aiCache, setAiCache] = useState<Map<string, string>>(new Map());
  const aiVersionRef = useRef(0);
  const pendingRef = useRef<Set<string>>(new Set());
  const translatingRef = useRef(false);
  const flushTimeoutRef = useRef<number | null>(null);

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

  const aiKey = useCallback(
    (text: string) => `${currentLanguage.code}:${text}`,
    [currentLanguage]
  );

  const translateWithAI = useCallback(
    async (texts: string[], lang?: SupportedLang) => {
      const targetLang = lang || (currentLanguage.code as SupportedLang);
      const toTranslate = texts
        .map((t) => t.trim())
        .filter((t) => t && !aiCache.get(`${targetLang}:${t}`) && !getTextTranslation(targetLang, t, t).trim());
      if (toTranslate.length === 0) return;
      translatingRef.current = true;
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: toTranslate, targetLang }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAiCache((prev) => {
            const next = new Map(prev);
            for (const [text, translated] of Object.entries(json.data as Record<string, string>)) {
              if (translated && translated !== text) {
                next.set(`${targetLang}:${text}`, translated);
              }
            }
            return next;
          });
          aiVersionRef.current += 1;
        }
      } catch (err) {
        console.error('Error translating with AI:', err);
      } finally {
        translatingRef.current = false;
      }
    },
    [aiCache, currentLanguage, aiVersionRef]
  );

  const translateText = useCallback(
    (text: string, fallback?: string) => {
      const lang = currentLanguage.code as SupportedLang;
      const dict = getTextTranslation(lang, text, undefined);
      if (dict && dict !== text) return dict;
      const cached = aiCache.get(`${lang}:${text}`);
      if (cached) return cached;
      return fallback ?? text;
    },
    [currentLanguage, aiCache]
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
      <PageTranslator
        currentLanguageCode={currentLanguage.code as SupportedLang}
        aiCache={aiCache}
        aiVersion={aiVersionRef.current}
        pendingRef={pendingRef}
        translatingRef={translatingRef}
        flushTimeoutRef={flushTimeoutRef}
        translateWithAI={translateWithAI}
      />
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
interface PageTranslatorProps {
  currentLanguageCode: SupportedLang;
  aiCache: Map<string, string>;
  aiVersion: number;
  pendingRef: React.MutableRefObject<Set<string>>;
  translatingRef: React.MutableRefObject<boolean>;
  flushTimeoutRef: React.MutableRefObject<number | null>;
  translateWithAI: (texts: string[], lang?: SupportedLang) => Promise<void>;
}

const PageTranslator: React.FC<PageTranslatorProps> = ({
  currentLanguageCode,
  aiCache,
  pendingRef,
  translatingRef,
  flushTimeoutRef,
  translateWithAI,
}) => {
  const originalTextNodes = useRef(new Map<Text, string>());
  const originalAttrs = useRef(new Map<Element, Record<string, string>>());

  const translateString = useCallback(
    (text: string) => {
      if (currentLanguageCode === 'es') return text;
      const dict = getTextTranslation(currentLanguageCode, text, undefined);
      if (dict && dict !== text) return dict;
      const cached = aiCache.get(`${currentLanguageCode}:${text}`);
      if (cached) return cached;
      return text;
    },
    [currentLanguageCode, aiCache]
  );

  const scheduleFlush = useCallback(() => {
    if (flushTimeoutRef.current) {
      window.clearTimeout(flushTimeoutRef.current);
    }
    flushTimeoutRef.current = window.setTimeout(() => {
      if (pendingRef.current.size === 0) return;
      if (translatingRef.current) return;
      const texts = Array.from(pendingRef.current);
      pendingRef.current = new Set();
      void translateWithAI(texts, currentLanguageCode);
    }, 600);
  }, [currentLanguageCode, pendingRef, translatingRef, flushTimeoutRef, translateWithAI]);

  useEffect(() => {
    const lang = currentLanguageCode;
    const textMap = originalTextNodes.current;
    const attrMap = originalAttrs.current;

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
      } else if (original.trim().length > 2) {
        pendingRef.current.add(original);
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
        } else if (original.trim().length > 2) {
          pendingRef.current.add(original);
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
    scheduleFlush();

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
      scheduleFlush();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (flushTimeoutRef.current) window.clearTimeout(flushTimeoutRef.current);
    };
  }, [currentLanguageCode, aiCache, scheduleFlush, translateString, pendingRef]);

  return null;
};
