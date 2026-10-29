export interface Scheme {
  id?: string;
  title: string;
  description: string;
  category: string;
  state: string;
  minAge?: number | null;
  maxAge?: number | null;
  maxIncome?: number | null;
  targetGender?: 'Male' | 'Female' | 'Any' | null;
  targetOccupation?: string | null;
  socialCategory?: 'All' | 'SC/ST' | 'OBC' | 'VJNT' | 'SBC' | 'General' | 'EWS' | 'Minority' | null;
  benefits: string[];
  requiredDocuments?: string[];
  stepsToApply?: string[];
  estimatedBenefitAmount?: number | null;
  financialBenefitText?: string | null;
  tags?: string[];
  applyLink?: string | null;
  lastSyncedAt: string;
}

export const CATEGORY_MAP: Record<string, string> = {
  'CS': 'Central Sector Scheme',
  'CSS': 'Centrally Sponsored Scheme',
  'CCP': 'Climate Change Programme',
  '—': 'General',
};

export function formatCategoryName(category?: string | null): string {
  if (!category || category === '—') return 'General';
  return CATEGORY_MAP[category.trim()] || category;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 100);
}

export function getSchemeDocuments(scheme: Scheme): string[] {
  if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
    return scheme.requiredDocuments;
  }
  return [
    'Aadhaar Card (Identity & Proof of Address)',
    'Bank Account Passbook / Cancelled Cheque (Linked to Aadhaar for DBT)',
    'Recent Passport-Sized Photographs'
  ];
}

export function getSchemeApplicationSteps(scheme: Scheme): { title: string; desc: string }[] {
  if (scheme.stepsToApply && scheme.stepsToApply.length > 0) {
    return scheme.stepsToApply.map((step, idx) => ({
      title: `Step ${idx + 1}`,
      desc: step
    }));
  }
  return [
    { title: 'Step 1: Document Preparation', desc: 'Gather Aadhaar, bank passbook, income certificate, and relevant proofs.' },
    { title: 'Step 2: Portal Registration', desc: 'Visit the official scheme or ministry portal or nearest Citizen Facilitation Centre.' },
    { title: 'Step 3: Online Form Submission', desc: 'Fill out personal, bank, and eligibility details, and verify via Aadhaar OTP.' },
    { title: 'Step 4: Application Tracking', desc: 'Note down your Application Reference Number (ARN) for direct DBT tracking.' }
  ];
}

export function getEstimatedBenefit(scheme: Scheme): { amount: number; label: string } {
  if (scheme.estimatedBenefitAmount || scheme.financialBenefitText) {
    return {
      amount: scheme.estimatedBenefitAmount || 0,
      label: scheme.financialBenefitText || `₹${(scheme.estimatedBenefitAmount || 0).toLocaleString('en-IN')} Welfare Benefit`
    };
  }
  return { amount: 5000, label: 'Direct Public Welfare Support' };
}
