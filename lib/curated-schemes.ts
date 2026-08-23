import { Scheme } from '@/types/scheme';

export const CURATED_SCHEMES: Scheme[] = [
  // =========================================================================
  // MAHARASHTRA STATE WELFARE & MAHADBT FLAGSHIP SCHEMES
  // =========================================================================
  {
    title: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    description: 'Flagship financial empowerment scheme by the Government of Maharashtra providing direct monthly financial assistance of ₹1,500 to women aged 21 to 65 years.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 21,
    maxAge: 65,
    maxIncome: 250000,
    targetGender: 'Female',
    targetOccupation: 'All Citizens',
    financialBenefitText: '₹1,500 / Month Direct Bank Transfer (DBT)',
    benefits: [
      '₹1,500 direct monthly transfer into Aadhaar-linked bank account',
      'Eligibility for 3 free LPG gas cylinders per year under Annapurna Yojana',
      'Economic independence and nutritional security for women'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Maharashtra Domicile Certificate or Ration Card (issued before 15 years)',
      'Income Certificate (Annual family income up to ₹2.5 Lakh) or Yellow/Orange Ration Card',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Self-Declaration (Hamipatra)'
    ],
    stepsToApply: [
      'Download the Nari Shakti Doot App or visit the official Ladki Bahin portal',
      'Register with mobile number and verify via OTP',
      'Fill in applicant details, Aadhaar number, and upload bank passbook',
      'Submit the Hamipatra declaration and note the Application Reference Number'
    ],
    applyLink: 'https://ladakibahin.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mukhyamantri Yuva Karya Prashikshan Yojana (CM Youth Internship)',
    description: 'Comprehensive youth skill internship scheme in Maharashtra offering 6 months on-the-job industrial apprenticeship with monthly government stipends up to ₹10,000.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: 35,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Unemployed',
    financialBenefitText: '₹6,000 to ₹10,000 / Month Stipend',
    benefits: [
      '12th Pass: ₹6,000/month government stipend',
      'ITI / Diploma: ₹8,000/month government stipend',
      'Graduate / Post Graduate: ₹10,000/month government stipend',
      '6 months certified real-world industrial and corporate training'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Maharashtra Domicile Certificate',
      'Educational Qualification Marksheets & Degree Certificates',
      'Aadhaar-Linked Bank Account Passbook',
      'Employment Exchange Registration Number (Mahaswayam)'
    ],
    stepsToApply: [
      'Register on the Mahaswayam official portal (mahaswayam.gov.in)',
      'Create job seeker profile and upload educational documents',
      'Apply to participating industrial establishments and private/public employers',
      'Upon selection, stipend is directly credited via DBT on a monthly basis'
    ],
    applyLink: 'https://rojgar.mahaswayam.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Namo Shetkari Maha Samman Nidhi Yojana',
    description: 'Maharashtra state government farmer income support providing ₹6,000 annually in three installments of ₹2,000, combined with PM-KISAN for total ₹12,000/year assistance.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Farmer',
    financialBenefitText: '₹6,000 / Year (Total ₹12,000 with PM-KISAN)',
    benefits: [
      '₹6,000 per year direct cash assistance in 3 equal installments of ₹2,000',
      '100% supplementary addition over Central PM-KISAN benefit',
      'Direct DBT credit to bank accounts without middlemen'
    ],
    requiredDocuments: [
      'Aadhaar Card with e-KYC completed',
      '7/12 Land Record (Satbara Utara) & 8-A Extract',
      'Bank Account Passbook linked with NPCI/Aadhaar',
      'Active PM-KISAN Beneficiary Registration ID'
    ],
    stepsToApply: [
      'All active PM-KISAN approved beneficiaries in Maharashtra are automatically enrolled',
      'Complete Land-Seeding and Aadhaar e-KYC at your local CSC or MahaOnline center',
      'Check beneficiary payment status on mahadbt.maharashtra.gov.in'
    ],
    applyLink: 'https://mahadbt.maharashtra.gov.in/Farmer',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mukhyamantri Annapurna Yojana',
    description: 'Free LPG refill initiative providing 3 free domestic cooking gas cylinders per year to eligible female beneficiaries of Ladki Bahin Yojana and PM Ujjwala Yojana in Maharashtra.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 21,
    maxAge: 65,
    maxIncome: 250000,
    targetGender: 'Female',
    targetOccupation: 'All Citizens',
    financialBenefitText: '3 Free LPG Gas Cylinders / Year (Direct Subsidy Refund)',
    benefits: [
      'Subsidy equivalent to 3 domestic LPG cylinders directly deposited into bank account',
      'Free clean cooking fuel for low-income households across rural and urban Maharashtra'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'LPG Gas Consumer Number & Oil Company Passbook (IOCL/BPCL/HPCL)',
      'Approved Ladki Bahin Yojana ID or PM Ujjwala Yojana Consumer ID',
      'Ration Card copy'
    ],
    stepsToApply: [
      'Book your standard LPG cylinder through your gas distributor (HP, Indane, BharatGas)',
      'Pay standard delivery invoice',
      'Subsidy amount is automatically refunded to your Aadhaar-seeded bank account within 48 hours'
    ],
    applyLink: 'https://mahafood.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mukhyamantri Baliraja Vij Savlat Yojana',
    description: '100% electricity bill waiver for agricultural water pumps up to 7.5 Horsepower (HP) for all farmers across Maharashtra for 5 consecutive years.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Farmer',
    financialBenefitText: '100% Free Electricity for Farm Pumps up to 7.5 HP',
    benefits: [
      'Complete waiver of agricultural electricity power bills',
      'Zero cost power for irrigation water pumps up to 7.5 HP capacity',
      'Direct relief from pending agricultural electricity arrears'
    ],
    requiredDocuments: [
      'MSEDCL (Mahavitaran) Consumer Number',
      '7/12 Land Record showing agricultural land ownership',
      'Aadhaar Card'
    ],
    stepsToApply: [
      'Benefit is automatically applied by MSEDCL for all eligible agricultural meters up to 7.5 HP',
      'Verify status on Mahavitaran portal (mahadiscom.in) by entering consumer number'
    ],
    applyLink: 'https://www.mahadiscom.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    description: 'Maharashtra universal state health insurance scheme providing up to ₹5,00,000 per family per year for secondary and tertiary cashless medical treatments in over 1,000 empanelled hospitals.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: null,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    financialBenefitText: '₹5,00,000 / Year Free Cashless Hospital Cover',
    benefits: [
      '₹5 Lakh cashless hospital treatment coverage per family per year',
      'Covers 1,356 medical and surgical procedures across 30+ specialty categories',
      'Covers pre-existing illnesses, ICU charges, medicines, diagnostics, and post-discharge care'
    ],
    requiredDocuments: [
      'Ration Card (Yellow, Orange, or White Ration Card)',
      'Aadhaar Card or Voter ID card of the patient',
      'Ayushman Card / MJPJAY Health Card'
    ],
    stepsToApply: [
      'Visit any empanelled government or private network hospital in Maharashtra',
      'Approach the Aarogyamitra help desk with Ration Card and Aadhaar Card',
      'Aarogyamitra facilitates cashless pre-authorization and admission immediately'
    ],
    applyLink: 'https://www.jeevandayee.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
    description: 'Higher education tuition and examination fee concession scheme on MahaDBT offering 50% fee reimbursement for Economically Backward Class (EBC) students in professional courses.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 17,
    maxAge: 30,
    maxIncome: 800000,
    targetGender: 'Any',
    targetOccupation: 'Student',
    financialBenefitText: '50% Tuition & Exam Fee Waiver on MahaDBT',
    benefits: [
      '50% reimbursement of tuition fees and exam fees in government & private unaided colleges',
      'Covers Engineering, Medical, Pharmacy, MBA, Architecture, Law, and Polytechnic courses'
    ],
    requiredDocuments: [
      'Maharashtra Domicile Certificate',
      'Income Certificate issued by Tehsildar (Family income ≤ ₹8 Lakh)',
      'CAP Allotment Letter (Centralized Admission Process)',
      'Aadhaar Card & Bank Account details',
      'Previous year passed marksheets'
    ],
    stepsToApply: [
      'Log in to MahaDBT portal (mahadbt.maharashtra.gov.in)',
      'Select Directorate of Higher Education (DHE) or Technical Education (DTE)',
      'Fill in applicant profile and upload required certificates',
      'Submit form before the annual deadline and verify college forwarding status'
    ],
    applyLink: 'https://mahadbt.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Post-Matric Scholarship for SC/ST/VJNT/OBC/SBC Students (MahaDBT)',
    description: 'Comprehensive 100% tuition and exam fee scholarship with monthly maintenance allowance for reserved category students in diploma, degree, and postgraduate courses.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 16,
    maxAge: 35,
    maxIncome: 250000,
    targetGender: 'Any',
    targetOccupation: 'Student',
    financialBenefitText: '100% Tuition Fee Waiver + Monthly Maintenance Allowance',
    benefits: [
      '100% government fee reimbursement for SC/ST students (and tuition concessions for OBC/VJNT/SBC)',
      'Monthly hostel and day-scholar maintenance allowance paid directly via DBT'
    ],
    requiredDocuments: [
      'Caste Certificate & Caste Validity Certificate',
      'Income Certificate from competent authority',
      'Domicile Certificate of Maharashtra',
      'College Fee Receipt & Bonafide Certificate',
      'Aadhaar Seeded Bank Account Details'
    ],
    stepsToApply: [
      'Register on MahaDBT portal using Aadhaar authentication',
      'Navigate to Social Justice and Special Assistance / Tribal Development Department',
      'Submit scholarship application with fee structure receipts',
      'Scholarship disbursed directly to college and student accounts upon verification'
    ],
    applyLink: 'https://mahadbt.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna',
    description: 'Hostel maintenance allowance for children of registered marginal farmers and registered agricultural laborers pursuing higher professional education in Maharashtra.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 17,
    maxAge: 28,
    maxIncome: 800000,
    targetGender: 'Any',
    targetOccupation: 'Student',
    financialBenefitText: '₹20,000 to ₹30,000 / Year Hostel Allowance',
    benefits: [
      '₹30,000 per academic year for students studying in MMRDA / Pune / Nagpur / Municipal Corporation areas',
      '₹20,000 per academic year for other district areas',
      'Direct monthly DBT support to cover boarding and meal expenses'
    ],
    requiredDocuments: [
      '7/12 Land Record or Agricultural Laborer Certificate of parent',
      'Hostel Admission Receipt / Rent Agreement',
      'Family Income Certificate (up to ₹8 Lakh)',
      'Aadhaar Card and Domicile Certificate'
    ],
    stepsToApply: [
      'Apply via MahaDBT portal under Directorate of Technical Education / Higher Education',
      'Upload hostel confirmation and parent farmer certification',
      'Funds credited in installments directly to student bank account'
    ],
    applyLink: 'https://mahadbt.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Sanjay Gandhi Niradhar Anudan Yojana',
    description: 'Maharashtra state pension for destitutes, widows, persons with severe disabilities, orphans, and persons suffering from major illnesses.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: 65,
    maxIncome: 21000,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    financialBenefitText: '₹1,500 / Month Direct Pension',
    benefits: [
      '₹1,500 monthly pension for single beneficiary (₹2,400 for families with 2 or more beneficiaries)',
      'Provides basic social security and dignity for destitute citizens'
    ],
    requiredDocuments: [
      'Age Proof (Birth Certificate / School Leaving / Voter ID)',
      'Income Certificate (Annual income up to ₹21,000) from Tehsildar',
      'Domicile Certificate showing 15 years residence in Maharashtra',
      'Disability / Medical Certificate (for divyang or terminally ill applicants)',
      'Death Certificate of husband (for widows)'
    ],
    stepsToApply: [
      'Obtain application form from local Taluka Tehsildar / Collector office or Aaple Sarkar portal',
      'Submit duly filled form with medical/income proofs to the Naib Tehsildar Sanjay Gandhi Department',
      'Sanction committee approves application and starts monthly DBT credit'
    ],
    applyLink: 'https://aaplesarkar.mahaonline.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Shravanbal Seva Rajya Nivruttivetan Yojana',
    description: 'Old age financial pension for elderly senior citizens aged 65 years and above residing in Maharashtra from BPL and destitute backgrounds.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 65,
    maxAge: null,
    maxIncome: 21000,
    targetGender: 'Any',
    targetOccupation: 'Senior Citizen',
    financialBenefitText: '₹1,500 / Month Senior Citizen Pension',
    benefits: [
      '₹1,500 monthly pension for senior citizens above 65 years',
      'Guaranteed monthly livelihood assistance via direct bank transfer'
    ],
    requiredDocuments: [
      'Age proof proving age 65 years or above',
      'BPL Ration Card or Tehsildar Income Certificate (≤ ₹21,000/year)',
      'Maharashtra 15-year Domicile Certificate',
      'Aadhaar Card and Bank Account Passbook'
    ],
    stepsToApply: [
      'Apply online on Aaple Sarkar portal (aaplesarkar.mahaonline.gov.in) or at Setu Kendra',
      'Attach age proof and income documents',
      'Tehsildar committee sanctions pension directly to bank account'
    ],
    applyLink: 'https://aaplesarkar.mahaonline.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Babasaheb Ambedkar Swadhar Yojana (Social Welfare)',
    description: 'Financial assistance of ₹51,000 to ₹60,000 per year for Scheduled Caste (SC) and Neo-Buddhist students pursuing higher education who could not get government hostel admission.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 16,
    maxAge: 30,
    maxIncome: 250000,
    targetGender: 'Any',
    targetOccupation: 'Student',
    financialBenefitText: '₹51,000 to ₹60,000 / Year Accommodation & Food Grant',
    benefits: [
      '₹60,000/year for students in Mumbai, Pune, Nagpur',
      '₹51,000/year for students in other municipal corporation areas',
      'Direct assistance for meal, hostel rent, and academic stationery'
    ],
    requiredDocuments: [
      'Caste Certificate (SC / Neo-Buddhist)',
      'Income Certificate (≤ ₹2.5 Lakh/year)',
      'Government Hostel Rejection / Non-allotment Letter',
      'Admission Proof in recognized college',
      'Aadhaar-linked Bank Account'
    ],
    stepsToApply: [
      'Apply through the Social Welfare Commissionerate portal (sjsa.maharashtra.gov.in)',
      'Upload verified rent receipts and college bonafide',
      'Financial allowance is directly credited to student account in 2 installments'
    ],
    applyLink: 'https://sjsa.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mukhyamantri Saur Krushi Pump Yojana (Maharashtra Solar Pumps)',
    description: 'Maharashtra state initiative providing up to 90% to 95% capital subsidy for installing 3 HP, 5 HP, and 7.5 HP off-grid solar agricultural water pumps for irrigation.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Farmer',
    financialBenefitText: '90% to 95% Subsidy on Solar Agriculture Pumps',
    benefits: [
      '95% subsidy for SC/ST farmers (farmer pays only 5% beneficiary contribution)',
      '90% subsidy for General category farmers (farmer pays 10%)',
      'Reliable daytime electricity for farm irrigation with zero monthly power bills'
    ],
    requiredDocuments: [
      '7/12 and 8-A Land Records',
      'Aadhaar Card',
      'Caste Certificate (if SC/ST)',
      'Proof of verified water source (Well / Borewell / Farm Pond)'
    ],
    stepsToApply: [
      'Apply online on the official Mahavitaran Solar Pump portal (mahadiscom.in/solar)',
      'Upload 7/12 copy, water availability certificate, and pay nominal registration fee',
      'Agency visits farm, conducts survey, and completes turnkey solar installation'
    ],
    applyLink: 'https://www.mahadiscom.in/solar',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mukhyamantri Rojgar Nirmiti Karyakram (CMEGP Maharashtra)',
    description: 'Maharashtra state self-employment flagship offering up to ₹50 Lakh project loans with 15% to 35% government capital subsidy for micro and small enterprise startups.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 18,
    maxAge: 45,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Business',
    financialBenefitText: '15% to 35% Capital Subsidy on Loans up to ₹50 Lakh',
    benefits: [
      'Manufacturing projects: Loans up to ₹50 Lakh',
      'Service / Agro-allied projects: Loans up to ₹20 Lakh',
      '15% to 35% financial subsidy on total project cost (higher subsidy for women/SC/ST/Rural)'
    ],
    requiredDocuments: [
      'Detailed Project Report (DPR)',
      'Aadhaar Card & PAN Card',
      'Maharashtra Domicile Certificate',
      'Educational Qualification / Skill Training Certificate',
      'Caste Certificate (if applicable)'
    ],
    stepsToApply: [
      'Register on CMEGP official portal (maha-cmegp.gov.in)',
      'Submit Detailed Project Report and select preferred lending bank',
      'District Task Force Committee reviews proposal and forwards to bank for sanction'
    ],
    applyLink: 'https://maha-cmegp.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Lek Ladki Yojana (Maharashtra)',
    description: 'Financial assistance scheme providing ₹1,01,000 in total staggered financial aid from birth until the girl child attains 18 years of age for low-income families in Maharashtra.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: 0,
    maxAge: 18,
    maxIncome: 100000,
    targetGender: 'Female',
    targetOccupation: 'Student',
    financialBenefitText: '₹1,01,000 Total Financial Aid in Staged Cash Grants',
    benefits: [
      '₹5,000 cash grant upon birth of girl child',
      '₹6,000 when enrolled in 1st Standard',
      '₹7,000 when enrolled in 6th Standard',
      '₹8,000 when enrolled in 11th Standard',
      '₹75,000 final lump sum upon completing 18 years of age and passing 12th'
    ],
    requiredDocuments: [
      'Birth Certificate of girl child',
      'Yellow or Orange Ration Card of family',
      'Income Certificate (≤ ₹1 Lakh/year)',
      'Mother and Father Aadhaar Cards',
      'School Bonafide Certificate'
    ],
    stepsToApply: [
      'Apply through local Anganwadi Worker or Gram Panchayat / Child Development Project Officer (CDPO)',
      'Submit birth registration and family ration card copies',
      'DBT deposits are credited at each educational milestone directly to the girl account'
    ],
    applyLink: 'https://womenchild.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Mahila Sanman Yojana (MSRTC 50% Concession)',
    description: '50% bus fare concession across all standard and express bus services operated by the Maharashtra State Road Transport Corporation (MSRTC) for all female passengers.',
    category: 'MahaDBT (Maharashtra)',
    state: 'Maharashtra',
    minAge: null,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Female',
    targetOccupation: 'All Citizens',
    financialBenefitText: '50% Bus Ticket Fare Discount on MSRTC Buses',
    benefits: [
      'Direct 50% discount on all ordinary, semi-luxury, and express ST bus tickets across Maharashtra',
      'Universal benefit available to every woman traveling within state boundaries'
    ],
    requiredDocuments: [
      'Valid Government Photo ID (Aadhaar Card / Voter ID / Driving License) for identity verification'
    ],
    stepsToApply: [
      'Instant automatic discount applied at ticket booking counter or via bus conductor upon presenting ID'
    ],
    applyLink: 'https://msrtc.maharashtra.gov.in',
    lastSyncedAt: new Date().toISOString()
  },

  // =========================================================================
  // CENTRAL GOVERNMENT FLAGSHIP DIRECT BENEFIT SCHEMES
  // =========================================================================
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'Central Sector income support scheme providing ₹6,000 per year in three equal quarterly installments of ₹2,000 to all landholding farmer families across India.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Farmer',
    financialBenefitText: '₹6,000 / Year Direct Benefit Transfer (DBT)',
    benefits: [
      '₹6,000 annual income support transferred directly to bank account in 3 installments',
      'Assistance to purchase agricultural inputs, seeds, fertilizers, and equipment'
    ],
    requiredDocuments: [
      'Aadhaar Card with mobile linkage for e-KYC',
      'Land Ownership Documents (Khata / Khasra / 7/12 record)',
      'Bank Account details (NPCI Aadhaar Seeded)'
    ],
    stepsToApply: [
      'Visit pmkisan.gov.in and click on "New Farmer Registration"',
      'Enter Aadhaar number, state, land record details, and bank account number',
      'Complete biometric or OTP e-KYC at CSC center or online portal'
    ],
    applyLink: 'https://pmkisan.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    description: 'World’s largest government-funded health assurance scheme providing ₹5,00,000 per family per year for secondary and tertiary care hospitalizations across India.',
    category: 'Centrally Sponsored Scheme',
    state: 'All India',
    minAge: null,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    financialBenefitText: '₹5,00,000 / Year Free Cashless Hospitalization',
    benefits: [
      '₹5 Lakh cashless health cover per family per year across 28,000+ empanelled hospitals',
      'Includes senior citizens 70+ years regardless of income under universal cover expansion',
      'Zero out-of-pocket expenditure for diagnostic tests, surgeries, medicines, and food during admission'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / PM-JAY Family Letter',
      'Active Mobile Number linked to Aadhaar'
    ],
    stepsToApply: [
      'Check eligibility on beneficiary.nha.gov.in or download the Ayushman App',
      'Complete Aadhaar OTP verification and e-KYC photo capture',
      'Download your PVC Ayushman Card instantly to present at network hospitals'
    ],
    applyLink: 'https://beneficiary.nha.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'PM Surya Ghar: Muft Bijli Yojana (Free Rooftop Solar)',
    description: 'Revolutionary national rooftop solar scheme providing up to ₹78,000 direct capital subsidy to households for installing rooftop solar systems, enabling up to 300 units of free electricity per month.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    financialBenefitText: 'Up to ₹78,000 Direct Subsidy + 300 Units Free Electricity',
    benefits: [
      '1 kW System: ₹30,000 direct central subsidy',
      '2 kW System: ₹60,000 direct central subsidy',
      '3 kW or higher System: ₹78,000 direct central subsidy',
      'Zero monthly electricity bills up to 300 units and surplus power export earnings'
    ],
    requiredDocuments: [
      'Recent Electricity Power Bill',
      'Aadhaar Card and PAN Card',
      'Bank Account Passbook (for subsidy deposit)',
      'Roof ownership proof / property tax receipt'
    ],
    stepsToApply: [
      'Register on the National Portal (pmsuryaghar.gov.in)',
      'Select your DISCOM electricity provider and enter consumer CA number',
      'Choose a registered vendor for rooftop solar installation',
      'After net-meter commissioning, government subsidy is transferred to your bank account within 30 days'
    ],
    applyLink: 'https://pmsuryaghar.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'PM Vishwakarma Kaushal Samman Yojana',
    description: 'Comprehensive financial and skill enablement scheme for traditional artisans and craftspeople across 18 trades, providing ₹15,000 toolkit grants and collateral-free enterprise loans up to ₹3,00,000 at 5% interest.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Worker',
    financialBenefitText: '₹15,000 Free Toolkit Grant + ₹3,00,000 Low-Interest Loan',
    benefits: [
      'Free 5 to 7 days basic skill training with ₹500/day daily stipend',
      '₹15,000 direct electronic voucher for modern toolkits',
      'First tranche collateral-free loan of ₹1,00,000 and second tranche of ₹2,00,000 at concessional 5% interest',
      'PM Vishwakarma digital identity card and national certification'
    ],
    requiredDocuments: [
      'Aadhaar Card and Mobile Number',
      'Bank Account Passbook',
      'Ration Card',
      'Self-declaration of practicing one of the 18 traditional crafts (Carpenter, Blacksmith, Potter, Tailor, Cobbler, Mason, etc.)'
    ],
    stepsToApply: [
      'Visit nearest CSC center or register on pmvishwakarma.gov.in',
      'Complete biometric Aadhaar authentication and trade selection',
      'Gram Panchayat / Urban Local Body conducts three-tier verification for certificate issuance'
    ],
    applyLink: 'https://pmvishwakarma.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    description: 'Flagship rural housing scheme providing ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult areas for constructing pucca houses with hygienic toilets, LPG, and electricity connections.',
    category: 'Centrally Sponsored Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: 200000,
    targetGender: 'Any',
    targetOccupation: 'All Citizens',
    financialBenefitText: '₹1,20,000 Direct Housing Construction Grant',
    benefits: [
      '₹1,20,000 cash grant in 3 construction-linked installments via DBT',
      'Additional 90 to 95 days of unskilled labor wages under MGNREGA (approx ₹20,000+)',
      '₹12,000 grant for toilet construction under Swachh Bharat Mission'
    ],
    requiredDocuments: [
      'Aadhaar Card of all family members',
      'Job Card (MGNREGA)',
      'Bank Account details',
      'Gram Sabha verification and SECC 2011 / Awas+ Survey inclusion'
    ],
    stepsToApply: [
      'Enrollment is conducted via Gram Panchayat Awas+ portal by Gram Sevak',
      'Geotagging of land is completed by village development officer',
      'Financial installments are credited upon Geo-tagging milestones (Foundation, Lintel, Roof completion)'
    ],
    applyLink: 'https://pmayg.nic.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    description: 'Collateral-free micro-enterprise financing providing business loans up to ₹20,00,000 under Shishu, Kishore, Tarun, and Tarun Plus categories for manufacturing, trading, and service businesses.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: 65,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Business',
    financialBenefitText: 'Collateral-Free Business Loans up to ₹20 Lakh',
    benefits: [
      'Shishu: Loans up to ₹50,000 for new startups',
      'Kishore: Loans from ₹50,000 up to ₹5,00,000 for expanding units',
      'Tarun: Loans from ₹5 Lakh up to ₹10 Lakh',
      'Tarun Plus: Loans from ₹10 Lakh up to ₹20 Lakh for entrepreneurs with good credit history',
      'Zero collateral or third-party guarantee required'
    ],
    requiredDocuments: [
      'Aadhaar Card, PAN Card, and Business Address Proof',
      'Business Registration / Udyam Certificate',
      'Last 6 months Bank Account Statements',
      'Project quotation or business machinery invoice'
    ],
    stepsToApply: [
      'Apply online through JanSamarth portal (jansamarth.in) or visit any public/private bank branch',
      'Choose Mudra loan category and submit business plan details',
      'Bank sanctions loan and issues Mudra Debit Card for working capital'
    ],
    applyLink: 'https://www.mudra.org.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri SVANidhi Scheme (Street Vendor Loan)',
    description: 'Micro-credit facility offering working capital loans up to ₹50,000 with 7% interest subsidy and cashback incentives for urban street vendors, hawkers, and roadside stalls.',
    category: 'Centrally Sponsored Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Worker',
    financialBenefitText: '₹10,000 to ₹50,000 Working Capital Loan with 7% Interest Subsidy',
    benefits: [
      '1st Tranche: ₹10,000 collateral-free loan (1 year tenure)',
      '2nd Tranche: ₹20,000 loan upon prompt repayment of first loan',
      '3rd Tranche: ₹50,000 loan for established vendors',
      '7% annual interest subsidy credited quarterly via DBT for timely repayment'
    ],
    requiredDocuments: [
      'Aadhaar Card and Mobile Number',
      'Certificate of Vending / Vendor Identity Card issued by Urban Local Body (ULB) / Municipality',
      'Bank Account Passbook'
    ],
    stepsToApply: [
      'Apply through pmsvanidhi.mohua.gov.in portal or via local Banking Correspondent / CSC',
      'Verify Urban Local Body vending survey status',
      'Loan is directly credited to vendor bank account within 7 to 10 working days'
    ],
    applyLink: 'https://pmsvanidhi.mohua.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Pradhan Mantri Ujjwala Yojana 2.0 (Free LPG Connection)',
    description: 'Universal clean cooking fuel scheme providing free LPG connection with first refill and gas stove to adult women belonging to low-income and disadvantaged households.',
    category: 'Centrally Sponsored Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: null,
    maxIncome: 250000,
    targetGender: 'Female',
    targetOccupation: 'All Citizens',
    financialBenefitText: '100% Free Gas Cylinder Connection + Free Stove + 1st Refill',
    benefits: [
      'Zero security deposit for LPG cylinder and pressure regulator',
      'Free LPG rubber hose, safety booklet, and domestic gas stove',
      'Targeted ₹300 per cylinder government subsidy directly credited on each subsequent refill'
    ],
    requiredDocuments: [
      'Aadhaar Card of the female applicant and adult family members',
      'Ration Card or 14-point declaration supporting family composition',
      'Aadhaar-linked Bank Account details'
    ],
    stepsToApply: [
      'Apply online at pmuy.gov.in or submit physical application at nearest gas agency (Indane, HP Gas, Bharat Gas)',
      'Distributor verifies household deduplication through OMC network',
      'Collect your new gas connection, stove, and cylinder'
    ],
    applyLink: 'https://www.pmuy.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY)',
    description: 'High-yield government small savings scheme for girl children offering 8.2% interest per annum, Section 80C tax exemption, and sovereign safety for education and marriage milestones.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 0,
    maxAge: 10,
    maxIncome: null,
    targetGender: 'Female',
    targetOccupation: 'Student',
    financialBenefitText: '8.2% Compound Interest + Complete Tax-Free Maturity',
    benefits: [
      'Highest government-backed interest rate (8.2% p.a.) compounded annually',
      'EEE (Exempt-Exempt-Exempt) tax benefit on deposit, interest, and maturity',
      'Account operable until 21 years from opening date or marriage after age 18'
    ],
    requiredDocuments: [
      'Birth Certificate of the girl child',
      'Aadhaar Card and PAN Card of the biological parent or legal guardian',
      'Address Proof and Passport size photos'
    ],
    stepsToApply: [
      'Visit any Post Office branch or designated authorized commercial bank',
      'Fill Sukanya Samriddhi account opening form with minimum ₹250 initial deposit',
      'Receive your SSY Passbook to track annual contributions'
    ],
    applyLink: 'https://www.indiapost.gov.in',
    lastSyncedAt: new Date().toISOString()
  },
  {
    title: 'Atal Pension Yojana (APY)',
    description: 'Guaranteed pension scheme for unorganized sector workers providing guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month after attaining 60 years.',
    category: 'Central Sector Scheme',
    state: 'All India',
    minAge: 18,
    maxAge: 40,
    maxIncome: null,
    targetGender: 'Any',
    targetOccupation: 'Worker',
    financialBenefitText: '₹1,000 to ₹5,000 / Month Guaranteed Lifetime Pension',
    benefits: [
      'Guaranteed lifelong monthly pension to subscriber after age 60',
      'Same pension amount continues to spouse upon demise of subscriber',
      'Full accumulated corpus returned to designated nominee upon death of both subscriber and spouse'
    ],
    requiredDocuments: [
      'Savings Bank Account / Post Office Account',
      'Aadhaar Card and Active Mobile Number',
      'Nominee Details'
    ],
    stepsToApply: [
      'Apply online via Net Banking of your bank or visit your bank branch',
      'Choose preferred monthly pension slab (₹1,000 to ₹5,000)',
      'Set auto-debit for small monthly contributions (e.g. ₹42 to ₹210 depending on age)'
    ],
    applyLink: 'https://www.npscra.nsdl.co.in',
    lastSyncedAt: new Date().toISOString()
  }
];
