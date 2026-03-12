'use client';

import { DIRECTION_META, FEES, TradeDirection, TradeDraft, calculateTradeMetrics, formatMoney } from '@/utils/calculations';

interface TradeFormProps {
  draft: TradeDraft;
  editing: boolean;
  onChange: (draft: TradeDraft) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

export default function TradeForm({ draft, editing, onChange, onSubmit, onCancelEdit }: TradeFormProps) {
  const metrics = calculateTradeMetrics(draft);

  const setType = (type: TradeDirection) => {
    onChange({ ...draft, type });
  };

  const setField = (field: keyof TradeDraft, value: string) => {
    if (field === 'quantity' || field === 'buy' || field === 'sell') {
      onChange({ ...draft, [field]: Number(value) || 0 });
      return;
    }

    onChange({ ...draft, [field]: value });
  };

  const note = draft.quantity > 0 && draft.buy > 0 && draft.sell > 0
    ? `${editing ? 'Güncellenirse' : 'Eklenirse'} bu işlem ${metrics.efficiency >= 1 ? 'kârlı görünüyor' : 'zarar riski taşıyor'}.`
    : 'Adet, alış ve satış fiyatlarını girdiğinizde net sonucu eklemeden önce görürsünüz.';

  return (
    <section className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.9fr)]">
        <div>
          <p className="mb-2 text-sm text-[var(--text-muted)]">İşlem Tipi</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(DIRECTION_META) as TradeDirection[]).map((type) => {
              const meta = DIRECTION_META[type];
              const active = draft.type === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setType(type)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] shadow-[inset_0_0_0_1px_var(--accent-border)]'
                      : 'border-[var(--border-soft)] bg-[var(--surface-elevated)] hover:-translate-y-0.5 hover:border-[var(--sky-border)]'
                  }`}
                >
                  <strong className="block text-base text-[var(--text-primary)]">{meta.label}</strong>
                  <span className="mt-1 block text-sm text-[var(--text-muted)]">{meta.feeLabel} ile net satış hesabı</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-muted)]">Eşya Adı</span>
              <input
                value={draft.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="Örn: AK-47 Slate"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-muted)]">Adet</span>
              <input
                type="number"
                min="1"
                step="1"
                value={draft.quantity || ''}
                onChange={(event) => setField('quantity', event.target.value)}
                placeholder="1"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-muted)]">Alış Fiyatı ($)</span>
              <input
                type="number"
                step="0.01"
                value={draft.buy || ''}
                onChange={(event) => setField('buy', event.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-muted)]">Satış Fiyatı ($)</span>
              <input
                type="number"
                step="0.01"
                value={draft.sell || ''}
                onChange={(event) => setField('sell', event.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--sky-border)] focus:ring-4 focus:ring-[var(--sky-soft)]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="mt-4 w-full rounded-2xl bg-[linear-gradient(120deg,var(--accent),color-mix(in_srgb,var(--accent)_70%,white))] px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)] transition hover:-translate-y-0.5 hover:brightness-105"
          >
            {editing ? 'İşlemi Güncelle' : 'İşlem Ekle'}
          </button>

          {editing ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="mt-3 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-3 font-medium text-[var(--text-secondary)] transition hover:opacity-90"
            >
              Düzenlemeyi İptal Et
            </button>
          ) : null}
        </div>

        <aside className="rounded-[24px] border border-[var(--sky-border)] bg-[linear-gradient(180deg,var(--surface-elevated),color-mix(in_srgb,var(--surface)_74%,var(--sky-soft)))] p-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Anlık Hesaplama</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Formdaki değerler değiştikçe önizleme otomatik hesaplanır.</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Seçilen Akış</p>
              <p className="mt-2 font-mono text-sm font-semibold text-[var(--text-primary)]">{DIRECTION_META[draft.type].label}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Adet</p>
              <p className="mt-2 font-mono text-sm font-semibold text-[var(--text-primary)]">{draft.quantity || 0}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Komisyon</p>
              <p className="mt-2 font-mono text-sm font-semibold text-[var(--text-primary)]">%{(FEES[draft.type] * 100).toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Toplam Alış</p>
              <p className="mt-2 font-mono text-sm font-semibold text-[var(--text-primary)]">{formatMoney(metrics.totalBuy)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Net Satış</p>
              <p className="mt-2 font-mono text-sm font-semibold text-[var(--sky-text)]">{formatMoney(metrics.netSell)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Verim</p>
              <p className={`mt-2 font-mono text-sm font-semibold ${metrics.efficiency >= 1 ? 'text-[var(--good)]' : 'text-[var(--bad)]'}`}>
                {metrics.efficiency.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-[var(--border-soft)] pt-4 text-sm text-[var(--text-secondary)]">{note} {draft.quantity > 0 ? `${draft.quantity} adet için` : 'Bu işlemde'} net dönüş {formatMoney(metrics.netSell)} olur.</div>
        </aside>
      </div>
    </section>
  );
}