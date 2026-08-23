import { RawSchemeInput } from './validator';

export interface ExtractedRules {
  minAge: number | null;
  maxAge: number | null;
  maxIncome: number | null;
  socialCategory: 'All' | 'SC/ST' | 'OBC' | 'VJNT' | 'SBC' | 'General' | 'EWS' | 'Minority' | null;
  targetGender: 'Male' | 'Female' | 'Any';
  targetOccupation: string;
}

export function extractEligibilityRules(scheme: RawSchemeInput): ExtractedRules {
  const text = `${scheme.title || ''} ${scheme.description || ''} ${scheme.category || ''}`.toLowerCase();

  let minAge = scheme.minAge !== undefined ? scheme.minAge : null;
  let maxAge = scheme.maxAge !== undefined ? scheme.maxAge : null;

  if (minAge === null && maxAge === null) {
    const rangeMatch = text.match(/(?:aged|between|age group of|age)\s+(\d{1,2})\s*(?:to|-|and)\s*(\d{1,2})\s*(?:years|yrs)?/i);
    if (rangeMatch) {
      minAge = parseInt(rangeMatch[1], 10);
      maxAge = parseInt(rangeMatch[2], 10);
    } else {
      const minMatch = text.match(/(?:above|minimum age of|at least|age|attaining)\s+(\d{1,2})\s*(?:years|yrs)?\s*(?:and above|\+)?/i);
      if (minMatch && (text.includes('above') || text.includes('minimum') || text.includes('+'))) {
        minAge = parseInt(minMatch[1], 10);
      }

      const maxMatch = text.match(/(?:up to|maximum age|below|under)\s+(\d{1,2})\s*(?:years|yrs)?/i);
      if (maxMatch) {
        maxAge = parseInt(maxMatch[1], 10);
      }
    }

    if (text.includes('senior citizen') || text.includes('old age') || text.includes('vridha') || text.includes('vayoshree') || text.includes('shravanbal')) {
      minAge = minAge || 60;
    } else if (text.includes('ladki bahin') || text.includes('majhi ladki')) {
      minAge = 21;
      maxAge = 65;
    } else if (text.includes('yuva') || text.includes('internship') || text.includes('apprenticeship')) {
      minAge = 18;
      maxAge = 35;
    } else if (text.includes('girl child') || text.includes('lek ladki') || text.includes('sukanya')) {
      minAge = 0;
      maxAge = 18;
    } else if (text.includes('post-matric') || text.includes('higher education') || text.includes('college')) {
      minAge = minAge || 17;
      maxAge = maxAge || 35;
    }
  }

  let maxIncome = scheme.maxIncome !== undefined ? scheme.maxIncome : null;
  if (maxIncome === null) {
    if (text.includes('8 lakh') || text.includes('8,00,000') || text.includes('800000') || text.includes('ebc')) {
      maxIncome = 800000;
    } else if (text.includes('2.5 lakh') || text.includes('2,50,000') || text.includes('250000')) {
      maxIncome = 250000;
    } else if (text.includes('1.5 lakh') || text.includes('1,50,000') || text.includes('150000')) {
      maxIncome = 150000;
    } else if (text.includes('1 lakh') || text.includes('1,00,000') || text.includes('100000')) {
      maxIncome = 100000;
    } else if (text.includes('bpl') || text.includes('below poverty') || text.includes('yellow ration card') || text.includes('destitute') || text.includes('niradhar')) {
      maxIncome = 50000;
    }
  }

  let socialCategory: 'All' | 'SC/ST' | 'OBC' | 'VJNT' | 'SBC' | 'General' | 'EWS' | 'Minority' | null = scheme.socialCategory || null;
  if (!socialCategory) {
    if (text.includes('sc/st') || (text.includes('scheduled caste') && text.includes('scheduled tribe'))) {
      socialCategory = 'SC/ST';
    } else if (text.includes('sc ') || text.includes('scheduled caste') || text.includes('nav-bouddha') || text.includes('swadhar')) {
      socialCategory = 'SC/ST';
    } else if (text.includes('st ') || text.includes('scheduled tribe') || text.includes('tribal') || text.includes('swayam yojana')) {
      socialCategory = 'SC/ST';
    } else if (text.includes('vjnt') || text.includes('nomadic tribe') || text.includes('vimukta')) {
      socialCategory = 'VJNT';
    } else if (text.includes('obc') || text.includes('other backward') || text.includes('sbc')) {
      socialCategory = 'OBC';
    } else if (text.includes('minority') || text.includes('muslim') || text.includes('christian') || text.includes('jain') || text.includes('buddhist')) {
      socialCategory = 'Minority';
    } else if (text.includes('ebc') || text.includes('economically backward') || text.includes('ews')) {
      socialCategory = 'EWS';
    } else {
      socialCategory = 'All';
    }
  }

  let targetGender: 'Male' | 'Female' | 'Any' = scheme.targetGender || 'Any';
  if (targetGender === 'Any') {
    if (
      text.includes('women') || text.includes('female') || text.includes('mother') || 
      text.includes('girl') || text.includes('mahila') || text.includes('bahin') ||
      text.includes('kanya') || text.includes('maternity') || text.includes('widow')
    ) {
      targetGender = 'Female';
    }
  }

  let targetOccupation = scheme.targetOccupation || 'All Citizens';
  if (targetOccupation === 'All Citizens' || !targetOccupation) {
    if (text.includes('farmer') || text.includes('krishi') || text.includes('kisan') || text.includes('shetkari') || text.includes('irrigation') || text.includes('cultivator')) {
      targetOccupation = 'Farmer';
    } else if (text.includes('student') || text.includes('scholarship') || text.includes('freeship') || text.includes('fellowship') || text.includes('vidya') || text.includes('education') || text.includes('college') || text.includes('school')) {
      targetOccupation = 'Student';
    } else if (text.includes('unemployed') || text.includes('internship') || text.includes('youth') || text.includes('yuva') || text.includes('job seeker')) {
      targetOccupation = 'Unemployed';
    } else if (text.includes('worker') || text.includes('construction') || text.includes('labour') || text.includes('bocw') || text.includes('kamgar') || text.includes('shramik') || text.includes('unorganized')) {
      targetOccupation = 'Worker';
    } else if (text.includes('senior citizen') || text.includes('pensioner') || text.includes('vridha') || text.includes('old age')) {
      targetOccupation = 'Senior Citizen';
    } else if (text.includes('artisan') || text.includes('craftsman') || text.includes('vishwakarma') || text.includes('weaver') || text.includes('tailor') || text.includes('barber')) {
      targetOccupation = 'Artisan';
    } else if (text.includes('entrepreneur') || text.includes('business') || text.includes('msme') || text.includes('startup') || text.includes('self employment') || text.includes('loan')) {
      targetOccupation = 'Entrepreneur';
    } else if (text.includes('disability') || text.includes('divyang') || text.includes('handicapped') || text.includes('pwd')) {
      targetOccupation = 'Persons with Disabilities';
    }
  }

  return {
    minAge,
    maxAge,
    maxIncome,
    socialCategory,
    targetGender,
    targetOccupation
  };
}
