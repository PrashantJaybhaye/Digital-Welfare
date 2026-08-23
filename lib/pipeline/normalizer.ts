import { RawSchemeInput } from './validator';

// Standard Taxonomy Map
const CATEGORY_NORMALIZATION_MAP: Record<string, string> = {
  'CS': 'Central Sector Scheme',
  'CSS': 'Centrally Sponsored Scheme',
  'CCP': 'Climate Change Programme',
  'DHE': 'MahaDBT (Higher Education)',
  'DTE': 'MahaDBT (Technical Education)',
  'DMER': 'MahaDBT (Medical Education)',
  'SJSA': 'MahaDBT (Social Justice)',
  'TDD': 'MahaDBT (Tribal Development)',
  'OBC': 'MahaDBT (OBC & VJNT Welfare)',
  'VJNT': 'MahaDBT (OBC & VJNT Welfare)',
  'AGRI': 'Agriculture & Krishi (MahaDBT / MP-SIMS)',
  'FARMER': 'Agriculture & Krishi (MahaDBT / MP-SIMS)',
  'KRISHI': 'Agriculture & Krishi (MahaDBT / MP-SIMS)',
  'WOMEN': 'Women & Child Welfare',
  'HEALTH': 'Health & Medical Welfare',
  'HOUSING': 'Housing & Gharkul',
  'SKILL': 'Skill Development & Employment (MahaSwayam)',
  'LABOUR': 'Labour & BOCW Welfare',
  '—': 'General Welfare'
};

// Automatic Translation Helper (Marathi / Hindi to clean English)
export async function translateDevanagariToEnglish(text: string): Promise<string> {
  if (!text || !/[\u0900-\u097F]/.test(text)) {
    return text.trim();
  }

  // Pre-clean boilerplate Marathi suffixes
  const clean = text
    .replace(/पुढीलप्रमाणे/g, '')
    .replace(/\d+\s*योजना/g, '')
    .replace(/आम्हाला फॉलो करा.*/g, '')
    .trim();

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      let translatedRaw = clean;
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const parts: string[] = [];
        for (const item of data[0]) {
          if (Array.isArray(item) && item[0]) {
            parts.push(String(item[0]));
          }
        }
        if (parts.length > 0) {
          translatedRaw = parts.join('');
        }
      }
      let translated = translatedRaw || clean;

      // Polish common terminology translations
      translated = translated
        .replace(/\bPlans\b/gi, 'Schemes')
        .replace(/\bPlan\b/gi, 'Scheme')
        .replace(/\bNext\b/gi, '')
        .replace(/\bas follows\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      return translated;
    }
  } catch (err) {
    console.error('Translation notice:', err);
  }

  return clean;
}

export function normalizeCategory(category?: string | null): string {
  if (!category || category.trim() === '' || category === '—') {
    return 'General Welfare';
  }

  const trimmed = category.trim();
  if (CATEGORY_NORMALIZATION_MAP[trimmed]) {
    return CATEGORY_NORMALIZATION_MAP[trimmed];
  }

  const upper = trimmed.toUpperCase();
  for (const [key, value] of Object.entries(CATEGORY_NORMALIZATION_MAP)) {
    if (upper.includes(key)) {
      return value;
    }
  }

  return trimmed;
}

export async function normalizeRawScheme(scheme: RawSchemeInput): Promise<RawSchemeInput> {
  let title = (scheme.title || '').trim();
  let description = (scheme.description || '').trim();

  // Translate Devanagari if present
  if (/[\u0900-\u097F]/.test(title)) {
    title = await translateDevanagariToEnglish(title);
  }
  if (/[\u0900-\u097F]/.test(description)) {
    description = await translateDevanagariToEnglish(description);
  }

  // Clean redundant whitespace
  title = title.replace(/\s+/g, ' ').trim();
  description = description.replace(/\s+/g, ' ').trim();

  // Standardize state
  let state = (scheme.state || 'Maharashtra').trim();
  if (state.toLowerCase() === 'all' || state.toLowerCase() === 'central' || state.toLowerCase() === 'india') {
    state = 'All India';
  }

  // Standardize apply link
  let applyLink = scheme.applyLink?.trim() || null;
  if (!applyLink) {
    applyLink = `https://www.google.com/search?q=${encodeURIComponent(title + " official portal apply")}`;
  }

  return {
    ...scheme,
    title,
    description,
    state,
    category: normalizeCategory(scheme.category),
    applyLink
  };
}
