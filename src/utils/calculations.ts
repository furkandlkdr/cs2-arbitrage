export type TradeDirection = 's2f' | 'f2s';

export interface TradeDraft {
  type: TradeDirection;
  name: string;
  quantity: number;
  buy: number;
  sell: number;
}

export interface TradeMetrics {
  feeRate: number;
  totalBuy: number;
  grossSell: number;
  netSell: number;
  efficiency: number;
}

export interface TradeRecord extends TradeDraft, TradeMetrics {
  id: string;
  createdAt: string;
}

export interface PortfolioSummary {
  totalSpent: number;
  totalReturn: number;
  avgEfficiency: number;
}

export const FEES: Record<TradeDirection, number> = {
  s2f: 0.02,
  f2s: 0.15, // Steam (%5) + CS2 oyun (%10) — S üzerinden hesaplanır, B'den değil
};

export const DIRECTION_META: Record<
  TradeDirection,
  { label: string; feeLabel: string; shortLabel: string }
> = {
  s2f: {
    label: 'Steam -> CSFloat',
    feeLabel: '%2 komisyon',
    shortLabel: 'S -> F',
  },
  f2s: {
    label: 'CSFloat -> Steam',
    feeLabel: '%5+%10 Steam komisyonu',
    shortLabel: 'F -> S',
  },
};

/**
 * Steam Pazarı: Alıcının ödediği fiyattan (B) satıcının eline geçen tutarı (S) hesaplar.
 * B = S + floor(S × 0.05) + floor(S × 0.10), her ikisi de min $0.01
 * Tersine mühendislik ile doğru S değerini iteratif olarak bulur.
 */
export const steamNetFromGross = (gross: number): number => {
  const buyerCents = Math.round(gross * 100);
  if (buyerCents <= 0) return 0;

  const computeBuyer = (s: number): number => {
    const sf = Math.max(1, Math.floor(s * 0.05));
    const gf = Math.max(1, Math.floor(s * 0.10));
    return s + sf + gf;
  };

  // İlk tahmin: floor B/1.15 (minimum ücret efektlerinden dolayı biraz düşük/yüksek olabilir)
  let s = Math.max(1, Math.floor(buyerCents / 1.15));

  // Aşıldıysa aşağı ayarla
  while (s > 0 && computeBuyer(s) > buyerCents) {
    s--;
  }

  // Sığdığı sürece yukarı ayarla (en yüksek geçerli S'yi bul)
  while (computeBuyer(s + 1) <= buyerCents) {
    s++;
  }

  return s / 100;
};

export const roundTo = (value: number, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const formatMoney = (value: number) => `$${roundTo(value).toFixed(2)}`;

const createTradeId = () => {
  const cryptoApi = globalThis.crypto;

  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }

  if (typeof cryptoApi?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }

  return `trade-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

export const calculateTradeMetrics = ({ type, quantity, buy, sell }: Pick<TradeDraft, 'type' | 'quantity' | 'buy' | 'sell'>): TradeMetrics => {
  const normalizedQuantity = quantity > 0 ? quantity : 0;
  const totalBuy = roundTo(buy * normalizedQuantity);
  const grossSell = roundTo(sell * normalizedQuantity);

  // f2s: Steam komisyonu her eşya için ayrı ayrı hesaplanır (kuruş yuvarlama nedeniyle)
  const netSell = type === 'f2s'
    ? roundTo(steamNetFromGross(sell) * normalizedQuantity)
    : roundTo(grossSell * (1 - FEES[type]));

  // Efektif komisyon oranı (f2s için fiyata bağlı olarak hafifçe değişir ~%13.04)
  const feeRate = grossSell > 0 ? roundTo((grossSell - netSell) / grossSell, 4) : FEES[type];
  const efficiency = totalBuy > 0 ? roundTo(netSell / totalBuy, 3) : 0;

  return {
    feeRate,
    totalBuy,
    grossSell,
    netSell,
    efficiency,
  };
};

export const createTradeRecord = (draft: TradeDraft, existingId?: string): TradeRecord => ({
  ...draft,
  ...calculateTradeMetrics(draft),
  id: existingId ?? createTradeId(),
  createdAt: new Date().toISOString(),
});

export const calculatePortfolioSummary = (trades: TradeRecord[]): PortfolioSummary => {
  const totals = trades.reduce(
    (acc, trade) => {
      acc.totalSpent += trade.totalBuy;
      acc.totalReturn += trade.netSell;
      return acc;
    },
    { totalSpent: 0, totalReturn: 0 }
  );

  return {
    totalSpent: roundTo(totals.totalSpent),
    totalReturn: roundTo(totals.totalReturn),
    avgEfficiency: totals.totalSpent > 0 ? roundTo(totals.totalReturn / totals.totalSpent, 3) : 0,
  };
};
