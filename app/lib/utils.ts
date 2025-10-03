export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(8);
  }
};

export const formatPercent = (percent: number): string => {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculatePnL = (
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  leverage: number = 1,
  isLong: boolean = true
): { pnl: number; pnlPercent: number } => {
  const priceDiff = exitPrice - entryPrice;
  const effectiveDiff = isLong ? priceDiff : -priceDiff;
  const pnl = effectiveDiff * quantity * leverage;
  const pnlPercent = (effectiveDiff / entryPrice) * 100 * leverage;
  
  return { pnl, pnlPercent };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};