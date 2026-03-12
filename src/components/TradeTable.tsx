'use client';

import { DIRECTION_META, TradeRecord, formatMoney } from '@/utils/calculations';

interface TradeTableProps {
  trades: TradeRecord[];
  onEdit: (trade: TradeRecord) => void;
  onDelete: (id: string) => void;
}

export default function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  if (trades.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center text-[var(--text-muted)] backdrop-blur">
        Henüz işlem eklenmedi. Formdan veri girip ilk kaydı oluşturabilirsiniz.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="grid gap-3 p-3 md:hidden">
        {trades.map((trade) => {
          const meta = DIRECTION_META[trade.type];
          const profitable = trade.efficiency >= 1;

          return (
            <article key={trade.id} className="rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex rounded-full border border-[var(--sky-border)] bg-[var(--sky-soft)] px-3 py-1 text-xs font-bold text-[var(--sky-text)]">
                    {meta.shortLabel}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-[var(--text-primary)]">{trade.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Adet: {trade.quantity}</p>
                </div>
                <p className={`font-mono text-sm font-semibold ${profitable ? 'text-[var(--good)]' : 'text-[var(--bad)]'}`}>
                  {trade.efficiency.toFixed(3)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Toplam Alış</p>
                  <p className="mt-2 font-mono text-[var(--text-secondary)]">{formatMoney(trade.totalBuy)}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Net Satış</p>
                  <p className="mt-2 font-mono font-semibold text-[var(--sky-text)]">{formatMoney(trade.netSell)}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(trade)}
                  className="flex-1 rounded-xl border border-[var(--sky-border)] bg-[var(--sky-soft)] px-3 py-2 text-sm font-medium text-[var(--sky-text)] transition hover:opacity-90"
                >
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(trade.id)}
                  className="flex-1 rounded-xl border border-[color:color-mix(in_srgb,var(--bad)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-3 py-2 text-sm font-medium text-[var(--bad)] transition hover:opacity-90"
                >
                  Sil
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left">
          <thead className="bg-[var(--surface-muted)]">
            <tr>
              {['Tip', 'Eşya', 'Adet', 'Toplam Alış', 'Net Satış', 'Verim', 'İşlem'].map((label) => (
                <th key={label} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const meta = DIRECTION_META[trade.type];
              const profitable = trade.efficiency >= 1;

              return (
                <tr key={trade.id} className="border-t border-[var(--border-soft)]">
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-[var(--sky-border)] bg-[var(--sky-soft)] px-3 py-1 text-xs font-bold text-[var(--sky-text)]">
                      {meta.shortLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-primary)]">{trade.name}</td>
                  <td className="px-5 py-4 font-mono text-[var(--text-secondary)]">{trade.quantity}</td>
                  <td className="px-5 py-4 font-mono text-[var(--text-secondary)]">{formatMoney(trade.totalBuy)}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-[var(--sky-text)]">{formatMoney(trade.netSell)}</td>
                  <td className={`px-5 py-4 font-mono font-semibold ${profitable ? 'text-[var(--good)]' : 'text-[var(--bad)]'}`}>
                    {trade.efficiency.toFixed(3)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(trade)}
                        className="rounded-xl border border-[var(--sky-border)] bg-[var(--sky-soft)] px-3 py-2 text-sm font-medium text-[var(--sky-text)] transition hover:opacity-90"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(trade.id)}
                        className="rounded-xl border border-[color:color-mix(in_srgb,var(--bad)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--bad)_12%,transparent)] px-3 py-2 text-sm font-medium text-[var(--bad)] transition hover:opacity-90"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}