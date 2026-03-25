'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-[var(--text-primary)] md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[color:color-mix(in_srgb,var(--sky-soft)_90%,white)] blur-3xl" />
        <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-[color:color-mix(in_srgb,var(--accent-soft)_85%,white)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl items-start justify-end">
        <ThemeToggle />
      </div>

      <section className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[36px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="relative hidden border-r border-[var(--border-soft)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--sky-soft)_70%,var(--surface)),color-mix(in_srgb,var(--accent-soft)_40%,var(--surface)))] p-8 lg:block">
            <p className="inline-flex rounded-full border border-[var(--sky-border)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sky-text)]">
              CS Arbitrage Cloud Sync
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--text-primary)]">
              Tüm işlemlerinize her cihazdan güvenli erişim.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
              Hesabınıza giriş yaptığınız anda kayıtlarınız otomatik olarak yüklenir ve her yerden aynı şekilde devam edebilirsiniz.
            </p>
            <div className="mt-10 space-y-3 text-sm text-[var(--text-secondary)]">
              <p>1. E-posta ve şifre ile hesap açın.</p>
              <p>2. İşlemlerinizi güvenle kaydedin.</p>
              <p>3. Yeni cihazda giriş yapıp kaldığınız yerden devam edin.</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              CS Arbitrage Tracker
            </Link>
            <h2 className="mt-4 text-3xl font-bold text-[var(--text-primary)]">{title}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>

            <div className="mt-8">{children}</div>
            <div className="mt-6 text-sm text-[var(--text-secondary)]">{footer}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
