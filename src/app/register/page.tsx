'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import AuthShell from '@/components/AuthShell';
import { FIREBASE_READY } from '@/lib/appConfig';
import { getAuthErrorMessage, loginWithGoogle, registerWithEmail, toAuthErrorCode } from '@/lib/firebase/auth';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function RegisterPage() {
  useAuthSync();

  const router = useRouter();
  const { initialized, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleRegister = async () => {
    setError(null);
    setBusy(true);

    try {
      await loginWithGoogle();
      router.replace('/');
    } catch (caughtError) {
      setError(getAuthErrorMessage(toAuthErrorCode(caughtError)));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialized && user) {
      router.replace('/');
    }
  }, [initialized, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password || !confirmPassword) {
      setError('Tüm alanları doldurun.');
      return;
    }

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      setError('Şifre en az 8 karakter olmalı, büyük harf, küçük harf ve rakam içermelidir.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setBusy(true);

    try {
      await registerWithEmail(normalizedEmail, password);
      router.replace('/');
    } catch (caughtError) {
      setError(getAuthErrorMessage(toAuthErrorCode(caughtError)));
    } finally {
      setBusy(false);
    }
  };

  if (!FIREBASE_READY) {
    return (
      <AuthShell
        title="Kayıt şu anda kullanılamıyor"
        subtitle="Sistem ayarları tamamlandığında birkaç saniyede hesabınızı oluşturabilirsiniz."
        footer={<Link href="/">Ana sayfaya dön</Link>}
      >
        <section className="rounded-2xl border border-[color:color-mix(in_srgb,var(--bad)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-4 py-3 text-sm text-[var(--text-primary)]">
          Kayıt altyapısı henüz hazır değil. Lütfen birazdan tekrar deneyin.
        </section>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Yeni hesap oluştur"
      subtitle="İşlemlerinizi tüm cihazlarınızdan kolayca görüntüleyin ve yönetin."
      footer={
        <>
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="font-semibold text-[var(--sky-text)] hover:opacity-90">
            Giriş yap
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Güçlü bir şifre seçin"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-[var(--text-muted)]">Şifre Tekrar</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Şifrenizi tekrar yazın"
            className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
          />
        </label>

        <p className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--text-secondary)]">
          Güvenliğiniz için güçlü bir şifre kullanmanızı öneririz.
        </p>

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
          {busy ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
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
          onClick={handleGoogleRegister}
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
            Google ile Devam Et
          </span>
        </button>
      </form>
    </AuthShell>
  );
}
