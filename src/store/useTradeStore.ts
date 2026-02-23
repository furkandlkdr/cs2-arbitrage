import { create } from 'zustand';

export interface Trade {
  id: string;
  item_name: string;
  buy_price: number;
  sell_price: number;
  quantity: number;
  status: 'pending' | 'completed';
  platform_a: string;
  platform_b: string;
  created_at: string;
  trade_lock_end?: string; // 7 günlük takas banı bitiş tarihi
}

interface TradeState {
  trades: Trade[];
  totalBalance: number;
  setTotalBalance: (balance: number) => void;
  addTrade: (trade: Trade) => void;
  updateTradeStatus: (id: string, status: 'pending' | 'completed') => void;
  removeTrade: (id: string) => void;
  setTrades: (trades: Trade[]) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: [],
  totalBalance: 0,
  setTotalBalance: (balance) => set({ totalBalance: balance }),
  addTrade: (trade) => set((state) => ({ trades: [...state.trades, trade] })),
  updateTradeStatus: (id, status) =>
    set((state) => ({
      trades: state.trades.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
  removeTrade: (id) =>
    set((state) => ({ trades: state.trades.filter((t) => t.id !== id) })),
  setTrades: (trades) => set({ trades }),
}));
