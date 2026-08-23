import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GovTechSchemePipeline } from '../lib/pipeline/pipeline';

// Load .env.local manually if not in process.env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    let multilineKey: string | null = null;
    let multilineVal: string[] = [];

    for (const line of lines) {
      if (multilineKey) {
        multilineVal.push(line);
        if (line.includes('-----END PRIVATE KEY-----') || line.endsWith('"')) {
          process.env[multilineKey] = (multilineVal || []).join('\n').replace(/^"/, '').replace(/"\s*$/, '').replace(/\\n/g, '\n');
          multilineKey = null;
          multilineVal = [];
        }
        continue;
      }

      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const rawValue = match[2].trim();

        if (rawValue.startsWith('"') && !rawValue.endsWith('"')) {
          multilineKey = key;
          multilineVal = [rawValue];
        } else {
          process.env[key] = rawValue.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n');
        }
      }
    }
  }
}

loadEnv();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin credentials in .env.local');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

async function runPipelineAndPush() {
  console.log(`=======================================================`);
  console.log(`🏛️ 10-STAGE AUTOMATED GOVTECH SCHEME INTELLIGENCE PIPELINE`);
  console.log(`=======================================================\n`);
  console.log(`📁 Target Project: ${projectId}`);
  console.log(`📑 Collection: schemes\n`);

  const pipeline = new GovTechSchemePipeline();
  const result = await pipeline.runPipeline();

  console.log('\n--- PIPELINE EXECUTION STAGES ---');
  result.stages.forEach((st) => {
    console.log(`[${st.status.toUpperCase()}] ${st.stage} -> ${st.count} items (${st.details || ''})`);
  });

  const schemesRef = db.collection('schemes');
  const batchSize = 400;
  let pushedCount = 0;

  for (let i = 0; i < result.schemes.length; i += batchSize) {
    const chunk = result.schemes.slice(i, i + batchSize);
    const batch = db.batch();

    chunk.forEach((scheme) => {
      const docId = scheme.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .substring(0, 100);

      if (docId) {
        const docRef = schemesRef.doc(docId);
        batch.set(docRef, scheme, { merge: true });
        pushedCount++;
      }
    });

    await batch.commit();
    console.log(`\n💾 Batch committed: ${pushedCount}/${result.schemes.length} schemes into Firestore`);
  }

  const totalSnap = await schemesRef.count().get();
  console.log(`\n🎉 PIPELINE SUCCESS: ${result.schemes.length} schemes fully enriched & stored!`);
  console.log(`📊 Total schemes in Firestore database: ${totalSnap.data().count}`);
}

runPipelineAndPush()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Pipeline failed:', err);
    process.exit(1);
  });
