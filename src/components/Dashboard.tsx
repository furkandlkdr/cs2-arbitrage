'use client';

import { useEffect, useState } from 'react';
import TradeForm from './TradeForm';
import TradeSummary from './TradeSummary';
import TradeTable from './TradeTable';
import AuthPanel from './AuthPanel';
import ThemeToggle from './ThemeToggle';
import { useTradeStore } from '@/store/useTradeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { TradeDraft, TradeRecord, calculatePortfolioSummary, createTradeRecord } from '@/utils/calculations';
import { AUTH_ENABLED } from '@/lib/appConfig';

const STORAGE_KEY = 'cs-arbitraj-local';

const defaultDraft: TradeDraft = {
  type: 's2f',
  name: '',
  buy: 0,
  sell: 0,
};

export default function Dashboard() {
  const { trades, hydrated, setTrades, addTrade, updateTrade, removeTrade, setHydrated } = useTradeStore();
  const { hydrated: authHydrated, userName, setUserName, setHydrated: setAuthHydrated } = useAuthStore();
  const [draft, setDraft] = useState<TradeDraft>(defaultDraft);
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);

  useEffect(() => {
    if (!AUTH_ENABLED) {
      setAuthHydrated(true);
      return;
    }

    try {
      const savedUser = window.localStorage.getItem('cs-arbitraj-user');
      if (savedUser) {
        setUserName(savedUser);
      }
    } finally {
      setAuthHydrated(true);
    }
  }, [setAuthHydrated, setUserName]);

  useEffect(() => {
    if (!AUTH_ENABLED || !authHydrated) {
      return;
    }

    if (userName) {
      window.localStorage.setItem('cs-arbitraj-user', userName);
      return;
    }

    window.localStorage.removeItem('cs-arbitraj-user');
  }, [authHydrated, userName]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TradeRecord[];
        setTrades(parsed);
      }
    } catch {
      setTrades([]);
    } finally {
      setHydrated(true);
    }
  }, [setHydrated, setTrades]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  }, [hydrated, trades]);

  const resetForm = () => {
    setDraft(defaultDraft);
    setEditingTradeId(null);
  };

  const submitTrade = () => {
    if (!draft.buy || !draft.sell) {
      window.alert('Lütfen fiyatları girin.');
      return;
    }

    const normalizedDraft: TradeDraft = {
      ...draft,
      name: draft.name.trim() || 'Eşya',
    };

    if (editingTradeId) {
      updateTrade(createTradeRecord(normalizedDraft, editingTradeId));
    } else {
      addTrade(createTradeRecord(normalizedDraft));
    }

    resetForm();
  };

  const handleEdit = (trade: TradeRecord) => {
    setEditingTradeId(trade.id);
    setDraft({
      type: trade.type,
      name: trade.name,
      buy: trade.buy,
      sell: trade.sell,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const summary = calculatePortfolioSummary(trades);
  const appLocked = AUTH_ENABLED && authHydrated && !userName;

  return (
    <main className="min-h-screen px-4 py-8 text-[var(--text-primary)] md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[var(--border-soft)] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)]">CS Arbitrage Tracker</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
              Steam ve CSFloat işlemlerini hesaplayın, kaydedin, düzenleyin ve tarayıcınızda saklayın.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <div className="space-y-5">
          <AuthPanel />

          <div className={appLocked ? 'pointer-events-none select-none opacity-45 blur-[1px]' : ''}>
          <TradeForm
            draft={draft}
            editing={Boolean(editingTradeId)}
            onChange={setDraft}
            onSubmit={submitTrade}
            onCancelEdit={resetForm}
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
                onDelete={(id) => {
                  removeTrade(id);
                  if (editingTradeId === id) {
                    resetForm();
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
      </div>
    </main>
  );
}
