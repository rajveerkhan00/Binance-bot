import { TechnicalIndicators, type IndicatorResult } from './indicators';
import { type TradeSignal, type MarketAnalysis } from '../types';

export class TradingStrategies {
  private static readonly MIN_DATA_POINTS = 50;

  static multiTimeframeRSI(prices: number[], high: number[], low: number[]): TradeSignal {
    const rsi5 = TechnicalIndicators.calculateRSI(prices.slice(-5), 5);
    const rsi14 = TechnicalIndicators.calculateRSI(prices, 14);
    const rsi21 = TechnicalIndicators.calculateRSI(prices.slice(-21), 21);
    
    const currentPrice = prices[prices.length - 1];
    const sma20 = TechnicalIndicators.calculateSMA(prices, 20);
    
    let buySignals = 0;
    let sellSignals = 0;
    let totalConfidence = 0;
    
    // RSI Signals
    if (rsi5.signal === 'BUY') { buySignals++; totalConfidence += rsi5.strength; }
    if (rsi5.signal === 'SELL') { sellSignals++; totalConfidence += rsi5.strength; }
    
    if (rsi14.signal === 'BUY') { buySignals++; totalConfidence += rsi14.strength; }
    if (rsi14.signal === 'SELL') { sellSignals++; totalConfidence += rsi14.strength; }
    
    if (rsi21.signal === 'BUY') { buySignals++; totalConfidence += rsi21.strength; }
    if (rsi21.signal === 'SELL') { sellSignals++; totalConfidence += rsi21.strength; }
    
    // Price vs SMA
    if (currentPrice > sma20 * 1.02) { buySignals++; totalConfidence += 0.2; }
    if (currentPrice < sma20 * 0.98) { sellSignals++; totalConfidence += 0.2; }
    
    const confidence = Math.min(totalConfidence / 4, 0.95);
    const action = buySignals > sellSignals ? 'BUY' : sellSignals > buySignals ? 'SELL' : 'HOLD';
    
    const stopLoss = action === 'BUY' ? currentPrice * 0.98 : currentPrice * 1.02;
    const takeProfit = action === 'BUY' ? currentPrice * 1.04 : currentPrice * 0.96;
    
    return {
      symbol: 'BTCUSDT',
      action,
      confidence: action === 'HOLD' ? 0 : confidence,
      price: currentPrice,
      timestamp: new Date(),
      duration: '15m-1h',
      reason: `Multi-timeframe RSI: ${buySignals}B/${sellSignals}S signals`,
      stopLoss,
      takeProfit,
      leverage: 3
    };
  }

  static trendFollowingMACD(prices: number[]): TradeSignal {
    const macd = TechnicalIndicators.calculateMACD(prices);
    const ema9 = TechnicalIndicators.calculateEMA(prices, 9);
    const ema21 = TechnicalIndicators.calculateEMA(prices, 21);
    const currentPrice = prices[prices.length - 1];
    
    let buySignals = 0;
    let sellSignals = 0;
    let totalConfidence = 0;
    
    // MACD Signals
    if (macd.macd > macd.signal && macd.histogram > 0) {
      buySignals++;
      totalConfidence += Math.min(Math.abs(macd.histogram) * 100, 0.3);
    }
    if (macd.macd < macd.signal && macd.histogram < 0) {
      sellSignals++;
      totalConfidence += Math.min(Math.abs(macd.histogram) * 100, 0.3);
    }
    
    // EMA Crossover
    if (ema9 > ema21) {
      buySignals++;
      totalConfidence += 0.2;
    } else {
      sellSignals++;
      totalConfidence += 0.2;
    }
    
    // Price position
    if (currentPrice > ema21) {
      buySignals++;
      totalConfidence += 0.1;
    } else {
      sellSignals++;
      totalConfidence += 0.1;
    }
    
    const confidence = Math.min(totalConfidence / 3, 0.9);
    const action = buySignals > sellSignals ? 'BUY' : sellSignals > buySignals ? 'SELL' : 'HOLD';
    
    const stopLoss = action === 'BUY' ? currentPrice * 0.97 : currentPrice * 1.03;
    const takeProfit = action === 'BUY' ? currentPrice * 1.06 : currentPrice * 0.94;
    
    return {
      symbol: 'BTCUSDT',
      action,
      confidence: action === 'HOLD' ? 0 : confidence,
      price: currentPrice,
      timestamp: new Date(),
      duration: '1h-4h',
      reason: `Trend Following: MACD ${macd.histogram > 0 ? 'Bullish' : 'Bearish'}, EMA${ema9 > ema21 ? ' Bull' : ' Bear'}`,
      stopLoss,
      takeProfit,
      leverage: 5
    };
  }

  static meanReversionBB(prices: number[], high: number[], low: number[]): TradeSignal {
    const bb = TechnicalIndicators.calculateBollingerBands(prices, 20);
    const rsi = TechnicalIndicators.calculateRSI(prices, 14);
    const stochastic = TechnicalIndicators.calculateStochastic(prices, high, low, 14);
    const currentPrice = prices[prices.length - 1];
    
    let buySignals = 0;
    let sellSignals = 0;
    let totalConfidence = 0;
    
    // Bollinger Bands
    if (currentPrice < bb.lower) {
      buySignals++;
      totalConfidence += Math.min((bb.lower - currentPrice) / bb.lower * 1000, 0.4);
    }
    if (currentPrice > bb.upper) {
      sellSignals++;
      totalConfidence += Math.min((currentPrice - bb.upper) / bb.upper * 1000, 0.4);
    }
    
    // RSI
    if (rsi.signal === 'BUY') {
      buySignals++;
      totalConfidence += rsi.strength;
    }
    if (rsi.signal === 'SELL') {
      sellSignals++;
      totalConfidence += rsi.strength;
    }
    
    // Stochastic
    if (stochastic.signal === 'BUY') {
      buySignals++;
      totalConfidence += stochastic.strength;
    }
    if (stochastic.signal === 'SELL') {
      sellSignals++;
      totalConfidence += stochastic.strength;
    }
    
    const confidence = Math.min(totalConfidence / 3, 0.85);
    const action = buySignals > sellSignals ? 'BUY' : sellSignals > buySignals ? 'SELL' : 'HOLD';
    
    const stopLoss = action === 'BUY' ? currentPrice * 0.99 : currentPrice * 1.01;
    const takeProfit = bb.middle;
    
    return {
      symbol: 'BTCUSDT',
      action,
      confidence: action === 'HOLD' ? 0 : confidence,
      price: currentPrice,
      timestamp: new Date(),
      duration: '5m-15m',
      reason: `Mean Reversion: BB${currentPrice < bb.lower ? ' Oversold' : ' Overbought'}, RSI:${rsi.value.toFixed(1)}`,
      stopLoss,
      takeProfit,
      leverage: 2
    };
  }

  static analyzeMarket(prices: number[], high: number[], low: number[]): MarketAnalysis {
    const rsi = TechnicalIndicators.calculateRSI(prices, 14);
    const macd = TechnicalIndicators.calculateMACD(prices);
    const bb = TechnicalIndicators.calculateBollingerBands(prices);
    
    // Trend analysis
    const sma20 = TechnicalIndicators.calculateSMA(prices, 20);
    const sma50 = TechnicalIndicators.calculateSMA(prices, 50);
    const currentPrice = prices[prices.length - 1];
    
    let trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' = 'SIDEWAYS';
    let strength = 0;
    
    if (currentPrice > sma20 && sma20 > sma50) {
      trend = 'BULLISH';
      strength = 0.7;
    } else if (currentPrice < sma20 && sma20 < sma50) {
      trend = 'BEARISH';
      strength = 0.7;
    } else {
      strength = 0.3;
    }
    
    // Volatility calculation
    const priceChanges = prices.slice(1).map((price, i) => Math.abs((price - prices[i]) / prices[i]));
    const volatility = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
    
    return {
      trend,
      strength,
      volume: 0, // Would need volume data
      volatility: volatility * 100,
      rsi: rsi.value,
      macd: {
        value: macd.macd,
        signal: macd.signal,
        histogram: macd.histogram
      }
    };
  }

  static getAllSignals(prices: number[], high: number[], low: number[]): TradeSignal[] {
    return [
      this.multiTimeframeRSI(prices, high, low),
      this.trendFollowingMACD(prices),
      this.meanReversionBB(prices, high, low)
    ];
  }

  static getConsensusSignal(prices: number[], high: number[], low: number[]): TradeSignal {
    const signals = this.getAllSignals(prices, high, low);
    const validSignals = signals.filter(s => s.action !== 'HOLD');
    
    if (validSignals.length === 0) {
      return {
        symbol: 'BTCUSDT',
        action: 'HOLD',
        confidence: 0,
        price: prices[prices.length - 1],
        timestamp: new Date(),
        duration: 'N/A',
        reason: 'No clear consensus across strategies',
        stopLoss: 0,
        takeProfit: 0,
        leverage: 1
      };
    }
    
    const buySignals = validSignals.filter(s => s.action === 'BUY');
    const sellSignals = validSignals.filter(s => s.action === 'SELL');
    
    const totalConfidence = validSignals.reduce((sum, s) => sum + s.confidence, 0);
    const avgConfidence = totalConfidence / validSignals.length;
    
    const action = buySignals.length > sellSignals.length ? 'BUY' : 'SELL';
    const consensusCount = Math.max(buySignals.length, sellSignals.length);
    
    return {
      symbol: 'BTCUSDT',
      action,
      confidence: avgConfidence * (consensusCount / validSignals.length),
      price: prices[prices.length - 1],
      timestamp: new Date(),
      duration: '15m-4h',
      reason: `Consensus: ${consensusCount}/${validSignals.length} strategies agree`,
      stopLoss: action === 'BUY' ? prices[prices.length - 1] * 0.98 : prices[prices.length - 1] * 1.02,
      takeProfit: action === 'BUY' ? prices[prices.length - 1] * 1.03 : prices[prices.length - 1] * 0.97,
      leverage: 3
    };
  }
}