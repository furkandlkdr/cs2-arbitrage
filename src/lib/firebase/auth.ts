import {
  User,
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/client';

export type FirebaseAuthErrorCode =
  | 'auth/invalid-email'
  | 'auth/missing-password'
  | 'auth/weak-password'
  | 'auth/email-already-in-use'
  | 'auth/invalid-credential'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/unauthorized-domain'
  | 'auth/invalid-api-key'
  | 'auth/configuration-not-found'
  | 'auth/operation-not-allowed'
  | 'auth/popup-blocked'
  | 'auth/popup-closed-by-user'
  | 'auth/cancelled-popup-request'
  | 'auth/account-exists-with-different-credential'
  | 'unknown';

export function toAuthErrorCode(error: unknown): FirebaseAuthErrorCode {
  if (typeof error !== 'object' || !error || !('code' in error)) {
    return 'unknown';
  }

  const code = String((error as { code?: string }).code || 'unknown');

  if (
    code === 'auth/invalid-email' ||
    code === 'auth/missing-password' ||
    code === 'auth/weak-password' ||
    code === 'auth/email-already-in-use' ||
    code === 'auth/invalid-credential' ||
    code === 'auth/too-many-requests' ||
    code === 'auth/network-request-failed' ||
    code === 'auth/unauthorized-domain' ||
    code === 'auth/invalid-api-key' ||
    code === 'auth/configuration-not-found' ||
    code === 'auth/operation-not-allowed' ||
    code === 'auth/popup-blocked' ||
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    code === 'auth/account-exists-with-different-credential'
  ) {
    return code;
  }

  return 'unknown';
}

export function getAuthErrorMessage(code: FirebaseAuthErrorCode) {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-posta formatı geçersiz.';
    case 'auth/missing-password':
      return 'Şifre alanı boş bırakılamaz.';
    case 'auth/weak-password':
      return 'Şifre en az 8 karakter ve daha güçlü olmalı.';
    case 'auth/email-already-in-use':
      return 'Bu e-posta ile kayıtlı bir hesap zaten var.';
    case 'auth/invalid-credential':
      return 'E-posta veya şifre hatalı.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    case 'auth/network-request-failed':
      return 'Ağ bağlantısı hatası. İnternetinizi kontrol edin.';
    case 'auth/unauthorized-domain':
      return 'Bu alan adı yetkili değil. Lütfen yöneticiyle iletişime geçin.';
    case 'auth/invalid-api-key':
      return 'Firebase API anahtarı geçersiz görünüyor.';
    case 'auth/configuration-not-found':
      return 'Kimlik doğrulama yapılandırması bulunamadı.';
    case 'auth/operation-not-allowed':
      return 'Bu giriş yöntemi şu anda etkin değil.';
    case 'auth/popup-blocked':
      return 'Popup engellendi. Yönlendirme ile girişe geçiliyor.';
    case 'auth/popup-closed-by-user':
      return 'Google giriş penceresi kapatıldı.';
    case 'auth/cancelled-popup-request':
      return 'Aynı anda birden fazla giriş isteği başlatıldı. Tekrar deneyin.';
    case 'auth/account-exists-with-different-credential':
      return 'Bu e-posta farklı bir giriş yöntemiyle kayıtlı.';
    default:
      return 'İşlem sırasında beklenmeyen bir hata oluştu.';
  }
}

export async function registerWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const credential = await signInWithPopup(auth, provider);
    return credential.user;
  } catch (error) {
    const code = toAuthErrorCode(error);

    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request'
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    throw error;
  }
}

export async function resolveGoogleRedirectResult() {
  const auth = getFirebaseAuth();
  const credential = await getRedirectResult(auth);
  return credential?.user ?? null;
}

export async function logoutFromApp() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function subscribeAuthState(listener: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, listener);
}
