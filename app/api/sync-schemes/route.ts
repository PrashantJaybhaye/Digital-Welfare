import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { adminDb } from '@/lib/firebase-admin';
import { Scheme } from '@/types/scheme';

export async function POST(req: Request) {
  try {
    // 1. Fetch the HTML from a government portal
    // Note: This targets india.gov.in as a demonstration. 
    // In a production app, you might scrape multiple sources or use an API if available.
    const url = 'https://www.india.gov.in/my-government/schemes';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schemes: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const scrapedSchemes: Scheme[] = [];

    // 2. Parse the HTML (This selector logic is tailored to india.gov.in's layout)
    $('.view-content .views-row').each((i, element) => {
      // Find the title and the link
      const titleElement = $(element).find('.views-field-title a');
      const title = titleElement.text().trim();
      const link = titleElement.attr('href');
      
      // Find description
      const descElement = $(element).find('.views-field-body .field-content');
      const description = descElement.text().trim();

      if (title) {
        scrapedSchemes.push({
          title,
          description: description || 'Detailed information available on the official portal.',
          category: 'General', // In a real app, you'd use AI or keyword matching to categorize this
          state: 'All India',
          minAge: null,
          maxAge: null,
          maxIncome: null,
          targetGender: 'Any',
          targetOccupation: 'Any',
          benefits: ['Government Assistance'], 
          applyLink: link ? (link.startsWith('http') ? link : `https://www.india.gov.in${link}`) : null,
          lastSyncedAt: new Date().toISOString()
        });
      }
    });

    // If scraping failed to find elements (maybe the site layout changed)
    if (scrapedSchemes.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No schemes found. The target website layout might have changed.' 
      }, { status: 404 });
    }

    // 3. Write securely to Firebase Firestore
    const batch = adminDb.batch();
    const schemesRef = adminDb.collection('schemes');

    // To prevent duplicate entries, we create a predictable document ID based on the title
    scrapedSchemes.forEach((scheme) => {
      const docId = scheme.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const docRef = schemesRef.doc(docId);
      
      // merge: true ensures we update existing schemes without deleting any custom fields you added manually!
      batch.set(docRef, scheme, { merge: true });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully scraped and synced ${scrapedSchemes.length} schemes to Firestore!`,
      data: scrapedSchemes 
    });

  } catch (error: any) {
    console.error('Scraping Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
