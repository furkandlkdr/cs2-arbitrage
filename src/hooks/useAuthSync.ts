'use client';

import { useEffect } from 'react';
import { subscribeAuthState } from '@/lib/firebase/auth';
import { FIREBASE_READY } from '@/lib/appConfig';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthSync() {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    if (!FIREBASE_READY) {
      setInitialized(true);
      setUser(null);
      return;
    }

    const unsubscribe = subscribeAuthState((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          googleDisplayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }

      setInitialized(true);
    });

    return unsubscribe;
  }, [setInitialized, setUser]);
}
