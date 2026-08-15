import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // Default initialization fallback
      initializeApp();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase admin initialization notice:', error.message);
    } else {
      console.error('Firebase admin initialization notice:', error);
    }
  }
}

const adminDb = getFirestore();

export { adminDb };
