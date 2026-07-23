import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MYMEMORY_SUPPORTED = new Set(['en', 'fr', 'de', 'it', 'pt', 'ca', 'gl', 'eu', 'ar', 'ro', 'zh', 'ja', 'ru']);

const CACHE = new Map<string, string>();

function cacheKey(text: string, targetLang: string) {
  return `${targetLang}::${text}`;
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string> {
  if (!MYMEMORY_SUPPORTED.has(targetLang)) return text;
  const key = cacheKey(text, targetLang);
  if (CACHE.has(key)) return CACHE.get(key)!;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const json = await res.json();
    const translated = json?.responseData?.translatedText;
    if (translated && typeof translated === 'string' && translated.toLowerCase() !== text.toLowerCase()) {
      CACHE.set(key, translated);
      return translated;
    }
  } catch {
    // fallthrough
  }
  return text;
}

async function translateWithOpenAI(texts: string[], targetLang: string): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return texts.map(() => '');
  try {
    const prompt = `Translate the following Spanish texts to ${targetLang}. Return ONLY a JSON array of strings in the same order, no markdown, no explanations.\n\n${JSON.stringify(texts)}`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful translator.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content || '';
    const cleaned = content.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length === texts.length) {
      return parsed.map((t, i) => (typeof t === 'string' && t ? t : texts[i]));
    }
  } catch {
    // fallthrough
  }
  return texts.map(() => '');
}

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang } = await request.json();
    if (!Array.isArray(texts) || !targetLang) {
      return NextResponse.json({ success: false, error: 'texts y targetLang son requeridos' }, { status: 400 });
    }

    const unique = Array.from(new Set(texts.filter((t) => typeof t === 'string' && t.trim())));
    let translations: Record<string, string> = {};

    if (process.env.OPENAI_API_KEY) {
      const translated = await translateWithOpenAI(unique, targetLang);
      unique.forEach((text, idx) => {
        translations[text] = translated[idx] || text;
      });
    } else {
      const results = await Promise.all(unique.map((text) => translateWithMyMemory(text, targetLang)));
      unique.forEach((text, idx) => {
        translations[text] = results[idx];
      });
    }

    return NextResponse.json({ success: true, data: translations });
  } catch (error) {
    console.error('Error en /api/translate:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
