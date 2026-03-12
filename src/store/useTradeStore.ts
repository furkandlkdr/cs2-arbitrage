import { create } from 'zustand';
import { TradeRecord } from '@/utils/calculations';

interface TradeState {
  trades: TradeRecord[];
  hydrated: boolean;
  setTrades: (trades: TradeRecord[]) => void;
  addTrade: (trade: TradeRecord) => void;
  updateTrade: (trade: TradeRecord) => void;
  removeTrade: (id: string) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: [],
  hydrated: false,
  setTrades: (trades) => set({ trades }),
  addTrade: (trade) => set((state) => ({ trades: [...state.trades, trade] })),
  updateTrade: (trade) =>
    set((state) => ({
      trades: state.trades.map((current) => (current.id === trade.id ? trade : current)),
    })),
  removeTrade: (id) => set((state) => ({ trades: state.trades.filter((trade) => trade.id !== id) })),
  setHydrated: (hydrated) => set({ hydrated }),
}));
