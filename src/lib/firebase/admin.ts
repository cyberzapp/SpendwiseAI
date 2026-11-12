import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let adminAuthInstance: Auth | null = null;
let adminDbInstance: Firestore | null = null;

try {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      adminApp = initializeApp();
    }
  } else {
    adminApp = getApps()[0];
  }

  if (adminApp) {
    adminAuthInstance = getAuth(adminApp);
    adminDbInstance = getFirestore(adminApp);
  }
} catch (err) {
  // Graceful fallback for build-time environments without admin credentials
  console.warn('Firebase Admin initialization deferred/mocked for current environment.');
}

export const adminAuth = adminAuthInstance;
export const adminDb = adminDbInstance;
