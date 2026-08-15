import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { adminDb } from '@/lib/firebase-admin';
import { Scheme, formatCategoryName } from '@/types/scheme';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Automatic Translation Helper (Marathi / Hindi to clean English)
async function translateToEnglish(text: string): Promise<string> {
  if (!text || !/[\u0900-\u097F]/.test(text)) {
    return text.trim();
  }

  // Pre-clean boilerplate Marathi suffixes
  let clean = text
    .replace(/पुढीलप्रमाणे/g, '')
    .replace(/\d+\s*योजना/g, '')
    .replace(/आम्हाला फॉलो करा.*/g, '')
    .trim();

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      let translated = data[0]?.map((item: any) => item[0]).join('') || clean;

      // Polish common terminology translations
      translated = translated
        .replace(/\bPlans\b/gi, 'Schemes')
        .replace(/\bPlan\b/gi, 'Scheme')
        .replace(/\bNext\b/gi, '')
        .replace(/\bas follows\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      return translated;
    }
  } catch (err) {
    console.error('Translation error:', err);
  }

  return clean;
}

export async function POST(req: Request) {
  try {
    const scrapedSchemes: Scheme[] = [];
    const logs: string[] = [];

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,mr;q=0.8,hi;q=0.7'
    };

    // =========================================================================
    // 1. LIVE CRAWL: Central Government Schemes (Wikipedia Live Table Scraper)
    // =========================================================================
    const wikiCentralUrl = 'https://en.wikipedia.org/wiki/List_of_government_schemes_in_India';
    logs.push(`Connecting live to ${wikiCentralUrl}...`);

    try {
      const res = await fetch(wikiCentralUrl, { cache: 'no-store', headers });
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        $('.wikitable tr').each((i, row) => {
          const cells = $(row).find('th, td');
          if (i === 0 || cells.length < 3) return;

          const rawTitle = $(cells[0]).text().replace(/\[\d+\]/g, '').trim();
          const rawCategory = $(cells[1]).text().replace(/\[\d+\]/g, '').trim() || 'General';
          const category = formatCategoryName(rawCategory);
          const rawDesc = $(cells[cells.length - 1]).text().replace(/\[\d+\]/g, '').trim();

          if (rawTitle && rawTitle.length > 3 && rawDesc && rawDesc.length > 5) {
            scrapedSchemes.push({
              title: rawTitle,
              description: rawDesc,
              category: category.substring(0, 50),
              state: 'All India',
              minAge: null,
              maxAge: null,
              maxIncome: null,
              targetGender: 'Any',
              targetOccupation: 'Any',
              benefits: ['Government Welfare Assistance', 'Citizen Direct Support'],
              applyLink: `https://www.google.com/search?q=${encodeURIComponent(rawTitle + " official portal apply")}`,
              lastSyncedAt: new Date().toISOString()
            });
          }
        });
        logs.push(`Fetched ${scrapedSchemes.length} schemes from Central Wikipedia tables.`);
      }
    } catch (wikiErr: any) {
      logs.push(`Central Wikipedia scrape error: ${wikiErr.message}`);
    }

    // =========================================================================
    // 2. LIVE CRAWL: MahaDBT Official Portal (mahadbt.maharashtra.gov.in)
    // =========================================================================
    const mahaDbtBase = 'https://mahadbt.maharashtra.gov.in';
    logs.push(`Connecting live to MahaDBT Portal: ${mahaDbtBase}...`);

    const mahaDbtCategories = [
      { path: '/college-student', label: 'MahaDBT - College Student Scholarships', target: 'Student' },
      { path: '/school-student', label: 'MahaDBT - School Student Scholarships', target: 'Student' },
      { path: '/farmer', label: 'MahaDBT - Farmer Subsidies & Agriculture', target: 'Farmer' },
      { path: '/pensioner', label: 'MahaDBT - Pension & Special Assistance', target: 'Senior Citizen' },
      { path: '/divyang', label: 'MahaDBT - Divyang Welfare Schemes', target: 'Any' },
      { path: '/others', label: 'MahaDBT - Citizen Welfare Schemes', target: 'Any' }
    ];

    try {
      const rawMahaEntries: { rawTitle: string; catLabel: string; target: string; href: string }[] = [];

      // A. Fetch main portal
      const mahaMainRes = await fetch(mahaDbtBase, { cache: 'no-store', headers });
      if (mahaMainRes.ok) {
        const mahaHtml = await mahaMainRes.text();
        const $m = cheerio.load(mahaHtml);

        $m('a').each((_, el) => {
          const rawText = $m(el).text().trim().replace(/\s+/g, ' ');
          const href = $m(el).attr('href');

          if (rawText && rawText.length > 5 && href && (rawText.includes('योजना') || rawText.includes('विद्यार्थी') || rawText.includes('शेतकरी') || rawText.includes('शिष्यवृत्ती'))) {
            rawMahaEntries.push({
              rawTitle: rawText,
              catLabel: 'MahaDBT (Maharashtra)',
              target: rawText.includes('शेतकरी') ? 'Farmer' : rawText.includes('विद्यार्थी') ? 'Student' : 'Any',
              href: href.startsWith('http') ? href : `${mahaDbtBase}${href.startsWith('/') ? '' : '/'}${href}`
            });
          }
        });
      }

      // B. Fetch subpages
      await Promise.all(
        mahaDbtCategories.map(async (cat) => {
          try {
            const subRes = await fetch(`${mahaDbtBase}${cat.path}`, { cache: 'no-store', headers });
            if (subRes.ok) {
              const subHtml = await subRes.text();
              const $sub = cheerio.load(subHtml);

              $sub('h1, h2, h3, h4, h5, .card-title, .scheme-title, strong, a').each((_, el) => {
                const text = $sub(el).text().trim().replace(/\s+/g, ' ');
                const href = $sub(el).attr('href');

                if (text && text.length > 8 && text.length < 150 && 
                   (text.includes('योजना') || text.includes('शिष्यवृत्ती') || text.includes('Scholarship') || text.includes('Subsidy') || text.includes('Allowance') || text.includes('Freeship')) &&
                   !text.includes('महाराष्ट्र शासन') && !text.includes('लॉगिन')) {
                  
                  rawMahaEntries.push({
                    rawTitle: text,
                    catLabel: cat.label,
                    target: cat.target,
                    href: href ? (href.startsWith('http') ? href : `${mahaDbtBase}${href}`) : `${mahaDbtBase}${cat.path}`
                  });
                }
              });
            }
          } catch (err: any) {
            logs.push(`Subcategory fetch error for ${cat.path}: ${err.message}`);
          }
        })
      );

      // C. Translate all crawled MahaDBT entries to English
      for (const entry of rawMahaEntries) {
        const translatedTitle = await translateToEnglish(entry.rawTitle);
        
        // Skip if too short or repetitive header
        if (!translatedTitle || translatedTitle.length < 4 || translatedTitle.toLowerCase() === 'schemes' || translatedTitle.toLowerCase() === 'plans') {
          continue;
        }

        const isDuplicate = scrapedSchemes.some(s => s.title.toLowerCase() === translatedTitle.toLowerCase());
        if (!isDuplicate) {
          scrapedSchemes.push({
            title: translatedTitle,
            description: `Official Direct Benefit Transfer (DBT) scheme under ${entry.catLabel}. Provides financial assistance and fee concessions to eligible Maharashtra citizens.`,
            category: entry.catLabel,
            state: 'Maharashtra',
            minAge: null,
            maxAge: null,
            maxIncome: 800000,
            targetGender: 'Any',
            targetOccupation: entry.target,
            benefits: ['Direct Benefit Transfer (DBT)', 'Tuition Waiver / Government Grant'],
            applyLink: entry.href,
            lastSyncedAt: new Date().toISOString()
          });
        }
      }

      logs.push(`Completed live crawl and English translation of MahaDBT schemes.`);
    } catch (mahaErr: any) {
      logs.push(`MahaDBT crawl error: ${mahaErr.message}`);
    }

    // =========================================================================
    // 3. LIVE CRAWL: Women & Special Welfare Schemes (Wikipedia)
    // =========================================================================
    const wikiWomenUrl = 'https://en.wikipedia.org/wiki/Welfare_schemes_for_women_in_India';
    try {
      const res = await fetch(wikiWomenUrl, { cache: 'no-store', headers });
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        $('.wikitable tr').each((i, row) => {
          const cells = $(row).find('th, td');
          if (i === 0 || cells.length < 2) return;

          const title = $(cells[0]).text().replace(/\[\d+\]/g, '').trim();
          const description = $(cells[cells.length - 1]).text().replace(/\[\d+\]/g, '').trim();

          if (title && title.length > 3 && description && description.length > 5) {
            const isDup = scrapedSchemes.some(s => s.title.toLowerCase() === title.toLowerCase());
            if (!isDup) {
              scrapedSchemes.push({
                title,
                description,
                category: 'Women & Child Welfare',
                state: 'All India',
                minAge: null,
                maxAge: null,
                maxIncome: null,
                targetGender: 'Female',
                targetOccupation: 'Any',
                benefits: ['Women Empowerment', 'Direct Cash / Healthcare Benefit'],
                applyLink: `https://www.google.com/search?q=${encodeURIComponent(title + " official portal apply")}`,
                lastSyncedAt: new Date().toISOString()
              });
            }
          }
        });
      }
    } catch (womenErr: any) {
      logs.push(`Women schemes scrape error: ${womenErr.message}`);
    }

    // =========================================================================
    // 4. Batch Write Scraped Results to Firestore
    // =========================================================================
    if (scrapedSchemes.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No schemes could be fetched live from online sources.',
        logs
      }, { status: 500 });
    }

    const schemesRef = adminDb.collection('schemes');

    // Clean up any stale Devanagari/Marathi documents from prior runs
    try {
      const existingSnapshot = await schemesRef.get();
      const deleteBatch = adminDb.batch();
      let deleteCount = 0;
      existingSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (/[\u0900-\u097F]/.test(doc.id) || (data.title && /[\u0900-\u097F]/.test(data.title))) {
          deleteBatch.delete(doc.ref);
          deleteCount++;
        }
      });
      if (deleteCount > 0) {
        await deleteBatch.commit();
        logs.push(`Cleaned up ${deleteCount} legacy non-English scheme records.`);
      }
    } catch (cleanErr: any) {
      console.error('Error during cleanup:', cleanErr);
    }

    const chunks = [];
    for (let i = 0; i < scrapedSchemes.length; i += 400) {
      chunks.push(scrapedSchemes.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = adminDb.batch();
      chunk.forEach((scheme) => {
        // Clean docId in English
        const docId = scheme.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 100);
        if (docId) {
          const docRef = schemesRef.doc(docId);
          batch.set(docRef, scheme, { merge: true });
        }
      });
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Live crawl and translation completed! Successfully synced ${scrapedSchemes.length} schemes in English into the database.`,
      totalSynced: scrapedSchemes.length,
      logs,
      preview: scrapedSchemes.slice(0, 5)
    });

  } catch (error: any) {
    console.error('Dynamic Live Crawl Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
