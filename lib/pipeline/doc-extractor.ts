import { RawSchemeInput } from './validator';

/**
 * Extracts comprehensive, department-accurate document checklists for Indian welfare schemes.
 * Puts scheme-specific, unique eligibility documents FIRST so that summaries and tables
 * immediately highlight the critical proofs required.
 */
export function extractRequiredDocuments(scheme: RawSchemeInput): string[] {
  // If scheme already has curated documents with more than 3 specific items, preserve them
  if (scheme.requiredDocuments && scheme.requiredDocuments.length >= 4) {
    return scheme.requiredDocuments;
  }

  const text = `${scheme.title || ''} ${scheme.description || ''} ${scheme.category || ''} ${scheme.department || ''}`.toLowerCase();
  const specificDocs: string[] = [];

  const isMaharashtra = (scheme.state || 'Maharashtra').toLowerCase().includes('maharashtra');

  // 1. Business, Employment, Loan & Subsidy Schemes (PMEGP, Mudra, CMEEGP, Startup, Annasaheb Patil)
  if (
    text.includes('pmegp') || text.includes('mudra') || text.includes('loan') || 
    text.includes('annasaheb patil') || text.includes('cmeegp') || text.includes('enterprise') || 
    text.includes('business') || text.includes('startup') || text.includes('entrepreneur') ||
    text.includes('seed capital') || text.includes('margin money')
  ) {
    specificDocs.push('Detailed Project Report (DPR) & Machinery Quotation');
    specificDocs.push('PAN Card of the Applicant');
    specificDocs.push('EDP (Entrepreneurship Development) Training Certificate');
    specificDocs.push('Rural Area Certificate from Gram Panchayat / BDO');
    if (text.includes('sc') || text.includes('st') || text.includes('obc') || text.includes('minority') || text.includes('women')) {
      specificDocs.push('Caste / Special Category Certificate (for 25%-35% subsidy)');
    }
    specificDocs.push('Highest Educational Qualification Certificate (8th/10th Pass)');
  }
  // 2. Housing Schemes (PMAY-G, PMAY-U, Ramai, Shabari, Modi Awas, Gharkul)
  else if (
    text.includes('awas') || text.includes('housing') || text.includes('gharkul') || 
    text.includes('pmay') || text.includes('ramai') || text.includes('shabari') || text.includes('shelter')
  ) {
    specificDocs.push('Gram Panchayat Namuna 8 / Property Tax Assessment');
    specificDocs.push('PMAY-G / Awaas+ Beneficiary ID or SECC 2011 Survey Proof');
    specificDocs.push('Affidavit confirming no existing pucca house in India');
    specificDocs.push('Geo-tagged Photograph of the existing kutcha house');
    specificDocs.push('Job Card / MGNREGA Registration Number');
  }
  // 3. Agriculture, Farmers & Irrigation Subsidies (PM-KISAN, Namo Shetkari, Solar Pump, Magel Tyala)
  else if (
    text.includes('farmer') || text.includes('krishi') || text.includes('kisan') || 
    text.includes('shetkari') || text.includes('irrigation') || text.includes('tractor') || 
    text.includes('solar pump') || text.includes('farm pond') || text.includes('baliraja') ||
    text.includes('magel tyala') || text.includes('drip') || text.includes('pik vima')
  ) {
    specificDocs.push('7/12 Land Ownership Record (Satbara) & 8-A Extract');
    specificDocs.push('Crop Sowing Digital Declaration (Mobile E-Pik Pahani)');
    specificDocs.push('Aadhaar e-KYC Verification on PM-KISAN / MahaDBT Portal');
    if (text.includes('solar') || text.includes('pump') || text.includes('electricity') || text.includes('tractor')) {
      specificDocs.push('Electricity Consumer Bill of Agri Meter (or NOC)');
      specificDocs.push('Consent Letter from Land Co-owners');
    }
  }
  // 4. Higher Education, Scholarships & Hostels (MahaDBT, DHE, DTE, DMER, Swadhar, Swayam, EBC)
  else if (
    text.includes('scholarship') || text.includes('freeship') || text.includes('education') || 
    text.includes('student') || text.includes('fellowship') || text.includes('dhe') || 
    text.includes('dte') || text.includes('dmer') || text.includes('tuition') || text.includes('hostel') ||
    text.includes('swadhar') || text.includes('swayam') || text.includes('bhatta') || text.includes('ebc')
  ) {
    if (text.includes('hostel') || text.includes('vastigruh') || text.includes('swadhar') || text.includes('bhatta')) {
      specificDocs.push('Hostel Admission Letter & Registered Rent Agreement');
    }
    if (text.includes('sc') || text.includes('st') || text.includes('vjnt') || text.includes('obc') || text.includes('sbc')) {
      specificDocs.push('Caste Certificate & Caste Validity (SDO Scrutiny)');
    }
    if (text.includes('obc') || text.includes('vjnt') || text.includes('sbc') || text.includes('ebc')) {
      specificDocs.push('Valid Non-Creamy Layer (NCL) Certificate');
    }
    specificDocs.push('Family Annual Income Certificate (Issued by Tehsildar)');
    specificDocs.push('Centralized Admission Process (CAP) Allotment Letter');
    specificDocs.push('Previous Year Passed Marksheet & College Fee Receipt');
  }
  // 5. Women & Child Welfare (Majhi Ladki Bahin, Lek Ladki, Annapurna, Matru Vandana)
  else if (
    text.includes('ladki bahin') || text.includes('lek ladki') || text.includes('women') || 
    text.includes('mahila') || text.includes('kanya') || text.includes('annapurna') || text.includes('pmmvy')
  ) {
    if (text.includes('annapurna') || text.includes('lpg') || text.includes('cylinder') || text.includes('ujjwala')) {
      specificDocs.push('Domestic LPG Gas Consumer Passbook (IOCL / BPCL / HPCL)');
    }
    if (text.includes('lek ladki') || text.includes('child') || text.includes('pmmvy') || text.includes('birth')) {
      specificDocs.push('Child Birth Certificate & MCP Immunization Card');
    }
    specificDocs.push('Family Ration Card (Yellow / Orange / Antyodaya)');
    specificDocs.push('Income Certificate (Family income < ₹2.5L) or Ration Card');
    specificDocs.push('Applicant Signed Self-Declaration (Hamipatra)');
  }
  // 6. Health & Cashless Hospitalization (Ayushman Bharat PM-JAY, MJPJAY Universal)
  else if (
    text.includes('health') || text.includes('swasthya') || text.includes('jan arogya') || 
    text.includes('ayushman') || text.includes('mjpjay') || text.includes('medical') || text.includes('hospital')
  ) {
    specificDocs.push('Ration Card (Yellow, Orange, or White Ration Card)');
    specificDocs.push('Ayushman Card / Golden Card (via e-KYC)');
    specificDocs.push('Doctor Referral Slip & Diagnostic Report from Empanelled Hospital');
  }
  // 7. Livelihood, Rural Development & SHG (Deendayal Antyodaya, DAY-NRLM, Umed)
  else if (
    text.includes('antyodaya') || text.includes('livelihood') || text.includes('nrlm') || 
    text.includes('nulm') || text.includes('umed') || text.includes('shg') || text.includes('bpl')
  ) {
    specificDocs.push('Self-Help Group (SHG) Passbook & Resolution Letter');
    specificDocs.push('Antyodaya / BPL / SECC Deprivation Certificate');
    specificDocs.push('Skill Training Enrollment Form / DDU-GKY Certificate');
  }
  // 8. Minority Community Welfare (PMJVK, Maulana Azad, Minority Development)
  else if (
    text.includes('minority') || text.includes('jan vikas') || text.includes('pmjvk') || 
    text.includes('alpankhyak') || text.includes('maulana azad')
  ) {
    specificDocs.push('Minority Community Self-Declaration (Muslim/Christian/Sikh/Buddhist/Jain)');
    specificDocs.push('Residence Certificate in Minority Concentration Block');
    specificDocs.push('Family Annual Income Certificate (Tehsildar)');
  }
  // 9. Unorganized & Construction Workers (BOCW, Bandhkam Kamgar, Shramik, E-Shram)
  else if (
    text.includes('bocw') || text.includes('bandhkam') || text.includes('construction worker') || 
    text.includes('shramik') || text.includes('e-shram') || text.includes('labor') || text.includes('labour')
  ) {
    specificDocs.push('Maharashtra BOCW Registration Smart Card / Certificate');
    specificDocs.push('90 Days Minimum Work Certificate from registered Builder/Contractor');
    specificDocs.push('E-Shram UAN Card');
  }
  // 10. Senior Citizens & Social Security Pensions (Sanjay Gandhi Niradhar, Shravanbal, Vayoshree)
  else if (
    text.includes('senior citizen') || text.includes('shravanbal') || text.includes('vayoshree') || 
    text.includes('pension') || text.includes('niradhar') || text.includes('destitute') || text.includes('old age')
  ) {
    specificDocs.push('Age Proof Certificate (Birth Certificate / School Leaving / Voter ID)');
    specificDocs.push('Tehsildar Income Certificate (Family income within limit)');
    specificDocs.push('Destitution Affidavit or Medical Disability Certificate');
  }
  // 11. Persons with Disabilities (Divyang, UDID, Assistive Aids)
  else if (
    text.includes('disability') || text.includes('divyang') || text.includes('handicapped') || 
    text.includes('pwd') || text.includes('assistive')
  ) {
    specificDocs.push('Unique Disability ID (UDID Card) or 40%+ Civil Surgeon Certificate');
    specificDocs.push('Family Income Certificate (Tehsildar / SDO)');
  }
  else {
    specificDocs.push('Family Annual Income Certificate (Tehsildar / SDO)');
    specificDocs.push('Recent Passport-Sized Photographs');
  }

  // Base Identity & DBT verification documents (appended after specific proofs)
  const baseDocs: string[] = [
    'Aadhaar Card (Identity & Proof of Address)',
    'Bank Account Passbook (Linked to Aadhaar & NPCI for Direct DBT)'
  ];

  if (isMaharashtra && !specificDocs.some(d => d.includes('Domicile'))) {
    baseDocs.push('Maharashtra State Domicile Certificate (15-Yr Residence Proof)');
  }

  return Array.from(new Set([...specificDocs, ...baseDocs]));
}
