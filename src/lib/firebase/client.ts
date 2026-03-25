import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@/lib/appConfig';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firestoreDb: Firestore | null = null;

function createFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (!FIREBASE_API_KEY || !FIREBASE_AUTH_DOMAIN || !FIREBASE_PROJECT_ID || !FIREBASE_APP_ID) {
    throw new Error('Firebase environment variables are missing.');
  }

  firebaseApp = getApps()[0] ?? initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  });

  return firebaseApp;
}

export function getFirebaseAuth() {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  firebaseAuth = getAuth(createFirebaseApp());
  return firebaseAuth;
}

export function getFirestoreDb() {
  if (firestoreDb) {
    return firestoreDb;
  }

  firestoreDb = getFirestore(createFirebaseApp());
  return firestoreDb;
}
