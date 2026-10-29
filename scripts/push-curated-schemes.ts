import { GovTechSchemePipeline } from '../lib/pipeline/pipeline';
import { generateSlug } from '../types/scheme';

try {
  process.loadEnvFile('.env.local');
} catch {
  // Continue if .env.local does not exist or env vars already loaded
}

async function runPipelineAndPush() {
  const { adminDb: db } = await import('../lib/firebase-admin');

  console.log('Starting automated GovTech scheme sync...');

  const pipeline = new GovTechSchemePipeline();
  const result = await pipeline.runPipeline();

  console.log('Pipeline stages completed:');
  result.stages.forEach((st) => {
    console.log(`- [${st.status}] ${st.stage}: ${st.count} items (${st.details || ''})`);
  });

  const schemesRef = db.collection('schemes');
  const batchSize = 400;
  let pushedCount = 0;

  for (let i = 0; i < result.schemes.length; i += batchSize) {
    const chunk = result.schemes.slice(i, i + batchSize);
    const batch = db.batch();

    chunk.forEach((scheme) => {
      const docId = generateSlug(scheme.title);

      if (docId) {
        const docRef = schemesRef.doc(docId);
        batch.set(docRef, scheme, { merge: true });
        pushedCount++;
      }
    });

    await batch.commit();
    console.log(`Committed batch: ${pushedCount}/${result.schemes.length} schemes`);
  }

  const totalSnap = await schemesRef.count().get();
  console.log(`Pipeline finished: ${result.schemes.length} schemes updated.`);
  console.log(`Total schemes in Firestore: ${totalSnap.data().count}`);
}

runPipelineAndPush()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Pipeline failed:', err);
    process.exit(1);
  });
