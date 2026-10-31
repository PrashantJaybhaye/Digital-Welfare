import { extractRequiredDocuments } from '@/lib/pipeline/doc-extractor';
import { extractSchemeTimeline } from '@/lib/pipeline/timeline-extractor';

export interface Scheme {
  id?: string;
  title: string;
  description: string;
  category: string;
  department?: string | null;
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
  applicationTimeline?: SchemeTimeline;
  lastSyncedAt: string;
}

export interface SchemeTimeline {
  status: 'Open Year-Round' | 'Active Cycle' | 'Extended Deadline';
  badgeColor: 'emerald' | 'amber' | 'blue';
  datesText: string;
  startDate?: string;
  endDate?: string;
  extendedDate?: string;
  isExtended: boolean;
  officialNotice: string;
}

export const CATEGORY_MAP: Record<string, string> = {
  'CS': 'Central Sector Scheme',
  'CSS': 'Centrally Sponsored Scheme',
  'CCP': 'Climate Change Programme',
  'DHE': 'Higher Education',
  'DTE': 'Technical Education',
  'DMER': 'Medical Education',
  'SJSA': 'Social Justice & Special Assistance',
  'TDD': 'Tribal Development',
  'OBC': 'OBC & VJNT Welfare',
  'VJNT': 'OBC & VJNT Welfare',
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
  if (scheme.requiredDocuments && scheme.requiredDocuments.length >= 3) {
    return scheme.requiredDocuments;
  }
  return extractRequiredDocuments(scheme);
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

export const DEFAULT_APPLICATION_STEPS = [
  'Gather Aadhaar, Domicile, and relevant eligibility documents',
  'Register on the official portal and verify via Aadhaar OTP',
  'Fill out personal, bank, and income details and submit form',
  'Track your Application Reference Number (ARN) for Direct DBT approval'
];

export const INDIAN_STATES = [
  'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export function getSchemeTimeline(scheme: Partial<Scheme>): SchemeTimeline {
  if (scheme.applicationTimeline) {
    return scheme.applicationTimeline;
  }
  return extractSchemeTimeline(scheme);
}
