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
  f2s: 0.1393,
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
    feeLabel: '%13.93 komisyon',
    shortLabel: 'F -> S',
  },
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
  const feeRate = FEES[type];
  const normalizedQuantity = quantity > 0 ? quantity : 0;
  const totalBuy = roundTo(buy * normalizedQuantity);
  const grossSell = roundTo(sell * normalizedQuantity);
  const netSell = roundTo(grossSell * (1 - feeRate));
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

export const calculateSteamSellerReceive = (buyerPays: number): number => {
  const buyerPaysCents = Math.round(buyerPays * 100);
  let result = 0;

  for (let sCents = 1; sCents < buyerPaysCents; sCents++) {
    const steamFee = Math.max(1, Math.floor(sCents * 0.05));
    const cs2Fee = Math.max(1, Math.floor(sCents * 0.10));
    const total = sCents + steamFee + cs2Fee;

    if (total === buyerPaysCents) {
      result = sCents;
    } else if (total > buyerPaysCents) {
      break;
    }
  }

  return result / 100;
};

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
