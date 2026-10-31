import { Scheme, getEstimatedBenefit } from '@/types/scheme';

export interface UserProfile {
  age: number | string;
  gender: 'Male' | 'Female' | 'Other' | 'Any' | string;
  income: number | string;
  occupation: string;
  state: string;
  socialCategory: string;
}

export interface ScoredScheme {
  scheme: Scheme;
  score: number;
  reasons: string[];
}

export interface EligibilityResult {
  matchedList: ScoredScheme[];
  eligible: Scheme[];
  notEligible: Scheme[];
  estimatedBenefitLabel: string;
  hasHealthInsuranceCover: boolean;
}

/**
 * Pure, deterministic welfare eligibility engine.
 * Evaluates demographic limits, income thresholds, affirmative action quotas,
 * and occupational priority according to central & state department guidelines.
 */
export function evaluateEligibility(
  profile: UserProfile,
  allSchemes: Scheme[]
): EligibilityResult {
  const userAge = typeof profile.age === 'number' ? profile.age : parseInt(profile.age, 10) || 25;
  const userIncome = typeof profile.income === 'number' ? profile.income : parseInt(profile.income, 10) || 0;
  const userGender = profile.gender || 'Any';
  const userOccupation = (profile.occupation || '').toLowerCase().trim();
  const userState = profile.state || 'All India';
  const userSocial = profile.socialCategory || 'All';

  const matchedList: ScoredScheme[] = [];
  const notEligible: Scheme[] = [];

  allSchemes.forEach((scheme) => {
    let isEligible = true;
    let score = 50;
    const reasons: string[] = [];

    const title = (scheme.title || '').toLowerCase();
    const desc = (scheme.description || '').toLowerCase();
    const cat = (scheme.category || '').toLowerCase();
    const soc = (scheme.socialCategory || '').toLowerCase();
    const combined = `${title} ${desc} ${cat} ${soc}`;

    // Filter out generic infrastructure / civil works that aren't direct citizen entitlements
    if (
      combined.includes('redevelop existing railway') ||
      combined.includes('infrastructure development') ||
      combined.includes('railway station')
    ) {
      notEligible.push(scheme);
      return;
    }

    // 1. Age Boundaries
    if (scheme.minAge !== null && scheme.minAge !== undefined && userAge < scheme.minAge) {
      isEligible = false;
    }
    if (scheme.maxAge !== null && scheme.maxAge !== undefined && userAge > scheme.maxAge) {
      isEligible = false;
    }

    // 2. Income Thresholds
    if (scheme.maxIncome !== null && scheme.maxIncome !== undefined && userIncome > scheme.maxIncome) {
      isEligible = false;
    }

    // 3. Gender Target Filtering
    const isWomenOnly =
      combined.includes('for women') ||
      combined.includes('for girl') ||
      combined.includes('pregnant') ||
      combined.includes('lactating') ||
      combined.includes('maternity') ||
      combined.includes('widow') ||
      combined.includes('mahila') ||
      combined.includes('sukanya');

    if (userGender === 'Male' && (scheme.targetGender === 'Female' || isWomenOnly)) {
      isEligible = false;
    }
    if (userGender === 'Female' && isWomenOnly) {
      score += 25;
      reasons.push('Empowerment for Women');
    }

    // 4. State Jurisdiction Matching
    if (scheme.state && scheme.state !== 'All India' && userState !== 'All India') {
      if (scheme.state.toLowerCase() !== userState.toLowerCase()) {
        isEligible = false;
      } else {
        score += 20;
        reasons.push(`${userState} State Scheme`);
      }
    }

    // 5. Occupational Entitlements & Exclusions
    if (userOccupation === 'student') {
      const isStudentScheme =
        combined.includes('scholarship') ||
        combined.includes('student') ||
        combined.includes('education') ||
        combined.includes('school') ||
        combined.includes('college') ||
        combined.includes('fellowship') ||
        combined.includes('tuition') ||
        combined.includes('merit') ||
        combined.includes('coaching') ||
        combined.includes('internship') ||
        combined.includes('skill') ||
        combined.includes('youth') ||
        combined.includes('pragati') ||
        combined.includes('vidya');

      const isIrrelevantForStudent =
        (combined.includes('farmer') ||
          combined.includes('kisan') ||
          combined.includes('krishi') ||
          combined.includes('old age pension') ||
          combined.includes('senior citizen pension') ||
          combined.includes('msme loan') ||
          combined.includes('street vendor loan')) &&
        !isStudentScheme;

      if (isIrrelevantForStudent) {
        isEligible = false;
      } else if (isStudentScheme) {
        score += 45;
        reasons.push('Student & Education Benefit');
      }
    } else if (userOccupation === 'farmer') {
      const isFarmerScheme =
        combined.includes('farmer') ||
        combined.includes('kisan') ||
        combined.includes('krishi') ||
        combined.includes('agriculture') ||
        combined.includes('crop') ||
        combined.includes('soil') ||
        combined.includes('fertilizer') ||
        combined.includes('pm kisan') ||
        combined.includes('irrigation') ||
        combined.includes('fpo') ||
        combined.includes('tractor');

      const isIrrelevantForFarmer =
        (combined.includes('scholarship') ||
          combined.includes('student') ||
          combined.includes('startup loan') ||
          combined.includes('msme credit')) &&
        !isFarmerScheme;

      if (isIrrelevantForFarmer) {
        isEligible = false;
      } else if (isFarmerScheme) {
        score += 45;
        reasons.push('Agriculture & Farmer Subsidy');
      }
    } else if (userOccupation === 'business') {
      const isBusinessScheme =
        combined.includes('msme') ||
        combined.includes('business') ||
        combined.includes('loan') ||
        combined.includes('mudra') ||
        combined.includes('pmegp') ||
        combined.includes('startup') ||
        combined.includes('credit') ||
        combined.includes('enterprise') ||
        combined.includes('vendor') ||
        combined.includes('swanidhi');

      if (isBusinessScheme) {
        score += 40;
        reasons.push('Business Loan & Credit Subsidy');
      }
    } else if (userOccupation === 'worker') {
      const isWorkerScheme =
        combined.includes('shramik') ||
        combined.includes('worker') ||
        combined.includes('labour') ||
        combined.includes('e-shram') ||
        combined.includes('artisan') ||
        combined.includes('vishwakarma') ||
        combined.includes('unorganized') ||
        combined.includes('construction worker');

      if (isWorkerScheme) {
        score += 40;
        reasons.push('Worker Direct Entitlement');
      }
    } else if (userOccupation === 'senior citizen') {
      const isSeniorScheme =
        combined.includes('pension') ||
        combined.includes('senior') ||
        combined.includes('old age') ||
        combined.includes('vaya vandana') ||
        combined.includes('elderly') ||
        userAge >= 60;

      if (isSeniorScheme) {
        score += 45;
        reasons.push('Senior Citizen Pension & Care');
      }
    }

    // 6. Universal Healthcare and Food Security (Ayushman Bharat / NFSA)
    if (
      combined.includes('ayushman') ||
      combined.includes('pmjay') ||
      combined.includes('health insurance') ||
      combined.includes('rashtriya swasthya') ||
      combined.includes('ration') ||
      combined.includes('food security') ||
      combined.includes('anna yojana') ||
      combined.includes('free grain')
    ) {
      if (userIncome <= 300000) {
        score += 25;
        reasons.push('Universal Health/Food Support');
      }
    }

    // 7. Affirmative Action & Social Category Quotas
    if (
      userSocial === 'SC/ST' &&
      (combined.includes('sc/st') || combined.includes('scheduled caste') || combined.includes('tribal'))
    ) {
      score += 25;
      reasons.push('SC/ST Welfare Quota');
    } else if (userSocial === 'OBC' && (combined.includes('obc') || combined.includes('backward class'))) {
      score += 20;
      reasons.push('OBC Scheme Entitlement');
    } else if (
      userSocial === 'Minority' &&
      (combined.includes('minority') || combined.includes('begum hazrat') || combined.includes('nai roshni'))
    ) {
      score += 30;
      reasons.push('Minority Development Scheme');
    }

    if (isEligible) {
      matchedList.push({ scheme, score, reasons });
    } else {
      notEligible.push(scheme);
    }
  });

  // Rank by highest relevance score
  matchedList.sort((a, b) => b.score - a.score);
  const eligible = matchedList.map((item) => item.scheme);

  // Derive estimated aggregate entitlement
  let benefitLabel = 'Direct Welfare Aid';
  const healthCover = userIncome <= 300000;

  if (userOccupation === 'student') {
    benefitLabel = '₹25,000 - ₹50,000 / Year';
  } else if (userOccupation === 'farmer') {
    benefitLabel = '₹6,000 - ₹15,000 / Year';
  } else if (userOccupation === 'worker') {
    benefitLabel = '₹12,000 - ₹24,000 / Year';
  } else if (userOccupation === 'business') {
    benefitLabel = 'Up to 35% Capital Subsidy';
  } else if (userOccupation === 'senior citizen') {
    benefitLabel = '₹12,000 - ₹36,000 / Year';
  } else if (eligible.length > 0) {
    const topBenefit = getEstimatedBenefit(eligible[0]);
    benefitLabel = topBenefit.label;
  }

  return {
    matchedList,
    eligible,
    notEligible,
    estimatedBenefitLabel: benefitLabel,
    hasHealthInsuranceCover: healthCover,
  };
}
