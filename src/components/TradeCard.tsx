'use client';

import { useEffect, useState } from 'react';
import { Trade, useTradeStore } from '@/store/useTradeStore';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
}

export default function TradeCard({ trade }: TradeCardProps) {
  const { updateTradeStatus, removeTrade } = useTradeStore();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!trade.trade_lock_end || trade.status === 'completed') return;

    const calculateTimeLeft = () => {
      const endDate = parseISO(trade.trade_lock_end!);
      const now = new Date();
      
      if (now >= endDate) {
        setTimeLeft('Takas Edilebilir');
        return;
      }

      const days = differenceInDays(endDate, now);
      const hours = differenceInHours(endDate, now) % 24;
      const minutes = differenceInMinutes(endDate, now) % 60;

      setTimeLeft(`${days}g ${hours}s ${minutes}d`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Her dakika güncelle

    return () => clearInterval(interval);
  }, [trade.trade_lock_end, trade.status]);

  const profit = (trade.sell_price - trade.buy_price) * trade.quantity;
  const isProfitable = profit >= 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{trade.item_name}</h3>
          <p className="text-sm text-gray-400">
            {trade.platform_a} -&gt; {trade.platform_b}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          trade.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
        }`}>
          {trade.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Alış Fiyatı</p>
          <p className="text-sm font-medium text-white">${trade.buy_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Satış Fiyatı</p>
          <p className="text-sm font-medium text-white">${trade.sell_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Adet</p>
          <p className="text-sm font-medium text-white">{trade.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tahmini Kar</p>
          <p className={`text-sm font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
            ${profit.toFixed(2)}
          </p>
        </div>
      </div>

      {trade.trade_lock_end && trade.status === 'pending' && (
        <div className="flex items-center gap-2 mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">
            Takas Banı: <strong className="text-blue-400">{timeLeft}</strong>
          </span>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        {trade.status === 'pending' && (
          <button
            onClick={() => updateTradeStatus(trade.id, 'completed')}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Tamamla
          </button>
        )}
        <button
          onClick={() => removeTrade(trade.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <XCircle className="w-4 h-4" /> Sil
        </button>
      </div>
    </div>
  );
}
