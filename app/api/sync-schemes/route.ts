import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GovTechSchemePipeline } from '@/lib/pipeline/pipeline';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST() {
  try {
    const pipeline = new GovTechSchemePipeline();
    const result = await pipeline.runPipeline();

    if (!result.success || result.schemes.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No schemes could be harvested through the pipeline.',
        logs: result.logs,
        stages: result.stages
      }, { status: 500 });
    }

    const schemesRef = adminDb.collection('schemes');

    // Batch write to Firestore (chunked in 400s)
    const chunks = [];
    for (let i = 0; i < result.schemes.length; i += 400) {
      chunks.push(result.schemes.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = adminDb.batch();
      chunk.forEach((scheme) => {
        const docId = scheme.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
          .substring(0, 100);

        if (docId) {
          const docRef = schemesRef.doc(docId);
          batch.set(docRef, scheme, { merge: true });
        }
      });
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Automated Pipeline completed successfully! Harvested, normalized, and extracted rules for ${result.schemes.length} schemes across Maharashtra & Central portals.`,
      totalSynced: result.schemes.length,
      stages: result.stages,
      logs: result.logs,
      preview: result.schemes.slice(0, 5)
    });

  } catch (error: unknown) {
    console.error('Pipeline error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error during pipeline sync';
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
