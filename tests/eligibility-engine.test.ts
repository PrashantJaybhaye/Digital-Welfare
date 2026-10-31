import assert from 'node:assert';
import { evaluateEligibility, UserProfile } from '../lib/eligibility-engine';
import { Scheme } from '../types/scheme';

const mockSchemes: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support for all landholding farmer families across India',
    category: 'Agriculture & Rural',
    state: 'All India',
    minAge: 18,
    maxIncome: 400000,
    targetOccupation: 'Farmer',
    benefits: ['₹6,000 / Year in 3 instalments'],
    financialBenefitText: '₹6,000 / Year in 3 instalments',
    applyLink: 'https://pmkisan.gov.in',
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'post-matric-scholarship',
    title: 'Post Matric Scholarship for SC Students',
    description: 'Financial assistance for SC student education and college tuition in Maharashtra',
    category: 'MahaDBT (College Student)',
    state: 'Maharashtra',
    minAge: 16,
    maxAge: 35,
    maxIncome: 250000,
    socialCategory: 'SC/ST',
    benefits: ['100% Tuition Waiver + Maintenance Allowance'],
    financialBenefitText: '100% Tuition Waiver + Maintenance Allowance',
    applyLink: 'https://mahadbt2.maharashtra.gov.in',
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat PM-JAY Health Protection',
    description: 'Universal cashless inpatient health insurance coverage for vulnerable families',
    category: 'Healthcare & Nutrition',
    state: 'All India',
    maxIncome: 300000,
    benefits: ['₹5,00,000 cashless hospital cover per family per year'],
    financialBenefitText: '₹5,00,000 per family per year',
    applyLink: 'https://pmjay.gov.in',
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'railway-station-redevelopment',
    title: 'Amrit Bharat Redevelop Existing Railway Station Project',
    description: 'Infrastructure development and civil modernization for railway stations',
    category: 'Infrastructure',
    state: 'All India',
    benefits: ['Railway station platform and civil works redevelopment'],
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'up-kanya-sumangala',
    title: 'UP Mukhya Mantri Kanya Sumangala',
    description: 'Financial assistance for girl child born in Uttar Pradesh',
    category: 'Women & Child',
    state: 'Uttar Pradesh',
    targetGender: 'Female',
    maxIncome: 300000,
    benefits: ['₹15,000 conditional financial assistance in 6 stages'],
    lastSyncedAt: '2026-01-01T00:00:00.000Z',
  },
];

console.log('🧪 Running DigitalWelfare Eligibility Engine Unit Test Suite...\n');

let passedTests = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// Test 1: Age Boundary Exclusions
test('Excludes applicant below minAge or above maxAge', () => {
  const minorProfile: UserProfile = {
    age: 18, // Ladki Bahin requires minAge 21
    gender: 'Female',
    income: 120000,
    occupation: 'Unemployed',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const result = evaluateEligibility(minorProfile, mockSchemes);
  const isLadkiBahinEligible = result.eligible.some((s) => s.id === 'ladki-bahin');
  assert.strictEqual(isLadkiBahinEligible, false, 'Minor (18 yrs) must not qualify for Ladki Bahin (minAge 21)');

  const elderlyProfile: UserProfile = {
    age: 72, // Ladki Bahin maxAge is 65
    gender: 'Female',
    income: 100000,
    occupation: 'Senior Citizen',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const elderlyResult = evaluateEligibility(elderlyProfile, mockSchemes);
  assert.strictEqual(
    elderlyResult.eligible.some((s) => s.id === 'ladki-bahin'),
    false,
    'Elderly (72 yrs) must not qualify for Ladki Bahin (maxAge 65)'
  );
});

// Test 2: Income Ceiling Enforcement
test('Enforces maximum family annual income ceiling', () => {
  const wealthyProfile: UserProfile = {
    age: 28,
    gender: 'Female',
    income: 600000, // Ceiling is 250,000
    occupation: 'Employed',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const result = evaluateEligibility(wealthyProfile, mockSchemes);
  assert.strictEqual(
    result.eligible.some((s) => s.id === 'ladki-bahin'),
    false,
    'Income > ₹2.5 Lakh must be excluded from BPL-targeted scheme'
  );
});

// Test 3: Gender Targeting & Women Empowerment Rules
test('Prevents male applicants from qualifying for women-exclusive schemes', () => {
  const maleProfile: UserProfile = {
    age: 30,
    gender: 'Male',
    income: 150000,
    occupation: 'Worker',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const result = evaluateEligibility(maleProfile, mockSchemes);
  assert.strictEqual(
    result.eligible.some((s) => s.id === 'ladki-bahin'),
    false,
    'Male applicant cannot qualify for female-exclusive scheme'
  );
});

// Test 4: State Boundaries & Central Scheme Universality
test('Matches state jurisdiction correctly while including All India schemes', () => {
  const mhProfile: UserProfile = {
    age: 24,
    gender: 'Female',
    income: 180000,
    occupation: 'Student',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const result = evaluateEligibility(mhProfile, mockSchemes);

  // Should NOT qualify for Uttar Pradesh state scheme
  assert.strictEqual(
    result.eligible.some((s) => s.id === 'up-kanya-sumangala'),
    false,
    'Maharashtra resident must not qualify for Uttar Pradesh scheme'
  );

  // Should qualify for All-India scheme
  assert.strictEqual(
    result.eligible.some((s) => s.id === 'ayushman-bharat'),
    true,
    'All-India scheme should match any eligible citizen regardless of state'
  );
});

// Test 5: Occupational Boost & Cross-Domain Irrelevance
test('Boosts score for matching occupation and filters out irrelevant schemes', () => {
  const studentProfile: UserProfile = {
    age: 20,
    gender: 'Male',
    income: 150000,
    occupation: 'Student',
    state: 'Maharashtra',
    socialCategory: 'SC/ST',
  };
  const studentResult = evaluateEligibility(studentProfile, mockSchemes);

  // Top scored scheme should be the scholarship
  assert.strictEqual(
    studentResult.eligible[0]?.id,
    'post-matric-scholarship',
    'Student occupation should rank scholarship as top recommendation'
  );
  assert.strictEqual(
    studentResult.estimatedBenefitLabel,
    '₹25,000 - ₹50,000 / Year',
    'Student estimated benefit label should reflect education grant'
  );

  // Farmer scheme should be excluded for student
  assert.strictEqual(
    studentResult.eligible.some((s) => s.id === 'pm-kisan'),
    false,
    'PM-Kisan farmer scheme must be filtered out for a pure student applicant'
  );
});

// Test 6: Affirmative Action Quota & SC/ST Scoring Boost
test('Applies affirmative action priority bonus for SC/ST category', () => {
  const scProfile: UserProfile = {
    age: 22,
    gender: 'Female',
    income: 120000,
    occupation: 'Student',
    state: 'Maharashtra',
    socialCategory: 'SC/ST',
  };
  const result = evaluateEligibility(scProfile, mockSchemes);
  const scoredScholarship = result.matchedList.find((m) => m.scheme.id === 'post-matric-scholarship');
  assert.ok(scoredScholarship, 'Scholarship should be matched');
  assert.ok(
    scoredScholarship.reasons.includes('SC/ST Welfare Quota'),
    'Matched reasons must indicate SC/ST Welfare Quota affirmative action boost'
  );
});

// Test 7: Non-Entitlement Infrastructure Project Filtering
test('Silently filters out infrastructure/railway public works from citizen direct entitlements', () => {
  const genericProfile: UserProfile = {
    age: 35,
    gender: 'Male',
    income: 100000,
    occupation: 'Worker',
    state: 'All India',
    socialCategory: 'All',
  };
  const result = evaluateEligibility(genericProfile, mockSchemes);
  assert.strictEqual(
    result.eligible.some((s) => s.id === 'railway-station-redevelopment'),
    false,
    'Railway civil works project must never be marked as a direct citizen welfare benefit'
  );
  assert.strictEqual(
    result.notEligible.some((s) => s.id === 'railway-station-redevelopment'),
    true,
    'Civil works project should be placed in non-eligible list'
  );
});

// Test 8: Health Insurance Coverage Flag
test('Activates Ayushman PM-JAY coverage flag when income <= ₹300,000', () => {
  const bplProfile: UserProfile = {
    age: 40,
    gender: 'Male',
    income: 180000,
    occupation: 'Worker',
    state: 'Maharashtra',
    socialCategory: 'All',
  };
  const bplResult = evaluateEligibility(bplProfile, mockSchemes);
  assert.strictEqual(bplResult.hasHealthInsuranceCover, true, 'BPL citizen must have health insurance flag set to true');

  const highIncomeProfile: UserProfile = {
    ...bplProfile,
    income: 800000,
  };
  const highIncomeResult = evaluateEligibility(highIncomeProfile, mockSchemes);
  assert.strictEqual(highIncomeResult.hasHealthInsuranceCover, false, 'Citizen above ₹3L must not have PM-JAY cover flag');
});

console.log(`\n🎉 All ${passedTests} unit tests passed successfully!\n`);

