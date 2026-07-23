const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'src', 'i18n.ts');
const outPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');

const source = fs.readFileSync(srcPath, 'utf8');

// Extraer el objeto resources de i18n.ts por conteo de llaves
const startIdx = source.indexOf('const resources = ');
if (startIdx === -1) {
  console.error('No se pudo encontrar "const resources = " en i18n.ts');
  process.exit(1);
}

const objectStart = startIdx + 'const resources = '.length;
let depth = 0;
let endIdx = objectStart;
let inString = false;
let stringChar = '';

for (let i = objectStart; i < source.length; i++) {
  const ch = source[i];
  const prev = source[i - 1];

  if (inString) {
    if (ch === stringChar && prev !== '\\') {
      inString = false;
    }
  } else if (ch === '"' || ch === "'" || ch === '`') {
    inString = true;
    stringChar = ch;
  } else if (ch === '{') {
    depth++;
  } else if (ch === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const resourcesObject = source.slice(objectStart, endIdx);

const output = `// Motor de traducción personalizado de CityPaj
// Diccionario generado a partir de los recursos existentes

export const resources = ${resourcesObject};

export type SupportedLang = keyof typeof resources;

const flatten = (
  obj: Record<string, any>,
  prefix = '',
  result: Record<string, string> = {}
): Record<string, string> => {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof value === 'string') {
      result[newKey] = value;
    } else if (value && typeof value === 'object') {
      flatten(value, newKey, result);
    }
  }
  return result;
};

const flatResources: Record<SupportedLang, Record<string, string>> = {} as any;
for (const lang of Object.keys(resources) as SupportedLang[]) {
  // @ts-ignore
  flatResources[lang] = flatten(resources[lang]?.translation || resources[lang] || {});
}

// Mapa inverso para traducción por contenido (motor de página completa)
export const reverseMaps: Record<SupportedLang, Map<string, string>> = {} as any;
const spanishMap = flatResources['es'];
for (const lang of Object.keys(flatResources) as SupportedLang[]) {
  const map = new Map<string, string>();
  for (const key of Object.keys(spanishMap)) {
    const sourceText = spanishMap[key].trim();
    const targetText = flatResources[lang][key];
    if (sourceText && targetText && sourceText !== targetText && lang !== 'es') {
      map.set(sourceText, targetText);
    }
  }
  reverseMaps[lang] = map;
}

export const getKeyTranslation = (
  lang: SupportedLang,
  key: string,
  fallback?: string
): string => {
  const flat = flatResources[lang];
  if (flat && flat[key]) return flat[key];
  const spanish = flatResources['es'];
  if (spanish && spanish[key]) return spanish[key];
  return fallback ?? key;
};

export const getTextTranslation = (
  lang: SupportedLang,
  text: string,
  fallback?: string
): string => {
  if (lang === 'es') return text;
  const map = reverseMaps[lang];
  if (!map) return fallback ?? text;
  const trimmed = text.trim();
  if (map.has(trimmed)) return map.get(trimmed)!;
  return fallback ?? text;
};
`;

fs.writeFileSync(outPath, output, 'utf8');
console.log('translations.ts generado correctamente');
