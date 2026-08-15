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
  socialCategory?: 'All' | 'SC/ST' | 'OBC' | 'General' | 'EWS' | 'Minority' | null;
  benefits: string[];
  requiredDocuments?: string[];
  stepsToApply?: string[];
  estimatedBenefitAmount?: number | null; // Estimated annual value in INR
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

// Generate sensible document checklists for Indian schemes if none provided
export function getSchemeDocuments(scheme: Scheme): string[] {
  if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
    return scheme.requiredDocuments;
  }

  const docs: string[] = [
    'Aadhaar Card (Identity & Proof of Address)',
    'Bank Account Passbook / Cancelled Cheque (Linked to Aadhaar for DBT)',
    'Recent Passport-Sized Photographs'
  ];

  const lowerTitle = scheme.title.toLowerCase();
  const lowerDesc = scheme.description.toLowerCase();
  const combined = `${lowerTitle} ${lowerDesc}`;

  if (combined.includes('farmer') || combined.includes('krishi') || combined.includes('kisan') || combined.includes('agriculture')) {
    docs.push('Land Ownership Record (7/12 extract / RoR) or Kisan Credit Card');
    docs.push('Income Certificate issued by Revenue Authority');
  } else if (combined.includes('scholarship') || combined.includes('education') || combined.includes('student') || combined.includes('fellowship')) {
    docs.push('Previous Year Educational Marksheet / Degree Certificate');
    docs.push('Current College / School Enrollment ID & Fee Receipt');
    docs.push('Family Annual Income Certificate');
  } else if (combined.includes('health') || combined.includes('swasthya') || combined.includes('bima') || combined.includes('ayushman') || combined.includes('insurance')) {
    docs.push('Ration Card (BPL / Antyodaya / Priority Household)');
    docs.push('Medical Certificate / Health Condition Card (if applicable)');
  } else if (combined.includes('employment') || combined.includes('rozgar') || combined.includes('msme') || combined.includes('business') || combined.includes('pmegp')) {
    docs.push('Educational Qualification Certificate (8th/10th/Degree)');
    docs.push('Detailed Project Report (DPR) / Business Proposal');
    docs.push('Caste / Category Certificate (for special subsidy reservations)');
  } else if (combined.includes('housing') || combined.includes('awas')) {
    docs.push('Ration Card / BPL Card');
    docs.push('Affidavit of not owning a pucca house in India');
    docs.push('Income Certificate');
  } else {
    docs.push('Income Certificate (Tehsildar / Competent Authority)');
    docs.push('Domicile / Residence Certificate of State');
  }

  return docs;
}

// Generate application step guide
export function getSchemeApplicationSteps(scheme: Scheme): { title: string; desc: string }[] {
  if (scheme.stepsToApply && scheme.stepsToApply.length > 0) {
    return scheme.stepsToApply.map((step, idx) => ({
      title: `Step ${idx + 1}`,
      desc: step
    }));
  }

  return [
    {
      title: 'Step 1: Document Preparation',
      desc: 'Gather and scan your Aadhaar, bank passbook, income certificate, and relevant eligibility documents.'
    },
    {
      title: 'Step 2: Portal Registration',
      desc: 'Visit the official scheme / ministry portal or your nearest Common Service Centre (CSC) / Citizen Facilitation Centre.'
    },
    {
      title: 'Step 3: Online Form Submission',
      desc: 'Fill out personal, bank, and eligibility details, upload scanned documents, and verify via Aadhaar OTP.'
    },
    {
      title: 'Step 4: Application Tracking & Verification',
      desc: 'Note down your Application Reference Number (ARN) to track approval status and direct benefit bank transfer (DBT).'
    }
  ];
}

// Estimate benefit amount in INR for calculation
export function getEstimatedBenefit(scheme: Scheme): { amount: number; label: string } {
  if (scheme.estimatedBenefitAmount) {
    return {
      amount: scheme.estimatedBenefitAmount,
      label: scheme.financialBenefitText || `₹${scheme.estimatedBenefitAmount.toLocaleString('en-IN')}`
    };
  }

  const combined = `${scheme.title.toLowerCase()} ${scheme.description.toLowerCase()}`;

  if (combined.includes('ayushman') || combined.includes('health insurance') || combined.includes('swasthya bima')) {
    return { amount: 500000, label: '₹5,00,000 / year (Free Health Cover)' };
  }
  if (combined.includes('kisan') || combined.includes('pm-kisan')) {
    return { amount: 6000, label: '₹6,000 / year (Direct Cash DBT)' };
  }
  if (combined.includes('scholarship') || combined.includes('fellowship')) {
    return { amount: 25000, label: 'Up to ₹25,000 - ₹50,000 / year (Education Grant)' };
  }
  if (combined.includes('pmegp') || combined.includes('employment generation') || combined.includes('loan')) {
    return { amount: 100000, label: 'Up to 35% Govt Subsidy on Business Project' };
  }
  if (combined.includes('awas') || combined.includes('housing')) {
    return { amount: 120000, label: 'Up to ₹1,20,000 - ₹2,50,000 (Housing Subsidy)' };
  }
  if (combined.includes('nrega') || combined.includes('wage')) {
    return { amount: 24000, label: 'Guaranteed 100 Days Wage (~₹24,000/yr)' };
  }

  return { amount: 10000, label: 'Direct Public Welfare Benefit' };
}
