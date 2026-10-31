import assert from 'node:assert';
import { extractSchemeTimeline } from '../lib/pipeline/timeline-extractor';
import { getSchemeTimeline } from '../types/scheme';

console.log('🧪 Running Dynamic Timeline & Date Extractor Test Suite...\n');

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

// Test 1: Real date extraction from official circular text
test('Extracts explicit last date from official circular text', () => {
  const schemeWithExplicitDeadline = {
    title: 'Dr. Punjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna',
    description: 'Hostel maintenance allowance for registered students. Official notification: Last date to apply is 15th March 2027.',
    category: 'Higher Education (DHE)',
  };

  const timeline = extractSchemeTimeline(schemeWithExplicitDeadline);
  assert.strictEqual(timeline.status, 'Active Cycle');
  assert.strictEqual(timeline.endDate, '15th March 2027', 'Should extract exact deadline from description text');
  assert.ok(timeline.datesText.includes('15th March 2027'));
});

// Test 2: Extension notice extraction
test('Detects extension notices and sets status to Extended Deadline', () => {
  const schemeWithExtension = {
    title: 'Post-Matric Scholarship Scheme',
    description: 'Government extension order: Applications extended up to 30 April 2027 for eligible students.',
    category: 'MahaDBT',
  };

  const timeline = extractSchemeTimeline(schemeWithExtension);
  assert.strictEqual(timeline.status, 'Extended Deadline');
  assert.strictEqual(timeline.isExtended, true);
  assert.strictEqual(timeline.endDate, '30 April 2027');
  assert.ok(timeline.extendedDate?.includes('30 April 2027'));
});

// Test 3: Universal Year-Round Direct Benefit Schemes
test('Correctly identifies universal schemes as Open Year-Round with zero hardcoded cutoffs', () => {
  const pmKisan = {
    title: 'PM Kisan Samman Nidhi',
    description: 'Continuous direct benefit transfer of ₹6,000 per year for farmer families.',
    category: 'Agriculture',
  };

  const timeline = getSchemeTimeline(pmKisan);
  assert.strictEqual(timeline.status, 'Open Year-Round');
  assert.strictEqual(timeline.badgeColor, 'emerald');
  assert.strictEqual(timeline.startDate, 'Continuous (Active 365 Days)');
  assert.strictEqual(timeline.endDate, 'No Closing Date (Open Year-Round)');
  assert.strictEqual(timeline.isExtended, false);
});

// Test 4: Dynamic Academic Cycle (No static years)
test('Calculates active academic year cycle dynamically based on current system year', () => {
  const studentScheme = {
    title: 'Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship',
    description: 'Merit scholarship for college students across Maharashtra.',
    category: 'MahaDBT (College Student)',
  };

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const expectedCycleText = `Academic Cycle ${currentYear}-${nextYear.toString().slice(-2)}`;

  const timeline = getSchemeTimeline(studentScheme);
  assert.strictEqual(timeline.status, 'Active Cycle');
  assert.strictEqual(timeline.datesText, expectedCycleText, `Should dynamically calculate current cycle ${expectedCycleText}`);
  assert.ok(timeline.startDate?.includes(currentYear.toString()));
});

// Test 5: Seasonal Crop Insurance Kharif / Rabi Window
test('Dynamically determines seasonal crop insurance window based on calendar month', () => {
  const cropScheme = {
    title: 'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
    description: 'Comprehensive risk coverage for seasonal crops per agricultural notification.',
    category: 'Agriculture',
  };

  const timeline = getSchemeTimeline(cropScheme);
  assert.strictEqual(timeline.status, 'Active Cycle');
  assert.strictEqual(timeline.badgeColor, 'blue');
  assert.ok(timeline.datesText.includes('Window • Cutoff'));
});

console.log(`\n🎉 All ${passedTests} Dynamic Timeline tests passed successfully!\n`);

