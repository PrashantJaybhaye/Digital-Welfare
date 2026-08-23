import { RawSchemeInput } from './validator';

export function extractRequiredDocuments(scheme: RawSchemeInput): string[] {
  if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
    return scheme.requiredDocuments;
  }

  const text = `${scheme.title || ''} ${scheme.description || ''} ${scheme.category || ''}`.toLowerCase();
  const docs: string[] = [
    'Aadhaar Card (Identity & Proof of Address)',
    'Bank Account Passbook (Linked to Aadhaar & NPCI for Direct DBT)'
  ];

  if ((scheme.state || 'Maharashtra').toLowerCase().includes('maharashtra')) {
    docs.push('Maharashtra State Domicile Certificate (or Ration Card proving 15-year residence)');
  }

  if (
    text.includes('farmer') || text.includes('krishi') || text.includes('kisan') || 
    text.includes('shetkari') || text.includes('irrigation') || text.includes('tractor') || 
    text.includes('solar pump') || text.includes('farm pond')
  ) {
    docs.push('7/12 Land Ownership Record (Satbara Utara) & 8-A Extract');
    docs.push('Aadhaar e-KYC Verification on MahaDBT / PM-KISAN Portal');
    docs.push('Crop Sowing Self-Declaration (E-Pik Pahani)');
  } else if (
    text.includes('scholarship') || text.includes('freeship') || text.includes('education') || 
    text.includes('student') || text.includes('fellowship') || text.includes('dhe') || 
    text.includes('dte') || text.includes('dmer')
  ) {
    docs.push('Previous Academic Year Passed Marksheet / Degree Certificate');
    docs.push('Current Year College Fee Receipt & Bonafide Certificate');
    docs.push('Centralized Admission Process (CAP) Allotment Letter');
    docs.push('Family Annual Income Certificate (Issued by Tehsildar)');
    if (text.includes('sc') || text.includes('st') || text.includes('vjnt') || text.includes('obc') || text.includes('sbc')) {
      docs.push('Caste Certificate & Caste Validity Certificate (Sub-Divisional Officer)');
    }
    if (text.includes('obc') || text.includes('vjnt') || text.includes('sbc')) {
      docs.push('Valid Non-Creamy Layer (NCL) Certificate');
    }
  } else if (text.includes('ladki bahin') || text.includes('lek ladki') || text.includes('women') || text.includes('mahila')) {
    docs.push('Family Ration Card (Yellow / Orange / Antyodaya)');
    docs.push('Income Certificate (Family annual income up to ₹2.5 Lakh) or Yellow/Orange Ration Card');
    docs.push('Applicant Self-Declaration (Hamipatra)');
    if (text.includes('annapurna') || text.includes('lpg') || text.includes('cylinder')) {
      docs.push('Domestic LPG Gas Consumer Passbook (IOCL / BPCL / HPCL)');
    }
  } else if (text.includes('health') || text.includes('swasthya') || text.includes('jan arogya') || text.includes('ayushman') || text.includes('mjpjay')) {
    docs.push('Ration Card (Yellow, Orange, or White Ration Card)');
    docs.push('Ayushman Bharat / MJPJAY Health Card');
    docs.push('Treating Doctor Referral / Diagnostic Reports');
  } else if (text.includes('internship') || text.includes('yuva karya') || text.includes('mahaswayam') || text.includes('maps') || text.includes('employment')) {
    docs.push('Educational Qualification Certificates (12th / ITI / Diploma / Degree)');
    docs.push('MahaSwayam Employment Registration Number (rojgar.mahaswayam.gov.in)');
    docs.push('Passport Sized Photographs');
  } else if (text.includes('housing') || text.includes('awas') || text.includes('gharkul')) {
    docs.push('Gram Panchayat / Municipal Property Assessment (Namuna 8 / Property Tax Receipt)');
    docs.push('BPL / SECC 2011 Survey Inclusion Proof');
    docs.push('Affidavit confirming no existing pucca house in India');
  } else if (text.includes('disability') || text.includes('divyang') || text.includes('handicapped') || text.includes('pwd')) {
    docs.push('Unique Disability ID (UDID Card) or Civil Surgeon Disability Certificate (40%+ disability)');
    docs.push('Income Certificate');
  } else if (text.includes('senior citizen') || text.includes('shravanbal') || text.includes('vayoshree') || text.includes('pension')) {
    docs.push('Age Proof Certificate (Birth Certificate / School Leaving / Voter ID)');
    docs.push('Income Certificate issued by Tehsildar (Family income up to ₹21,000 to ₹50,000/yr)');
    docs.push('Medical Fitness Certificate (for assistive aid)');
  } else {
    docs.push('Income Certificate from Competent Authority (Tehsildar / SDO)');
    docs.push('Recent Passport-Sized Photographs');
  }

  return Array.from(new Set(docs));
}
