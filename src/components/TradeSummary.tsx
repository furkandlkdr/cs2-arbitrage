import { PortfolioSummary, formatMoney } from '@/utils/calculations';

interface TradeSummaryProps {
  summary: PortfolioSummary;
}

export default function TradeSummary({ summary }: TradeSummaryProps) {
  const cards = [
    { label: 'Toplam Harcanan', value: formatMoney(summary.totalSpent), tone: 'text-[var(--text-primary)]' },
    { label: 'Net Dönüş (Satış)', value: formatMoney(summary.totalReturn), tone: 'text-[var(--sky-text)]' },
    { label: 'Genel Oran', value: summary.avgEfficiency.toFixed(3), tone: 'text-[var(--accent)]' },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface)] p-5 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur"
        >
          <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
          <p className={`mt-3 font-mono text-3xl font-bold ${card.tone}`}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}