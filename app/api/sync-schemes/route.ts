import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { adminDb } from '@/lib/firebase-admin';
import { Scheme, formatCategoryName } from '@/types/scheme';

export async function POST(req: Request) {
  try {
    const scrapedSchemes: Scheme[] = [];

    // URL to the Wikipedia List of Government Schemes
    const url = 'https://en.wikipedia.org/wiki/List_of_government_schemes_in_India';
    
    console.log("Fetching data from Wikipedia...");
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      console.log("Fetched Wikipedia HTML length:", html.length);
      console.log("Found tables:", $('.wikitable').length);

      // Wikipedia usually organizes data in tables with class "wikitable"
      $('.wikitable tr').each((i, row) => {
        // Find both th and td to handle Wikipedia's scope="row"
        const cells = $(row).find('th, td');
        
        // Skip header rows (usually the first row where all cells are th)
        if (i === 0 || cells.length < 3) return;
          // Columns vary, but typically: Scheme Name (0), Ministry (1), Details/Objective (last or near last)
          const title = $(cells[0]).text().replace(/\[\d+\]/g, '').trim();
          let rawCategory = $(cells[1]).text().replace(/\[\d+\]/g, '').trim() || 'General';
          let category = formatCategoryName(rawCategory);
          
          // The description is usually the last column, or the 3rd column
          let description = $(cells[cells.length - 1]).text().replace(/\[\d+\]/g, '').trim();
          
          if (title && title.length > 3 && description) {
            scrapedSchemes.push({
              title,
              description,
              category: category.substring(0, 50), // keep it clean
              state: 'All India',
              minAge: null,
              maxAge: null,
              maxIncome: null,
              targetGender: 'Any',
              targetOccupation: 'Any',
              benefits: ['Government Support', 'Public Welfare'],
              applyLink: `https://www.google.com/search?q=${encodeURIComponent(title + " official website")}`,
              lastSyncedAt: new Date().toISOString()
            });
          }
      });
    }

    console.log(`Scraped ${scrapedSchemes.length} schemes from Wikipedia.`);

    if (scrapedSchemes.length === 0) {
       return NextResponse.json({ 
        success: false, 
        message: 'Failed to scrape Wikipedia. The table format might have changed.',
        data: [] 
      }, { status: 500 });
    }

    // Write securely to Firebase Firestore in batches
    const schemesRef = adminDb.collection('schemes');
    
    // Firestore batches have a limit of 500 writes per batch. 
    // We'll chunk the array into sizes of 400 to be safe.
    const chunks = [];
    for (let i = 0; i < scrapedSchemes.length; i += 400) {
      chunks.push(scrapedSchemes.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = adminDb.batch();
      chunk.forEach((scheme) => {
        // Create a URL-friendly, unique ID based on the title
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
      message: `Successfully synced ${scrapedSchemes.length} live schemes from Wikipedia!`,
      data: scrapedSchemes.slice(0, 10) // Only return first 10 in response to avoid huge payload
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
