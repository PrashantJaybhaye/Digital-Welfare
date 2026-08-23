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

// Patterns of generic headings or placeholder scrapings to discard
const INVALID_TITLE_PATTERNS = [
  /^\d+\s*schemes?$/i,
  /^(other|list of other)\s*\d*\s*schemes?$/i,
  /^search for eligible schemes?$/i,
  /^schemes? for (farmers?|pensioners?|school students?|college students?|persons with disabilities|divyang|women)$/i,
  /^(college student|school student|farmers?|divyang|pensioners?)\s*\d+\s*schemes?$/i,
  /^(click here|read more|apply here|view all|know more|faq|guidelines|rules)$/i,
  /^(general scholarship school students \d+ scheme)$/i,
  /^(pensioners\/special assistance scheme \d+ schemes?)$/i,
  /^(other \d+ schemes)$/i,
  /^[0-9\s.,_-]+$/
];

export function validateRawScheme(input: RawSchemeInput): ValidationResult {
  if (!input) {
    return { isValid: false, reason: 'Empty input object' };
  }

  const rawTitle = (input.title || '').trim();
  if (!rawTitle || rawTitle.length < 4) {
    return { isValid: false, reason: 'Title is missing or too short (< 4 chars)' };
  }

  // Check invalid title patterns
  for (const pattern of INVALID_TITLE_PATTERNS) {
    if (pattern.test(rawTitle)) {
      return { isValid: false, reason: `Title matched invalid generic pattern: ${pattern.toString()}` };
    }
  }

  const rawDesc = (input.description || '').trim();
  if (!rawDesc || rawDesc.length < 10) {
    return { isValid: false, reason: 'Description is missing or too brief (< 10 chars)' };
  }

  // Discard pure error pages or 404 text
  const lowerDesc = rawDesc.toLowerCase();
  if (lowerDesc.includes('page not found') || lowerDesc.includes('404 error') || lowerDesc.includes('access denied')) {
    return { isValid: false, reason: 'Description contains error/404 content' };
  }

  return {
    isValid: true,
    sanitized: {
      ...input,
      title: rawTitle,
      description: rawDesc,
      state: (input.state || 'Maharashtra').trim(),
      category: (input.category || 'MahaDBT (Maharashtra)').trim()
    }
  };
}
