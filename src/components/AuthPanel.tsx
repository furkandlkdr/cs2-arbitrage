'use client';

import { FormEvent, useState } from 'react';
import { AUTH_ENABLED } from '@/lib/appConfig';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthPanel() {
  const { hydrated, userName, setUserName } = useAuthStore();
  const [draftName, setDraftName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = draftName.trim();

    if (!normalized) {
      return;
    }

    setUserName(normalized);
    setDraftName('');
  };

  if (!AUTH_ENABLED) {
    return null;
  }

  if (!hydrated) {
    return (
      <section className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--text-secondary)] backdrop-blur">
        Oturum durumu yükleniyor...
      </section>
    );
  }

  if (userName) {
    return (
      <section className="rounded-[24px] border border-[var(--sky-border)] bg-[var(--sky-soft)] px-5 py-4 text-sm text-[var(--text-primary)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <strong className="block font-semibold">Oturum açık</strong>
            Aktif kullanıcı: {userName}
          </div>
          <button
            type="button"
            onClick={() => setUserName(null)}
            className="rounded-xl border border-[var(--sky-border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--sky-text)] transition hover:bg-[var(--surface-soft)]"
          >
            Çıkış Yap
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 text-sm text-[var(--text-primary)] backdrop-blur">
      <strong className="block font-semibold">Giriş yapın</strong>
      <p className="mt-1 text-[var(--text-secondary)]">Bu mod etkinse işlem listeniz bu tarayıcıdaki oturumla kullanılır.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          placeholder="Kullanıcı adı"
          className="min-w-0 flex-1 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)]"
        />
        <button
          type="submit"
          className="rounded-2xl bg-[var(--text-primary)] px-5 py-3 font-medium text-[var(--background)] transition hover:opacity-90"
        >
          Giriş Yap
        </button>
      </form>
    </section>
  );
}