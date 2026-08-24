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

export function getSchemeDocuments(scheme: Scheme): string[] {
  if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
    return scheme.requiredDocuments;
  }

  const docs: string[] = [
    'Aadhaar Card (Identity & Proof of Address)',
    'Bank Account Passbook / Cancelled Cheque (Linked to Aadhaar for DBT)',
    'Recent Passport-Sized Photographs'
  ];

  const text = `${scheme?.title || ''} ${scheme?.description || ''}`.toLowerCase();

  if (text.includes('farmer') || text.includes('krishi') || text.includes('kisan') || text.includes('agriculture')) {
    docs.push('Land Ownership Record (7/12 extract / RoR) or Kisan Credit Card');
    docs.push('Income Certificate issued by Revenue Authority');
  } else if (text.includes('scholarship') || text.includes('education') || text.includes('student') || text.includes('fellowship')) {
    docs.push('Previous Year Educational Marksheet / Degree Certificate');
    docs.push('Current College / School Enrollment ID & Fee Receipt');
    docs.push('Family Annual Income Certificate');
  } else if (text.includes('health') || text.includes('swasthya') || text.includes('bima') || text.includes('ayushman') || text.includes('insurance')) {
    docs.push('Ration Card (BPL / Antyodaya / Priority Household)');
    docs.push('Medical Certificate / Health Condition Card (if applicable)');
  } else if (text.includes('employment') || text.includes('rozgar') || text.includes('msme') || text.includes('business') || text.includes('pmegp')) {
    docs.push('Educational Qualification Certificate (8th/10th/Degree)');
    docs.push('Detailed Project Report (DPR) / Business Proposal');
    docs.push('Caste / Category Certificate (for special subsidy reservations)');
  } else if (text.includes('housing') || text.includes('awas')) {
    docs.push('Ration Card / BPL Card');
    docs.push('Affidavit of not owning a pucca house in India');
    docs.push('Income Certificate');
  } else {
    docs.push('Income Certificate (Tehsildar / Competent Authority)');
    docs.push('Domicile / Residence Certificate of State');
  }

  return docs;
}

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

export function getEstimatedBenefit(scheme: Scheme): { amount: number; label: string } {
  if (scheme.estimatedBenefitAmount) {
    return {
      amount: scheme.estimatedBenefitAmount,
      label: scheme.financialBenefitText || `₹${scheme.estimatedBenefitAmount.toLocaleString('en-IN')}`
    };
  }

  const text = `${scheme?.title || ''} ${scheme?.description || ''}`.toLowerCase();

  if (text.includes('ayushman') || text.includes('health insurance') || text.includes('swasthya bima')) {
    return { amount: 500000, label: '₹5,00,000 / Year (Free Health Cover)' };
  }
  if (text.includes('kisan') || text.includes('pm-kisan') || text.includes('samman nidhi')) {
    return { amount: 6000, label: '₹6,000 / Year (Direct DBT)' };
  }
  if (text.includes('scholarship') || text.includes('fellowship') || text.includes('vidya') || text.includes('pragati')) {
    return { amount: 25000, label: 'Up to ₹25,000 - ₹50,000 / Year' };
  }
  if (text.includes('pmegp') || text.includes('mudra') || text.includes('swanidhi') || text.includes('business loan')) {
    return { amount: 50000, label: 'Up to 35% Capital Subsidy' };
  }
  if (text.includes('awas') || text.includes('housing') || text.includes('pmay')) {
    return { amount: 120000, label: 'Up to ₹1,20,000 (Housing Subsidy)' };
  }
  if (text.includes('pension') || text.includes('vaya vandana') || text.includes('old age')) {
    return { amount: 12000, label: '₹1,000 - ₹3,000 / Month Pension' };
  }
  if (text.includes('maternity') || text.includes('matru') || text.includes('janani')) {
    return { amount: 6000, label: '₹5,000 - ₹6,000 Maternity Aid' };
  }
  if (text.includes('ration') || text.includes('anna yojana') || text.includes('food security')) {
    return { amount: 8000, label: 'Free Monthly Food Grains' };
  }

  return { amount: 5000, label: 'Direct Public Welfare Support' };
}
