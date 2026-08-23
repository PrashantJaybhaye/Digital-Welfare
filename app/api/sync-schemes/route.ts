import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { adminDb } from '@/lib/firebase-admin';
import { Scheme, formatCategoryName } from '@/types/scheme';
import { CURATED_SCHEMES } from '@/lib/curated-schemes';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Automatic Translation Helper (Marathi / Hindi to clean English)
async function translateToEnglish(text: string): Promise<string> {
  if (!text || !/[\u0900-\u097F]/.test(text)) {
    return text.trim();
  }

  // Pre-clean boilerplate Marathi suffixes
  const clean = text
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
      const translatedRaw = Array.isArray(data?.[0]) 
        ? data[0].map((item: unknown[]) => (Array.isArray(item) && item[0] ? String(item[0]) : '')).join('') 
        : clean;
      let translated = translatedRaw || clean;

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

// Filter out generic headers and placeholder titles
function isInvalidSchemeTitle(title: string): boolean {
  if (!title || title.length < 4) return true;
  const t = title.trim().toLowerCase();
  
  // List of generic headers to filter out
  const invalidPatterns = [
    /^\d+\s*schemes?$/i,
    /^(other|list of other)\s*\d*\s*schemes?$/i,
    /^search for eligible schemes?$/i,
    /^schemes? for (farmers?|pensioners?|school students?|college students?|persons with disabilities|divyang|women)$/i,
    /^(college student|school student|farmers?|divyang|pensioners?)\s*\d+\s*schemes?$/i,
    /^(click here|read more|apply here|view all|know more)$/i,
    /^(general scholarship school students \d+ scheme)$/i,
    /^(pensioners\/special assistance scheme \d+ schemes?)$/i,
    /^(other \d+ schemes)$/i
  ];

  return invalidPatterns.some(pattern => pattern.test(t));
}

export async function POST() {
  try {
    // Start with our rich, verified curated schemes catalog
    const scrapedSchemes: Scheme[] = [...CURATED_SCHEMES];
    const logs: string[] = [
      `Loaded ${CURATED_SCHEMES.length} verified Maharashtra and Central flagship schemes.`
    ];

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

          if (rawTitle && rawTitle.length > 3 && rawDesc && rawDesc.length > 5 && !isInvalidSchemeTitle(rawTitle)) {
            const isDuplicate = scrapedSchemes.some(s => s.title.toLowerCase() === rawTitle.toLowerCase());
            if (!isDuplicate) {
              scrapedSchemes.push({
                title: rawTitle,
                description: rawDesc,
                category: category.substring(0, 50),
                state: 'All India',
                minAge: null,
                maxAge: null,
                maxIncome: null,
                targetGender: 'Any',
                targetOccupation: 'All Citizens',
                benefits: ['Government Welfare Assistance', 'Citizen Direct Support'],
                applyLink: `https://www.google.com/search?q=${encodeURIComponent(rawTitle + " official portal apply")}`,
                lastSyncedAt: new Date().toISOString()
              });
            }
          }
        });
        logs.push(`Live crawl now has ${scrapedSchemes.length} total schemes.`);
      }
    } catch (wikiErr: unknown) {
      const msg = wikiErr instanceof Error ? wikiErr.message : String(wikiErr);
      logs.push(`Central Wikipedia scrape error: ${msg}`);
    }

    // =========================================================================
    // 2. LIVE CRAWL: Women & Special Welfare Schemes (Wikipedia)
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

          if (title && title.length > 3 && description && description.length > 5 && !isInvalidSchemeTitle(title)) {
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
                targetOccupation: 'All Citizens',
                benefits: ['Women Empowerment', 'Direct Cash / Healthcare Benefit'],
                applyLink: `https://www.google.com/search?q=${encodeURIComponent(title + " official portal apply")}`,
                lastSyncedAt: new Date().toISOString()
              });
            }
          }
        });
      }
    } catch (womenErr: unknown) {
      const msg = womenErr instanceof Error ? womenErr.message : String(womenErr);
      logs.push(`Women schemes scrape error: ${msg}`);
    }

    // =========================================================================
    // 3. Clean and Batch Write to Firestore
    // =========================================================================
    if (scrapedSchemes.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No schemes could be loaded.',
        logs
      }, { status: 500 });
    }

    const schemesRef = adminDb.collection('schemes');

    // Clean up generic placeholders / invalid documents
    try {
      const existingSnapshot = await schemesRef.get();
      const deleteBatch = adminDb.batch();
      let deleteCount = 0;
      
      existingSnapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (isInvalidSchemeTitle(data.title) || /[\u0900-\u097F]/.test(docSnap.id)) {
          deleteBatch.delete(docSnap.ref);
          deleteCount++;
        }
      });
      
      if (deleteCount > 0) {
        await deleteBatch.commit();
        logs.push(`Cleaned up ${deleteCount} placeholder / invalid legacy scheme records.`);
      }
    } catch (cleanErr: unknown) {
      console.error('Error during cleanup:', cleanErr);
    }

    const chunks = [];
    for (let i = 0; i < scrapedSchemes.length; i += 400) {
      chunks.push(scrapedSchemes.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = adminDb.batch();
      chunk.forEach((scheme) => {
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
      message: `Database sync complete! Ingested ${scrapedSchemes.length} verified schemes (including full Maharashtra & MahaDBT catalog).`,
      totalSynced: scrapedSchemes.length,
      logs,
      preview: scrapedSchemes.slice(0, 5)
    });

  } catch (error: unknown) {
    console.error('Sync error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error during sync';
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
