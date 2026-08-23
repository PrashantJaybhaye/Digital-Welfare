import { Scheme } from '@/types/scheme';
import { MAHARASHTRA_OFFICIAL_RAW_SCHEMES } from './pipeline/mahadbt-catalog';
import { extractEligibilityRules } from './pipeline/rule-extractor';
import { extractRequiredDocuments } from './pipeline/doc-extractor';
import { extractBenefits } from './pipeline/benefit-extractor';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 100);
}

export const FALLBACK_SCHEMES: Scheme[] = MAHARASHTRA_OFFICIAL_RAW_SCHEMES.map((raw, idx) => {
  const rules = extractEligibilityRules(raw);
  const requiredDocuments = extractRequiredDocuments(raw);
  const benefitData = extractBenefits(raw);
  const slug = generateSlug(raw.title || `scheme-${idx + 1}`);

  return {
    id: slug,
    title: raw.title || 'Government Welfare Scheme',
    description: raw.description || 'Official public welfare scheme by the Government.',
    category: raw.category || 'MahaDBT (Maharashtra)',
    state: raw.state || 'Maharashtra',
    minAge: rules.minAge,
    maxAge: rules.maxAge,
    maxIncome: rules.maxIncome,
    targetGender: rules.targetGender,
    targetOccupation: rules.targetOccupation,
    socialCategory: rules.socialCategory,
    benefits: benefitData.benefits,
    requiredDocuments,
    stepsToApply: raw.stepsToApply?.length
      ? raw.stepsToApply
      : [
          'Gather Aadhaar, Domicile, and relevant eligibility documents',
          'Register on the official portal and verify via Aadhaar OTP',
          'Fill out personal, bank, and income details and submit form',
          'Track your Application Reference Number (ARN) for Direct DBT approval'
        ],
    estimatedBenefitAmount: benefitData.estimatedBenefitAmount,
    financialBenefitText: benefitData.financialBenefitText,
    applyLink: raw.applyLink,
    lastSyncedAt: new Date().toISOString()
  };
});

export function getFallbackScheme(idOrSlug: string): Scheme | null {
  if (!idOrSlug) return null;
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();

  const exact = FALLBACK_SCHEMES.find(s => s.id === target || s.id?.toLowerCase() === target);
  if (exact) return exact;

  const slugTarget = generateSlug(target);
  const bySlug = FALLBACK_SCHEMES.find(s => s.id === slugTarget || generateSlug(s.title) === slugTarget);
  if (bySlug) return bySlug;

  const byTitle = FALLBACK_SCHEMES.find(s => 
    s.title.toLowerCase().includes(target) || target.includes(s.title.toLowerCase())
  );
  if (byTitle) return byTitle;

  const numericIdx = parseInt(target, 10);
  if (!isNaN(numericIdx) && numericIdx >= 0 && numericIdx < FALLBACK_SCHEMES.length) {
    return FALLBACK_SCHEMES[numericIdx];
  }

  return null;
}

export function getFallbackSchemes(): Scheme[] {
  return FALLBACK_SCHEMES;
}
