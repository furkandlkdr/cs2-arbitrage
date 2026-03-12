export type TradeDirection = 's2f' | 'f2s';

export interface TradeDraft {
  type: TradeDirection;
  name: string;
  buy: number;
  sell: number;
}

export interface TradeMetrics {
  feeRate: number;
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

export const calculateTradeMetrics = ({ type, buy, sell }: Pick<TradeDraft, 'type' | 'buy' | 'sell'>): TradeMetrics => {
  const feeRate = FEES[type];
  const netSell = roundTo(sell * (1 - feeRate));
  const efficiency = buy > 0 ? roundTo(netSell / buy, 3) : 0;

  return {
    feeRate,
    netSell,
    efficiency,
  };
};

export const createTradeRecord = (draft: TradeDraft, existingId?: string): TradeRecord => ({
  ...draft,
  ...calculateTradeMetrics(draft),
  id: existingId ?? crypto.randomUUID(),
  createdAt: new Date().toISOString(),
});

export const calculatePortfolioSummary = (trades: TradeRecord[]): PortfolioSummary => {
  const totals = trades.reduce(
    (acc, trade) => {
      acc.totalSpent += trade.buy;
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
