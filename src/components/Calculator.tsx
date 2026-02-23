'use client';

import { useState } from 'react';
import { calculateDualStepArbitrage, ArbitrageStep } from '@/utils/calculations';

export default function Calculator() {
  const [initialBalance, setInitialBalance] = useState<number>(100);
  
  // Step 1 State
  const [step1, setStep1] = useState<ArbitrageStep>({
    buyPrice: 10,
    sellPrice: 12,
    quantity: 10,
    sellPlatformFee: { percentage: 15 }, // Steam fee
  });

  // Step 2 State
  const [step2, setStep2] = useState<ArbitrageStep>({
    buyPrice: 10,
    sellPrice: 11,
    quantity: 10,
    sellPlatformFee: { percentage: 2 }, // CS Float fee
  });

  const result = calculateDualStepArbitrage(initialBalance, step1, step2);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Arbitraj Hesaplayıcı</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Başlangıç Bakiyesi ($)</label>
        <input
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(Number(e.target.value))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Aşama */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">1. Aşama (Platform A -&gt; B)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alış Fiyatı ($)</label>
              <input
                type="number"
                value={step1.buyPrice}
                onChange={(e) => setStep1({ ...step1, buyPrice: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Satış Fiyatı ($)</label>
              <input
                type="number"
                value={step1.sellPrice}
                onChange={(e) => setStep1({ ...step1, sellPrice: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Adet</label>
              <input
                type="number"
                value={step1.quantity}
                onChange={(e) => setStep1({ ...step1, quantity: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Satış Platformu Komisyonu (%)</label>
              <input
                type="number"
                value={step1.sellPlatformFee.percentage}
                onChange={(e) => setStep1({ ...step1, sellPlatformFee: { percentage: Number(e.target.value) } })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* 2. Aşama */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-green-400">2. Aşama (Platform B -&gt; A)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alış Fiyatı ($)</label>
              <input
                type="number"
                value={step2.buyPrice}
                onChange={(e) => setStep2({ ...step2, buyPrice: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Satış Fiyatı ($)</label>
              <input
                type="number"
                value={step2.sellPrice}
                onChange={(e) => setStep2({ ...step2, sellPrice: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Adet</label>
              <input
                type="number"
                value={step2.quantity}
                onChange={(e) => setStep2({ ...step2, quantity: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Satış Platformu Komisyonu (%)</label>
              <input
                type="number"
                value={step2.sellPlatformFee.percentage}
                onChange={(e) => setStep2({ ...step2, sellPlatformFee: { percentage: Number(e.target.value) } })}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-white">Kümülatif Sonuç</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Başlangıç</p>
            <p className="text-xl font-bold">${result.cumulative.initialBalance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Bitiş</p>
            <p className="text-xl font-bold">${result.cumulative.finalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Net Kar</p>
            <p className={`text-xl font-bold ${result.cumulative.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${result.cumulative.netProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400">ROI</p>
            <p className={`text-xl font-bold ${result.cumulative.roiPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              %{result.cumulative.roiPercentage.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
