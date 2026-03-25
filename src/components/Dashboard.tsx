'use client';

import { useEffect, useState } from 'react';
import { FIREBASE_READY } from '@/lib/appConfig';
import { subscribeToTrades, upsertTrade, deleteTrade } from '@/lib/firebase/trades';
import { getUserProfile, upsertUserProfile } from '@/lib/firebase/profile';
import { useAuthSync } from '@/hooks/useAuthSync';
import TradeForm from './TradeForm';
import TradeSummary from './TradeSummary';
import TradeTable from './TradeTable';
import AuthPanel from './AuthPanel';
import ThemeToggle from './ThemeToggle';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { TradeDraft, TradeRecord, calculatePortfolioSummary, createTradeRecord } from '@/utils/calculations';

const defaultDraft: TradeDraft = {
  type: 's2f',
  name: '',
  quantity: 1,
  buy: 0,
  sell: 0,
};

export default function Dashboard() {
  useAuthSync();

  const { trades, hydrated, setTrades, addTrade, updateTrade, removeTrade, setHydrated } = useTradeStore();
  const { initialized: authInitialized, user, profileName, setProfileName } = useAuthStore();
  const [draft, setDraft] = useState<TradeDraft>(defaultDraft);
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState('');
  const [profileBusy, setProfileBusy] = useState(false);
  const [submitBusy, setSubmitBusy] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setProfileName(null);
      setProfileDraft('');
      return;
    }

    const suggestedName = user.googleDisplayName?.trim()
      || user.email?.split('@')[0]?.trim()
      || '';

    const hydrateProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);

        if (cancelled) {
          return;
        }

        if (profile?.displayName) {
          setProfileName(profile.displayName);
          setProfileDraft(profile.displayName);
          return;
        }

        setProfileName(null);
        setProfileDraft(suggestedName);
      } catch {
        if (!cancelled) {
          setProfileName(null);
          setProfileDraft(suggestedName);
        }
      }
    };

    void hydrateProfile();

    return () => {
      cancelled = true;
    };
  }, [setProfileName, user]);

  useEffect(() => {
    if (!FIREBASE_READY) {
      setHydrated(true);
      return;
    }

    if (!authInitialized) {
      return;
    }

    if (!user) {
      setTrades([]);
      setHydrated(true);
      setSyncError(null);
      return;
    }

    setHydrated(false);
    setSyncError(null);

    const unsubscribe = subscribeToTrades(
      user.uid,
      (nextTrades) => {
        setTrades(nextTrades);
        setHydrated(true);
      },
      () => {
        setSyncError('Veriler yüklenirken bir hata oluştu. Sayfayı yenileyip tekrar deneyin.');
        setHydrated(true);
      }
    );

    return unsubscribe;
  }, [authInitialized, setHydrated, setTrades, user]);

  const resetForm = () => {
    setDraft(defaultDraft);
    setEditingTradeId(null);
  };

  const submitTrade = async () => {
    if (!draft.quantity || !draft.buy || !draft.sell) {
      window.alert('Lütfen adet ve fiyatları girin.');
      return;
    }

    if (!user) {
      window.alert('İşlem kaydetmek için önce giriş yapmalısınız.');
      return;
    }

    if (!profileName) {
      window.alert('Lütfen önce profil adınızı tamamlayın.');
      return;
    }

    const normalizedDraft: TradeDraft = {
      ...draft,
      name: draft.name.trim() || 'Eşya',
    };

    const existingTrade = editingTradeId ? trades.find((trade) => trade.id === editingTradeId) : undefined;
    const createdTrade = createTradeRecord(normalizedDraft, editingTradeId || undefined);
    const tradeToSave = existingTrade
      ? {
          ...createdTrade,
          createdAt: existingTrade.createdAt,
        }
      : createdTrade;

    setSubmitBusy(true);
    setSyncError(null);

    try {
      if (editingTradeId) {
        updateTrade(tradeToSave);
      } else {
        addTrade(tradeToSave);
      }

      await upsertTrade(user.uid, tradeToSave);
      resetForm();
    } catch {
      setSyncError('İşlem kaydedilirken bir hata oluştu. Tekrar deneyin.');
    } finally {
      setSubmitBusy(false);
    }
  };

  const saveProfileName = async () => {
    if (!user) {
      return;
    }

    const normalized = profileDraft.trim();

    if (normalized.length < 2) {
      setSyncError('Profil adı en az 2 karakter olmalıdır.');
      return;
    }

    setProfileBusy(true);
    setSyncError(null);

    try {
      await upsertUserProfile(user.uid, {
        displayName: normalized,
        email: user.email,
      });
      setProfileName(normalized);
      setProfileDraft(normalized);
    } catch {
      setSyncError('Profil adı kaydedilirken bir hata oluştu. Tekrar deneyin.');
    } finally {
      setProfileBusy(false);
    }
  };

  const handleEdit = (trade: TradeRecord) => {
    setEditingTradeId(trade.id);
    setDraft({
      type: trade.type,
      name: trade.name,
      quantity: trade.quantity,
      buy: trade.buy,
      sell: trade.sell,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const summary = calculatePortfolioSummary(trades);
  const profileMissing = Boolean(user && !profileName);
  const appLocked = !FIREBASE_READY || !authInitialized || !user || profileMissing;

  return (
    <main className="min-h-screen px-4 py-8 text-[var(--text-primary)] md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[var(--border-soft)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">CS Arbitrage Tracker</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
              Steam ve CSFloat işlemlerini hesaplayın, kaydedin, düzenleyin ve Firebase ile tüm cihazlarda senkron takip edin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <div className="space-y-5">
          <AuthPanel />

          {user && !profileName ? (
            <section className="rounded-[24px] border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 text-sm text-[var(--text-primary)] backdrop-blur">
              <strong className="block text-base font-semibold">Profil adınızı tamamlayın</strong>
              <p className="mt-1 text-[var(--text-secondary)]">
                Google hesabınızdan gelen ad otomatik dolduruldu. İsterseniz düzenleyip kaydedin.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={profileDraft}
                  onChange={(event) => setProfileDraft(event.target.value)}
                  placeholder="Örn: Furkan"
                  className="min-w-0 flex-1 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                />
                <button
                  type="button"
                  onClick={saveProfileName}
                  disabled={profileBusy}
                  className="rounded-2xl bg-[var(--text-primary)] px-5 py-3 font-medium text-[var(--background)] transition hover:opacity-90"
                >
                  {profileBusy ? 'Kaydediliyor...' : 'Profili Kaydet'}
                </button>
              </div>
            </section>
          ) : null}

          {syncError ? (
            <section className="rounded-[22px] border border-[color:color-mix(in_srgb,var(--bad)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-4 py-3 text-sm text-[var(--text-primary)]">
              {syncError}
            </section>
          ) : null}

          <div className={appLocked ? 'pointer-events-none select-none opacity-45 blur-[1px]' : ''}>
          <TradeForm
            draft={draft}
            editing={Boolean(editingTradeId)}
            onChange={setDraft}
            onSubmit={submitTrade}
            onCancelEdit={resetForm}
            busy={submitBusy}
          />
          </div>

          <div className={appLocked ? 'pointer-events-none select-none opacity-45 blur-[1px]' : ''}>
            <TradeSummary summary={summary} />
          </div>

          {hydrated ? (
            <div className={appLocked ? 'pointer-events-none select-none opacity-45 blur-[1px]' : ''}>
              <TradeTable
                trades={trades}
                onEdit={handleEdit}
                deletingId={deleteBusyId}
                onDelete={async (id) => {
                  if (!user) {
                    return;
                  }

                  const previousTrade = trades.find((trade) => trade.id === id);
                  if (!previousTrade) {
                    return;
                  }

                  removeTrade(id);
                  setDeleteBusyId(id);

                  if (editingTradeId === id) {
                    resetForm();
                  }

                  try {
                    await deleteTrade(user.uid, id);
                  } catch {
                    addTrade(previousTrade);
                    setSyncError('İşlem silinirken bir hata oluştu. Tekrar deneyin.');
                  } finally {
                    setDeleteBusyId(null);
                  }
                }}
              />
            </div>
          ) : (
              <section className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center text-[var(--text-muted)] backdrop-blur">
                Kayıtlar yükleniyor...
            </section>
          )}
        </div>

          <footer className="mt-8 border-t border-[var(--border-soft)] pt-5 text-center text-sm text-[var(--text-muted)]">
            Made with ❤️ by{' '}
            <a
              href="https://www.furkan.software/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--sky-text)] transition hover:opacity-80"
            >
              Nafair
            </a>
          </footer>
      </div>
    </main>
  );
}
