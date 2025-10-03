'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TradingView from './components/TradingView';
import StrategyPanel from './components/StrategyPanel';
import CoinGrid from './components/CoinGrid';
import TradeHistory from './components/TradeHistory';
import RiskManager from './components/RiskManager';
import { TradeSignal, TradeHistory as TradeHistoryType, MarketAnalysis, CoinData } from './types';
import { TradingStrategies } from './lib/strategies';
import { generateId, calculatePnL } from './lib/utils';

// Define types
interface BinanceTicker {
  symbol: string;
  price: string;
}

interface Binance24hrStats {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
}

export default function HomePage() {
  // Trading Bot State
  const [signal, setSignal] = useState<TradeSignal>({
    symbol: 'BTCUSDT',
    action: 'HOLD',
    confidence: 0,
    price: 0,
    timestamp: new Date(),
    duration: 'N/A',
    reason: 'Initializing...',
    stopLoss: 0,
    takeProfit: 0,
    leverage: 1
  });

  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis>({
    trend: 'SIDEWAYS',
    strength: 0,
    volume: 0,
    volatility: 0,
    rsi: 50,
    macd: {
      value: 0,
      signal: 0,
      histogram: 0
    }
  });

  const [allSignals, setAllSignals] = useState<TradeSignal[]>([]);
  const [activeStrategies, setActiveStrategies] = useState<string[]>([
    'Multi-Timeframe RSI',
    'Trend Following MACD',
    'Mean Reversion BB'
  ]);

  // Trade History State
  const [trades, setTrades] = useState<TradeHistoryType[]>([]);
  const [currentTrade, setCurrentTrade] = useState<TradeHistoryType | null>(null);

  // Market Data State
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState<'CONNECTING' | 'INITIALIZING' | 'LIVE' | 'ERROR'>('CONNECTING');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Refs
  const priceHistoryRef = useRef<number[]>([]);
  const highHistoryRef = useRef<number[]>([]);
  const lowHistoryRef = useRef<number[]>([]);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Bot
  useEffect(() => {
    initializeBot();
    
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  const initializeBot = async () => {
    try {
      setIsLoading(true);
      setMarketStatus('INITIALIZING');

      await loadInitialMarketData();
      startRealTimeData();
      startAnalysisEngine();

      setMarketStatus('LIVE');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize bot:', error);
      setMarketStatus('ERROR');
      setIsLoading(false);
    }
  };

  const loadInitialMarketData = async () => {
    try {
      // Fetch BTC klines
      const klinesRes = await fetch('/api/binance?action=klines&symbol=BTCUSDT&interval=1m&limit=100');
      if (!klinesRes.ok) throw new Error('Failed to fetch klines');
      const klines = await klinesRes.json();

      if (klines.length > 0) {
        priceHistoryRef.current = klines.map((k: any) => k.close);
        highHistoryRef.current = klines.map((k: any) => k.high);
        lowHistoryRef.current = klines.map((k: any) => k.low);
        setSignal(prev => ({ ...prev, price: klines[klines.length - 1].close }));
      }

      // Load popular coins
      const popularCoins = [
        'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT',
        'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'EOSUSDT', 'XLMUSDT', 'TRXUSDT',
        'MATICUSDT', 'SOLUSDT', 'AVAXUSDT', 'ATOMUSDT', 'FTMUSDT', 'ALGOUSDT'
      ];

      const coinData: CoinData[] = [];
      const pricesRes = await fetch('/api/binance?action=all-prices');
      const allPrices = pricesRes.ok ? await pricesRes.json() : null;

      for (const symbol of popularCoins) {
        try {
          const cleanSymbol = symbol.replace('/', '').toUpperCase();
          let price: number;

          if (allPrices && allPrices[cleanSymbol]) {
            price = parseFloat(allPrices[cleanSymbol]);
          } else {
            // Fallback to individual fetch
            const priceRes = await fetch(`/api/binance?action=price&symbol=${symbol}`);
            if (!priceRes.ok) throw new Error('Price fetch failed');
            const { price: fetchedPrice } = await priceRes.json();
            price = fetchedPrice;
          }

          // Simulate 24h change
          const change24h = (Math.random() - 0.5) * 20;
          const priceChange = price * (change24h / 100);
          const volume = Math.random() * 1000000000;

          coinData.push({
            symbol,
            price,
            change24h,
            volume,
            priceChange,
            priceChangePercent: change24h,
            lastUpdate: new Date()
          });
        } catch (error) {
          console.warn(`Failed to load data for ${symbol}:`, error);
          const simulatedPrice = 100 + Math.random() * 1000;
          const change24h = (Math.random() - 0.5) * 20;
          coinData.push({
            symbol,
            price: simulatedPrice,
            change24h,
            volume: Math.random() * 1000000000,
            priceChange: simulatedPrice * (change24h / 100),
            priceChangePercent: change24h,
            lastUpdate: new Date()
          });
        }
      }

      setCoins(coinData);
    } catch (error) {
      console.error('Error loading initial market data:', error);
      const fallbackCoins: CoinData[] = [
        { symbol: 'BTCUSDT', price: 45000, change24h: 2.5, volume: 25000000000, priceChange: 1125, priceChangePercent: 2.5, lastUpdate: new Date() },
        { symbol: 'ETHUSDT', price: 3000, change24h: 1.8, volume: 15000000000, priceChange: 54, priceChangePercent: 1.8, lastUpdate: new Date() },
        { symbol: 'BNBUSDT', price: 400, change24h: -0.5, volume: 2000000000, priceChange: -2, priceChangePercent: -0.5, lastUpdate: new Date() },
        { symbol: 'ADAUSDT', price: 1.2, change24h: 5.2, volume: 800000000, priceChange: 0.062, priceChangePercent: 5.2, lastUpdate: new Date() },
        { symbol: 'XRPUSDT', price: 0.75, change24h: -1.2, volume: 1200000000, priceChange: -0.009, priceChangePercent: -1.2, lastUpdate: new Date() },
      ];
      setCoins(fallbackCoins);
      priceHistoryRef.current = Array(100).fill(0).map((_, i) => 45000 + (Math.random() - 0.5) * 1000);
      highHistoryRef.current = priceHistoryRef.current.map(p => p * 1.01);
      lowHistoryRef.current = priceHistoryRef.current.map(p => p * 0.99);
      setSignal(prev => ({ ...prev, price: 45000 }));
    }
  };

  const startRealTimeData = () => {
    // Use Binance public WebSocket (browser-compatible)
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const ticker = JSON.parse(event.data);
      const price = parseFloat(ticker.c); // 'c' = last price

      priceHistoryRef.current = [...priceHistoryRef.current.slice(-99), price];
      highHistoryRef.current = [...highHistoryRef.current.slice(-99), price * 1.001];
      lowHistoryRef.current = [...lowHistoryRef.current.slice(-99), price * 0.999];
      setSignal(prev => ({ ...prev, price }));
      setLastUpdate(new Date());
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    // Simulate other coins (optional)
    const coinUpdateInterval = setInterval(() => {
      setCoins(prev => prev.map(coin => {
        const randomChange = (Math.random() - 0.5) * 2;
        const newPrice = coin.price * (1 + randomChange / 100);
        return {
          ...coin,
          price: newPrice,
          change24h: coin.change24h + randomChange,
          priceChange: newPrice - coin.price,
          priceChangePercent: coin.change24h + randomChange,
          lastUpdate: new Date()
        };
      }));
    }, 3000);

    return () => {
      ws.close();
      clearInterval(coinUpdateInterval);
    };
  };

  const startAnalysisEngine = () => {
    analysisIntervalRef.current = setInterval(() => {
      if (priceHistoryRef.current.length >= 50) {
        performTechnicalAnalysis();
      }
    }, 5000);

    setTimeout(() => {
      if (priceHistoryRef.current.length >= 50) {
        performTechnicalAnalysis();
      }
    }, 1000);
  };

  const performTechnicalAnalysis = () => {
    try {
      const prices = priceHistoryRef.current;
      const highs = highHistoryRef.current;
      const lows = lowHistoryRef.current;

      if (prices.length < 50) return;

      const strategySignals = TradingStrategies.getAllSignals(prices, highs, lows);
      setAllSignals(strategySignals);

      const consensusSignal = TradingStrategies.getConsensusSignal(prices, highs, lows);
      setSignal(consensusSignal);

      const analysis = TradingStrategies.analyzeMarket(prices, highs, lows);
      setMarketAnalysis(analysis);
    } catch (error) {
      console.error('Error in technical analysis:', error);
    }
  };

  const handleTradeExecute = (trade: TradeHistoryType) => {
    setTrades(prev => [trade, ...prev.slice(0, 49)]);
    setCurrentTrade(null);
  };

  const handleStartTrade = () => {
    if (signal.action === 'HOLD' || signal.confidence < 0.6) {
      alert('Low confidence signal. Wait for better opportunity.');
      return;
    }

    const trade: TradeHistoryType = {
      id: generateId(),
      symbol: signal.symbol,
      action: signal.action,
      entryPrice: signal.price,
      exitPrice: signal.price,
      quantity: 0.001,
      pnl: 0,
      pnlPercent: 0,
      duration: '0s',
      status: 'OPEN',
      timestamp: new Date(),
      strategy: 'AI Consensus'
    };

    setCurrentTrade(trade);
    setTrades(prev => [trade, ...prev.slice(0, 49)]);
  };

  const handleCloseTrade = (tradeId: string, exitPrice: number) => {
    setTrades(prev => prev.map(trade => {
      if (trade.id === tradeId && trade.status === 'OPEN') {
        const isLong = trade.action === 'BUY';
        const { pnl, pnlPercent } = calculatePnL(
          trade.entryPrice,
          exitPrice,
          trade.quantity,
          signal.leverage,
          isLong
        );

        return {
          ...trade,
          exitPrice,
          pnl,
          pnlPercent,
          status: pnl >= 0 ? 'WIN' : 'LOSS',
          duration: formatTradeDuration(trade.timestamp)
        };
      }
      return trade;
    }));

    if (currentTrade?.id === tradeId) {
      setCurrentTrade(null);
    }
  };

  const formatTradeDuration = (startTime: Date): string => {
    const duration = Date.now() - startTime.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.status === 'WIN').length;
  const losingTrades = trades.filter(t => t.status === 'LOSS').length;
  const winRate = winningTrades + losingTrades > 0 
    ? Math.round((winningTrades / (winningTrades + losingTrades)) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Initializing Trading Bot</h2>
            <p className="text-gray-400">Loading market data and starting analysis engine...</p>
            <div className="mt-4 text-sm text-yellow-400">
              Status: {marketStatus}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header 
          signal={signal}
          marketStatus={marketStatus}
          lastUpdate={lastUpdate}
          totalTrades={totalTrades}
          winRate={winRate}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <TradingView 
              signal={signal}
              marketAnalysis={marketAnalysis}
              onTradeExecute={handleTradeExecute}
            />
            <StrategyPanel 
              signals={allSignals}
              activeStrategies={activeStrategies}
            />
          </div>
          <div className="space-y-6">
            <CoinGrid coins={coins} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradeHistory trades={trades} />
          <RiskManager />
        </div>

        {/* Real-time Status Bar */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass-effect rounded-full px-4 py-2 border border-gray-600 flex items-center space-x-3 text-sm shadow-lg">
            <div className={`w-2 h-2 rounded-full ${
              marketStatus === 'LIVE' ? 'bg-profit animate-pulse' : 
              marketStatus === 'ERROR' ? 'bg-loss' : 'bg-yellow-400'
            }`}></div>
            <span className="text-white font-medium">
              {marketStatus === 'LIVE' ? 'System Live' : 
               marketStatus === 'ERROR' ? 'System Error' : 'Initializing'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">Last update: {lastUpdate.toLocaleTimeString()}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">BTC: ${signal.price.toFixed(2)}</span>
            <span className="text-gray-400">•</span>
            <span className={`font-semibold ${
              signal.action === 'BUY' ? 'text-profit' : 
              signal.action === 'SELL' ? 'text-loss' : 'text-gray-400'
            }`}>
              Signal: {signal.action} ({(signal.confidence * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Emergency Overlay for Critical Errors */}
        {marketStatus === 'ERROR' && (
          <div className="fixed inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-effect rounded-2xl p-8 max-w-md text-center border border-loss shadow-xl">
              <div className="text-loss text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">System Error</h3>
              <p className="text-gray-300 mb-6">
                The trading bot has encountered a critical error. All trading activities have been suspended.
              </p>
              <button 
                onClick={initializeBot}
                className="bg-accent hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
              >
                Restart Bot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}