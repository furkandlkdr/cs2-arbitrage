'use client';

import { useEffect } from 'react';
import { useTradeStore } from '@/store/useTradeStore';
import Calculator from './Calculator';
import TradeCard from './TradeCard';
import { PlusCircle, TrendingUp, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { trades, totalBalance, setTotalBalance, addTrade } = useTradeStore();

  // Örnek veri ekleme (Gerçek uygulamada formdan gelecek)
  const handleAddSampleTrade = () => {
    const newTrade = {
      id: Math.random().toString(36).substr(2, 9),
      item_name: 'AK-47 | Redline (Field-Tested)',
      buy_price: 15.50,
      sell_price: 18.20,
      quantity: 5,
      status: 'pending' as const,
      platform_a: 'Steam',
      platform_b: 'CS Float',
      created_at: new Date().toISOString(),
      trade_lock_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün sonrası
    };
    addTrade(newTrade);
  };

  const totalProfit = trades.reduce((acc, trade) => {
    return acc + (trade.sell_price - trade.buy_price) * trade.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              CS2 Arbitraj Otomasyonu
            </h1>
            <p className="text-gray-400 mt-1">Portföyünüzü ve arbitraj fırsatlarını yönetin.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Toplam Bakiye</p>
                <p className="text-xl font-bold text-white">${totalBalance.toFixed(2)}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-800 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tahmini Kar</p>
                <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: Hesaplayıcı */}
          <div className="lg:col-span-2 space-y-8">
            <Calculator />
          </div>

          {/* Sağ Kolon: İşlem Takibi */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Aktif Pozisyonlar
                <span className="bg-gray-800 text-xs py-1 px-2 rounded-full text-gray-400">
                  {trades.length}
                </span>
              </h2>
              <button
                onClick={handleAddSampleTrade}
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md shadow-blue-900/20"
              >
                <PlusCircle className="w-4 h-4" /> Yeni Ekle
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {trades.length === 0 ? (
                <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                  <p className="text-gray-500">Henüz aktif bir işleminiz bulunmuyor.</p>
                </div>
              ) : (
                trades.map((trade) => (
                  <TradeCard key={trade.id} trade={trade} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
