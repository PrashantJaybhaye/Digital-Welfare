export interface RawSchemeInput {
  title?: string | null;
  description?: string | null;
  category?: string | null;
  department?: string | null;
  state?: string | null;
  minAge?: number | null;
  maxAge?: number | null;
  maxIncome?: number | null;
  targetGender?: 'Male' | 'Female' | 'Any' | null;
  targetOccupation?: string | null;
  socialCategory?: 'All' | 'SC/ST' | 'OBC' | 'VJNT' | 'SBC' | 'General' | 'EWS' | 'Minority' | null;
  educationLevel?: string | null;
  benefits?: string[] | null;
  requiredDocuments?: string[] | null;
  stepsToApply?: string[] | null;
  financialBenefitText?: string | null;
  estimatedBenefitAmount?: number | null;
  applyLink?: string | null;
  sourceUrl?: string | null;
  sourceType?: 'MahaDBT' | 'MP-SIMS' | 'Central-Portal' | 'State-Gazette' | 'Curated' | string;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
  sanitized?: RawSchemeInput;
}

const INVALID_TITLE_PATTERNS = [
  /^\d+\s*schemes?$/i,
  /^(other|list of other)\s*\d*\s*schemes?$/i,
  /^search for eligible schemes?$/i,
  /^schemes? for (farmers?|pensioners?|school students?|college students?|persons with disabilities|divyang|women)$/i,
  /^(college student|school student|farmers?|divyang|pensioners?)\s*\d+\s*schemes?$/i,
  /^(click here|read more|apply here|view all|know more|faq|guidelines|rules)$/i,
  /^(general scholarship school students \d+ scheme)$/i,
  /^(pensioners\/special assistance scheme \d+ schemes?)$/i,
  /^(women empowerment[,/ ]+labor[,/ ]+and other welfare schemes(\s*\d*\s*schemes?)?)$/i,
  /^(other \d+ schemes)$/i,
  /^[0-9\s.,_-]+$/
];

const DISCONTINUED_PATTERNS = [
  /\bdiscontinued\b/i,
  /\bsuperseded by\b/i,
  /\bmerged into\b/i,
  /\bclosed on\b/i,
  /\bended in\b/i,
  /\bformer (scheme|program|initiative)\b/i,
  /\bno longer (operational|active|accepting)\b/i,
  /\bterminated\b/i,
  /\barchived scheme\b/i,
  /\bvalid only till 20(1\d|2[0-3])\b/i
];

/**
 * Detects whether a scheme has been discontinued, expired, or replaced by newer government programs.
 */
export function isSchemeExpired(title: string, description: string): boolean {
  const combined = `${title} ${description}`.toLowerCase();
  return DISCONTINUED_PATTERNS.some(pattern => pattern.test(combined));
}

/**
 * Resolves verified live official government application links.
 * Cleans dead URLs, Wikipedia links, and placeholders, routing to active official portals.
 */
export function resolveActiveApplicationUrl(
  title?: string | null,
  category?: string | null,
  state?: string | null,
  rawUrl?: string | null
): string {
  const text = `${title || ''} ${category || ''}`.toLowerCase();
  const isMaha = (state || 'Maharashtra').toLowerCase().includes('maharashtra');

  if (rawUrl && typeof rawUrl === 'string') {
    const trimmed = rawUrl.trim();
    if (
      trimmed.startsWith('https://') &&
      !trimmed.includes('wikipedia.org') &&
      !trimmed.includes('example.com') &&
      !trimmed.includes('localhost') &&
      (trimmed.includes('.gov.in') || trimmed.includes('.nic.in') || trimmed.includes('.org') || trimmed.includes('.in'))
    ) {
      return trimmed.replace(/\/+$/, '');
    }
  }

  // Scheme-specific official live portals
  if (text.includes('ladki bahin')) return 'https://ladakibahin.maharashtra.gov.in';
  if (text.includes('lek ladki')) return 'https://womenchild.maharashtra.gov.in';
  if (text.includes('annapurna') || text.includes('gas cylinder')) return 'https://mahafood.gov.in';

  if (text.includes('kisan') || text.includes('shetkari') || text.includes('krishi') || text.includes('solar pump')) {
    return isMaha ? 'https://krishi.maharashtra.gov.in' : 'https://pmkisan.gov.in';
  }

  if (text.includes('ayushman') || text.includes('pm-jay') || text.includes('pmjay') || text.includes('mjpjay') || text.includes('arogya')) {
    return isMaha ? 'https://www.jeevandayee.gov.in' : 'https://beneficiary.nha.gov.in';
  }

  if (text.includes('pmegp') || text.includes('kvic')) {
    return 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp';
  }

  if (text.includes('mudra')) {
    return 'https://www.mudra.org.in';
  }

  if (text.includes('stand up india')) {
    return 'https://www.standupmitra.in';
  }

  if (text.includes('awas') || text.includes('housing') || text.includes('gharkul') || text.includes('pmay')) {
    return text.includes('gramin') || text.includes('rural') ? 'https://pmayg.nic.in' : 'https://pmaymis.gov.in';
  }

  if (text.includes('annasaheb patil') || text.includes('mahaswayam') || text.includes('yuva karya') || text.includes('employment')) {
    return 'https://rojgar.mahaswayam.gov.in';
  }

  if (text.includes('bocw') || text.includes('bandhkam')) {
    return 'https://mahabocw.in';
  }

  if (isMaha) {
    return 'https://mahadbt2.maharashtra.gov.in';
  }

  // Default official Government of India unified portal
  return 'https://www.myscheme.gov.in';
}

export function validateRawScheme(input: RawSchemeInput): ValidationResult {
  if (!input) {
    return { isValid: false, reason: 'Empty input object' };
  }

  const rawTitle = (input.title || '').trim();
  if (!rawTitle || rawTitle.length < 4) {
    return { isValid: false, reason: 'Title is missing or too short (< 4 chars)' };
  }

  for (const pattern of INVALID_TITLE_PATTERNS) {
    if (pattern.test(rawTitle)) {
      return { isValid: false, reason: `Title matched generic placeholder pattern: ${pattern.toString()}` };
    }
  }

  const rawDesc = (input.description || '').trim();
  if (!rawDesc || rawDesc.length < 10) {
    return { isValid: false, reason: 'Description is missing or too brief (< 10 chars)' };
  }

  const lowerDesc = rawDesc.toLowerCase();
  if (lowerDesc.includes('page not found') || lowerDesc.includes('404 error') || lowerDesc.includes('access denied')) {
    return { isValid: false, reason: 'Description contains error or 404 text' };
  }

  // Check if scheme has been discontinued or expired
  if (isSchemeExpired(rawTitle, rawDesc)) {
    return { isValid: false, reason: 'Scheme is expired, discontinued, or superseded' };
  }

  const validatedApplyLink = resolveActiveApplicationUrl(rawTitle, input.category, input.state, input.applyLink);

  return {
    isValid: true,
    sanitized: {
      ...input,
      title: rawTitle,
      description: rawDesc,
      state: (input.state || 'Maharashtra').trim(),
      category: (input.category || 'MahaDBT (Maharashtra)').trim(),
      applyLink: validatedApplyLink
    }
  };
}
