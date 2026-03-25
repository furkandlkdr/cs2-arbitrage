'use client';

import Link from 'next/link';
import { useState } from 'react';
import { logoutFromApp } from '@/lib/firebase/auth';
import { FIREBASE_READY } from '@/lib/appConfig';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthPanel() {
  const { initialized, user, profileName } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setError(null);
    setBusy(true);

    try {
      await logoutFromApp();
    } catch {
      setError('Çıkış yapılırken bir hata oluştu. Tekrar deneyin.');
    } finally {
      setBusy(false);
    }
  };

  if (!FIREBASE_READY) {
    return (
      <section className="rounded-[24px] border border-[color:color-mix(in_srgb,var(--bad)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-5 py-4 text-sm text-[var(--text-primary)] backdrop-blur">
        Firebase bağlantısı bulunamadı. Lütfen .env.local dosyanızı ayarlayın.
      </section>
    );
  }

  if (!initialized) {
    return (
      <section className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--text-secondary)] backdrop-blur">
        Oturum durumu yükleniyor...
      </section>
    );
  }

  if (user) {
    return (
      <section className="rounded-[24px] border border-[var(--sky-border)] bg-[var(--sky-soft)] px-5 py-4 text-sm text-[var(--text-primary)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="block font-semibold">Oturum açık</strong>
            Aktif hesap: {profileName || user.email || 'E-posta bilgisi yok'}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className="rounded-xl border border-[var(--sky-border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--sky-text)] transition hover:bg-[var(--surface-soft)]"
          >
            {busy ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-[var(--bad)]">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 text-sm text-[var(--text-primary)] backdrop-blur">
      <strong className="block font-semibold">Oturum gerekli</strong>
      <p className="mt-1 text-[var(--text-secondary)]">İşlem verilerine ulaşmak için giriş yapın veya yeni hesap oluşturun.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-2xl bg-[var(--text-primary)] px-5 py-3 font-medium text-[var(--background)] transition hover:opacity-90"
        >
          Giriş Yap
        </Link>
        <Link
          href="/register"
          className="rounded-2xl border border-[var(--accent-border)] bg-[var(--surface-elevated)] px-5 py-3 font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-soft)]"
        >
          Kayıt Ol
        </Link>
      </div>
    </section>
  );
}