export interface IndicatorResult {
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
}

export class TechnicalIndicators {
  static calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  static calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    let ema = prices[0];
    const multiplier = 2 / (period + 1);
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  static calculateRSI(prices: number[], period: number = 14): IndicatorResult {
    if (prices.length < period + 1) return { value: 50, signal: 'NEUTRAL', strength: 0 };
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference > 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let strength = 0;
    
    if (rsi < 30) {
      signal = 'BUY';
      strength = (30 - rsi) / 30;
    } else if (rsi > 70) {
      signal = 'SELL';
      strength = (rsi - 70) / 30;
    }
    
    return { value: rsi, signal, strength };
  }

  static calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA(prices.slice(-9).concat(macd), 9);
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }

  static calculateBollingerBands(prices: number[], period: number = 20): {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
  } {
    const sma = this.calculateSMA(prices, period);
    const variance = prices.slice(-period).reduce((sum, price) => {
      return sum + Math.pow(price - sma, 2);
    }, 0) / period;
    
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2),
      bandwidth: (stdDev * 4) / sma
    };
  }

  static calculateStochastic(prices: number[], high: number[], low: number[], period: number = 14): IndicatorResult {
    if (prices.length < period) return { value: 50, signal: 'NEUTRAL', strength: 0 };
    
    const currentPrice = prices[prices.length - 1];
    const periodHigh = Math.max(...high.slice(-period));
    const periodLow = Math.min(...low.slice(-period));
    
    const k = ((currentPrice - periodLow) / (periodHigh - periodLow)) * 100;
    
    let signal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
    let strength = 0;
    
    if (k < 20) {
      signal = 'BUY';
      strength = (20 - k) / 20;
    } else if (k > 80) {
      signal = 'SELL';
      strength = (k - 80) / 20;
    }
    
    return { value: k, signal, strength };
  }
}