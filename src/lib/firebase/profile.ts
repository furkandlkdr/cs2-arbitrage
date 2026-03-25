import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';

export interface UserProfile {
  displayName: string;
  email: string | null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const reference = doc(getFirestoreDb(), 'users', uid);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<UserProfile>;

  if (!data.displayName || typeof data.displayName !== 'string') {
    return null;
  }

  return {
    displayName: data.displayName,
    email: typeof data.email === 'string' ? data.email : null,
  };
}

export async function upsertUserProfile(uid: string, profile: UserProfile) {
  const reference = doc(getFirestoreDb(), 'users', uid);

  await setDoc(
    reference,
    {
      displayName: profile.displayName,
      email: profile.email,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
