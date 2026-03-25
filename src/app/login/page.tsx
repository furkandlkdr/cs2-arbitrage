'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import AuthShell from '@/components/AuthShell';
import { FIREBASE_READY } from '@/lib/appConfig';
import {
  getAuthErrorMessage,
  loginWithEmail,
  loginWithGoogle,
  resolveGoogleRedirectResult,
  toAuthErrorCode,
} from '@/lib/firebase/auth';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';

const AUTH_DEBUG = process.env.NEXT_PUBLIC_AUTH_DEBUG === 'true';

function formatAuthError(error: unknown) {
  const code = toAuthErrorCode(error);
  const baseMessage = getAuthErrorMessage(code);
  return AUTH_DEBUG ? `${baseMessage} (Hata kodu: ${code})` : baseMessage;
}

export default function LoginPage() {
  useAuthSync();

  const router = useRouter();
  const { initialized, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setBusy(true);

    try {
      await loginWithGoogle();
      router.replace('/');
    } catch (caughtError) {
      setError(formatAuthError(caughtError));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleRedirectResult = async () => {
      try {
        const redirectUser = await resolveGoogleRedirectResult();
        if (mounted && redirectUser) {
          router.replace('/');
        }
      } catch (caughtError) {
        if (mounted) {
          setError(formatAuthError(caughtError));
        }
      }
    };

    void handleRedirectResult();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/');
    }
  }, [initialized, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    setBusy(true);

    try {
      await loginWithEmail(normalizedEmail, password);
      router.replace('/');
    } catch (caughtError) {
      setError(formatAuthError(caughtError));
    } finally {
      setBusy(false);
    }
  };

  if (!FIREBASE_READY) {
    return (
      <AuthShell
        title="Firebase ayarı gerekli"
        subtitle="Giriş yapabilmek için önce .env.local dosyanıza Firebase anahtarlarını ekleyin."
        footer={<Link href="/">Ana sayfaya dön</Link>}
      >
        <section className="rounded-2xl border border-[color:color-mix(in_srgb,var(--bad)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-4 py-3 text-sm text-[var(--text-primary)]">
          NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID ve NEXT_PUBLIC_FIREBASE_APP_ID alanları zorunludur.
        </section>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Tekrar hoş geldin"
      subtitle="Hesabına giriş yap ve tüm arbitraj kayıtlarını senkron kullan."
      footer={
        <>
          Hesabın yok mu?{' '}
          <Link href="/register" className="font-semibold text-[var(--sky-text)] hover:opacity-90">
            Kayıt ol
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-[var(--text-muted)]">E-posta</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ornek@mail.com"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[var(--text-muted)]">Şifre</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Şifrenizi girin"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-[color:color-mix(in_srgb,var(--bad)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_10%,transparent)] px-3 py-2 text-sm text-[var(--bad)]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-2xl bg-[linear-gradient(120deg,var(--accent),color-mix(in_srgb,var(--accent)_72%,white))] px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-contrast)] transition hover:-translate-y-0.5 hover:brightness-105"
        >
          {busy ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border-soft)]" />
          </div>
          <p className="relative mx-auto w-fit bg-[var(--surface)] px-3 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">veya</p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={handleGoogleLogin}
          className="group relative w-full overflow-hidden rounded-2xl border border-[#dadce0] bg-white px-5 py-3 text-sm font-semibold text-[#1f1f1f] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(66,133,244,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#4285f4_0%,#34a853_33%,#fbbc05_66%,#ea4335_100%)]" />
          <span className="relative flex items-center justify-center gap-3">
            <span className="relative inline-flex h-5 w-5 overflow-hidden rounded-full border border-[#dadce0]">
              <span className="absolute left-0 top-0 h-1/2 w-1/2 bg-[#4285f4]" />
              <span className="absolute right-0 top-0 h-1/2 w-1/2 bg-[#34a853]" />
              <span className="absolute left-0 bottom-0 h-1/2 w-1/2 bg-[#fbbc05]" />
              <span className="absolute right-0 bottom-0 h-1/2 w-1/2 bg-[#ea4335]" />
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </span>
            Google ile Giriş Yap
          </span>
        </button>
      </form>
    </AuthShell>
  );
}
