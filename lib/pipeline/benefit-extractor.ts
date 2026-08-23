import { RawSchemeInput } from './validator';

export interface ExtractedBenefits {
  benefits: string[];
  estimatedBenefitAmount: number;
  financialBenefitText: string;
}

export function extractBenefits(scheme: RawSchemeInput): ExtractedBenefits {
  let benefits = scheme.benefits && scheme.benefits.length > 0 ? [...scheme.benefits] : [];
  const text = `${scheme.title || ''} ${scheme.description || ''} ${scheme.category || ''}`.toLowerCase();

  let estimatedBenefitAmount = scheme.estimatedBenefitAmount || 0;
  let financialBenefitText = scheme.financialBenefitText || '';

  // 1. Ladki Bahin / Direct Cash Assistance to Women
  if (text.includes('ladki bahin') || text.includes('majhi ladki')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 18000;
    financialBenefitText = financialBenefitText || '₹1,500 / Month Direct Bank Transfer (DBT)';
    if (benefits.length === 0) {
      benefits = [
        '₹1,500 direct monthly transfer into Aadhaar-linked bank account',
        'Eligibility for 3 free LPG gas cylinders per year under Annapurna Yojana',
        'Direct financial independence and nutritional security for women'
      ];
    }
  }

  // 2. Namo Shetkari / Farmer Cash Assistance
  else if (text.includes('namo shetkari') || (text.includes('shetkari') && text.includes('samman nidhi'))) {
    estimatedBenefitAmount = estimatedBenefitAmount || 12000;
    financialBenefitText = financialBenefitText || '₹6,000 / Year (Total ₹12,000 with PM-KISAN)';
    if (benefits.length === 0) {
      benefits = [
        '₹6,000 per year direct cash assistance in 3 installments of ₹2,000',
        '100% supplementary addition over Central PM-KISAN',
        'Direct DBT credit to bank accounts with zero intermediaries'
      ];
    }
  }

  // 3. Agricultural Free Electricity
  else if (text.includes('baliraja') || text.includes('vij savlat') || (text.includes('electricity') && text.includes('pump'))) {
    estimatedBenefitAmount = estimatedBenefitAmount || 25000;
    financialBenefitText = financialBenefitText || '100% Free Electricity for Farm Pumps up to 7.5 HP';
    if (benefits.length === 0) {
      benefits = [
        'Complete waiver of agricultural electricity power bills',
        'Zero-cost power for irrigation water pumps up to 7.5 HP capacity',
        'Full waiver of outstanding agricultural electricity arrears'
      ];
    }
  }

  // 4. Health Insurance / MJPJAY / PM-JAY
  else if (text.includes('jan arogya') || text.includes('mjpjay') || text.includes('ayushman') || text.includes('swasthya bima')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 500000;
    financialBenefitText = financialBenefitText || '₹5,00,000 / Year Free Cashless Hospital Cover';
    if (benefits.length === 0) {
      benefits = [
        '₹5 Lakh cashless hospital treatment coverage per family per year',
        'Covers 1,356 medical and surgical procedures across 30+ specialty categories',
        'Covers pre-existing illnesses, ICU charges, medicines, diagnostics, and post-discharge care'
      ];
    }
  }

  // 5. Yuva Internship / Apprenticeship
  else if (text.includes('yuva karya') || text.includes('internship') || text.includes('apprenticeship') || text.includes('maps')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 60000;
    financialBenefitText = financialBenefitText || '₹6,000 to ₹10,000 / Month Stipend';
    if (benefits.length === 0) {
      benefits = [
        '12th Pass: ₹6,000/month government stipend',
        'ITI / Diploma: ₹8,000/month government stipend',
        'Graduate / Post Graduate: ₹10,000/month government stipend',
        '6 months certified real-world industrial and corporate training'
      ];
    }
  }

  // 6. EBC / Rajarshi Shahu Maharaj Scholarship
  else if (text.includes('shahu maharaj') || text.includes('shikshan shulkh') || text.includes('ebc')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 45000;
    financialBenefitText = financialBenefitText || '50% Tuition & Exam Fee Waiver on MahaDBT';
    if (benefits.length === 0) {
      benefits = [
        '50% reimbursement of tuition fees and exam fees in government & private unaided colleges',
        'Covers Engineering, Medical, Pharmacy, MBA, Architecture, Law, and Polytechnic courses'
      ];
    }
  }

  // 7. SC/ST Swadhar & Swayam Hostel Schemes
  else if (text.includes('swadhar') || text.includes('swayam yojana') || text.includes('hostel allowance') || text.includes('panjabrao deshmukh')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 51000;
    financialBenefitText = financialBenefitText || '₹51,000 - ₹60,000 / Year Direct Hostel DBT';
    if (benefits.length === 0) {
      benefits = [
        'Direct cash allowance for accommodation, food, and academic expenses',
        'Paid directly to students not getting government hostel seats in urban centers'
      ];
    }
  }

  // 8. Lek Ladki / Girl Child Empowerment
  else if (text.includes('lek ladki') || text.includes('sukanya')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 101000;
    financialBenefitText = financialBenefitText || '₹1,01,000 Total Financial Assistance in Stages';
    if (benefits.length === 0) {
      benefits = [
        '₹5,000 at birth, ₹6,000 in 1st standard, ₹7,000 in 6th, ₹8,000 in 11th',
        'Lump sum ₹75,000 on completing 18 years of age and 12th standard'
      ];
    }
  }

  // 9. Housing / Gharkul (Ramai / Shabari / Modi Awas / PMAY)
  else if (text.includes('gharkul') || text.includes('awas') || text.includes('housing') || text.includes('ramai') || text.includes('shabari')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 120000;
    financialBenefitText = financialBenefitText || '₹1,20,000 - ₹2,50,000 Housing Construction Subsidy';
    if (benefits.length === 0) {
      benefits = [
        'Direct financial grant to construct a permanent pucca house with toilet facility',
        'Disbursed in 4 geo-tagged construction stages directly into bank account'
      ];
    }
  }

  // 10. Solar Agricultural Pumps (PM-KUSUM / Magel Tyala Saur Krishi Pump)
  else if (text.includes('solar pump') || text.includes('saur krishi') || text.includes('kusum')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 150000;
    financialBenefitText = financialBenefitText || '90% - 95% Government Subsidy on Solar Pump';
    if (benefits.length === 0) {
      benefits = [
        '90% to 95% subsidy for 3 HP, 5 HP, or 7.5 HP AC/DC solar agricultural water pumps',
        'Uninterrupted daytime solar power for farm irrigation'
      ];
    }
  }

  // 11. Farm Ponds / Magel Tyala Shet-tale
  else if (text.includes('shet-tale') || text.includes('shet tale') || text.includes('farm pond')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 50000;
    financialBenefitText = financialBenefitText || '₹50,000 Direct Subsidy for Farm Pond';
    if (benefits.length === 0) {
      benefits = [
        'Direct cash subsidy of up to ₹50,000 for digging plastic-lined farm ponds',
        'Ensures water storage for protective irrigation during drought periods'
      ];
    }
  }

  // 12. Senior Citizen / Destitute Pensions (Shravanbal / Sanjay Gandhi Niradhar)
  else if (text.includes('shravanbal') || text.includes('sanjay gandhi') || text.includes('niradhar') || text.includes('pension')) {
    estimatedBenefitAmount = estimatedBenefitAmount || 18000;
    financialBenefitText = financialBenefitText || '₹1,500 / Month Direct Social Security Pension';
    if (benefits.length === 0) {
      benefits = [
        'Monthly pension of ₹1,500 directly transferred to bank account',
        'Provides financial independence and dignifies elderly and destitute citizens'
      ];
    }
  }

  // Fallback
  if (!financialBenefitText) {
    if (estimatedBenefitAmount > 0) {
      financialBenefitText = `₹${estimatedBenefitAmount.toLocaleString('en-IN')} Welfare Benefit`;
    } else {
      estimatedBenefitAmount = 10000;
      financialBenefitText = 'Government Welfare Subsidy & Support';
    }
  }

  if (benefits.length === 0) {
    benefits = [
      'Direct government welfare benefit transfer (DBT)',
      'Official Maharashtra / Union government program support',
      'Citizen empowerment and financial assistance'
    ];
  }

  return {
    benefits,
    estimatedBenefitAmount,
    financialBenefitText
  };
}
