export interface PlatformFee {
  percentage: number; // e.g., 15 for Steam, 2 for CS Float
  fixed?: number; // e.g., 0.00 for some platforms
}

export interface ArbitrageStep {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  sellPlatformFee: PlatformFee;
}

export interface ArbitrageResult {
  totalInvestment: number;
  grossRevenue: number;
  netRevenue: number;
  netProfit: number;
  roiPercentage: number;
  dustBalance: number;
}

/**
 * Yuvarlama hatalarını önlemek için hassas yuvarlama fonksiyonu (2 ondalık basamak)
 */
export const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Tek bir arbitraj adımının (Platform A -> B) hesaplamasını yapar.
 */
export const calculateStep = (
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  sellPlatformFee: PlatformFee
): ArbitrageResult => {
  const totalInvestment = roundToTwo(buyPrice * quantity);
  const grossRevenue = roundToTwo(sellPrice * quantity);
  
  const feePercentageAmount = grossRevenue * (sellPlatformFee.percentage / 100);
  const feeFixedAmount = (sellPlatformFee.fixed || 0) * quantity;
  const totalFee = roundToTwo(feePercentageAmount + feeFixedAmount);
  
  const netRevenue = roundToTwo(grossRevenue - totalFee);
  const netProfit = roundToTwo(netRevenue - totalInvestment);
  
  const roiPercentage = totalInvestment > 0 ? roundToTwo((netProfit / totalInvestment) * 100) : 0;

  return {
    totalInvestment,
    grossRevenue,
    netRevenue,
    netProfit,
    roiPercentage,
    dustBalance: 0, // Bu adımda kullanılmıyor, kümülatif hesaplamada kullanılacak
  };
};

/**
 * Çift aşamalı arbitrajın (Platform A -> B -> A) kümülatif hesaplamasını yapar.
 * @param initialBalance Başlangıç bakiyesi
 * @param step1 Birinci aşama verileri
 * @param step2 İkinci aşama verileri
 */
export const calculateDualStepArbitrage = (
  initialBalance: number,
  step1: ArbitrageStep,
  step2: ArbitrageStep
) => {
  // 1. Aşama Hesaplaması
  const step1Result = calculateStep(
    step1.buyPrice,
    step1.sellPrice,
    step1.quantity,
    step1.sellPlatformFee
  );

  // 1. Aşama sonrası artan bakiye (Dust Balance)
  const step1DustBalance = roundToTwo(initialBalance - step1Result.totalInvestment);

  // 2. Aşama için kullanılabilir bakiye (1. aşamadan elde edilen net gelir + artan bakiye)
  const availableBalanceForStep2 = roundToTwo(step1Result.netRevenue + step1DustBalance);

  // 2. Aşama Hesaplaması
  const step2Result = calculateStep(
    step2.buyPrice,
    step2.sellPrice,
    step2.quantity,
    step2.sellPlatformFee
  );

  // 2. Aşama sonrası artan bakiye (Dust Balance)
  const finalDustBalance = roundToTwo(availableBalanceForStep2 - step2Result.totalInvestment);

  // Kümülatif Sonuçlar
  const cumulativeNetRevenue = roundToTwo(step2Result.netRevenue + finalDustBalance);
  const cumulativeNetProfit = roundToTwo(cumulativeNetRevenue - initialBalance);
  const cumulativeRoiPercentage = initialBalance > 0 ? roundToTwo((cumulativeNetProfit / initialBalance) * 100) : 0;

  return {
    step1: {
      ...step1Result,
      dustBalance: step1DustBalance,
    },
    step2: {
      ...step2Result,
      dustBalance: finalDustBalance,
    },
    cumulative: {
      initialBalance,
      finalBalance: cumulativeNetRevenue,
      netProfit: cumulativeNetProfit,
      roiPercentage: cumulativeRoiPercentage,
    },
  };
};
