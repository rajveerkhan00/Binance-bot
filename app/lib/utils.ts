import { CoinData } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  leverage: number = 1,
  isLong: boolean = true
): { pnl: number; pnlPercent: number } {
  const priceDiff = exitPrice - entryPrice;
  const directionalPriceDiff = isLong ? priceDiff : -priceDiff;
  const pnl = directionalPriceDiff * quantity * leverage;
  const invested = entryPrice * quantity;
  const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  
  return { pnl, pnlPercent };
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return '$' + price.toFixed(2);
  } else if (price >= 1) {
    return '$' + price.toFixed(4);
  } else if (price >= 0.01) {
    return '$' + price.toFixed(6);
  } else {
    return '$' + price.toFixed(8);
  }
}

export function formatPercent(value: number): string {
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

export function calculateRiskReward(entryPrice: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  return reward / risk;
}

export function formatDuration(duration: string): string {
  return duration || 'N/A';
}

export function calculatePortfolioValue(portfolio: { [key: string]: number }, coins: CoinData[]): number {
  return Object.entries(portfolio).reduce((total, [symbol, quantity]) => {
    const coin = coins.find(c => c.symbol === symbol);
    return total + (coin ? coin.price * quantity : 0);
  }, 0);
}

export function generateSignalStrength(confidence: number): string {
  if (confidence >= 0.9) return 'Very Strong';
  if (confidence >= 0.7) return 'Strong';
  if (confidence >= 0.5) return 'Moderate';
  return 'Weak';
}