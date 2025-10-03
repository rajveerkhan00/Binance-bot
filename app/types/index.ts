export interface CoinData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  priceChange: number;
  priceChangePercent: number;
  lastUpdate: Date;
}

export interface TradeSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: Date;
  duration: string;
  reason: string;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  duration: string;
  status: 'WIN' | 'LOSS' | 'OPEN';
  timestamp: Date;
  strategy: string;
}

export interface StrategyConfig {
  name: string;
  enabled: boolean;
  parameters: {
    [key: string]: number;
  };
}

export interface MarketAnalysis {
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  strength: number;
  volume: number;
  volatility: number;
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
}