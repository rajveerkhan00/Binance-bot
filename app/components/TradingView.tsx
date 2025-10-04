'use client';

import React from 'react';
import { LineChart, Play, BarChart3, Cpu } from 'lucide-react';
import { TradeSignal, MarketAnalysis } from '../types';

interface TradingViewProps {
  signal: TradeSignal;
  marketAnalysis: MarketAnalysis;
  onTradeExecute: (trade: any) => void;
  allSignals: TradeSignal[];
}

const TradingView: React.FC<TradingViewProps> = ({ 
  signal, 
  marketAnalysis, 
  onTradeExecute,
  allSignals
}) => {
  const generatePriceData = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      time: i,
      price: signal.price * (1 + Math.sin(i * 0.2) * 0.1 + (Math.random() - 0.5) * 0.02)
    }));
  };

  const priceData = generatePriceData();

  const handleExecuteTrade = () => {
    const trade = {
      id: Date.now().toString(),
      symbol: signal.symbol,
      action: signal.action,
      entryPrice: signal.price,
      quantity: 0.1,
      timestamp: new Date(),
      status: 'OPEN' as const
    };
    onTradeExecute(trade);
  };

  // Strategy breakdown
  const strategyBreakdown = {
    buy: allSignals.filter(s => s.action === 'BUY').length,
    sell: allSignals.filter(s => s.action === 'SELL').length,
    hold: allSignals.filter(s => s.action === 'HOLD').length,
    total: allSignals.length
  };

  const highConfidenceSignals = allSignals.filter(s => s.confidence >= 0.8).length;

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <LineChart className="w-6 h-6 text-accent" />
          <span>Trading View - {signal.symbol}</span>
        </h2>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
            signal.action === 'BUY' ? 'bg-profit text-white' : 
            signal.action === 'SELL' ? 'bg-loss text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            {signal.action} ({(signal.confidence * 100).toFixed(1)}%)
          </div>
          <button
            onClick={handleExecuteTrade}
            disabled={signal.action === 'HOLD'}
            className="bg-accent hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Execute Trade</span>
          </button>
        </div>
      </div>

      {/* Strategy Consensus */}
      <div className="mb-6 bg-secondary/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-accent" />
          Multi-Strategy Analysis ({strategyBreakdown.total} Strategies)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700 text-center">
            <div className="text-blue-400 text-sm">Buy Signals</div>
            <div className="text-white font-bold text-xl">{strategyBreakdown.buy}</div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-600 text-center">
            <div className="text-gray-400 text-sm">Hold Signals</div>
            <div className="text-white font-bold text-xl">{strategyBreakdown.hold}</div>
          </div>
          <div className="p-3 bg-red-900/20 rounded-lg border border-red-700 text-center">
            <div className="text-red-400 text-sm">Sell Signals</div>
            <div className="text-white font-bold text-xl">{strategyBreakdown.sell}</div>
          </div>
          <div className="p-3 bg-green-900/20 rounded-lg border border-green-700 text-center">
            <div className="text-green-400 text-sm">High Confidence</div>
            <div className="text-white font-bold text-xl">{highConfidenceSignals}</div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-gray-600">
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <path
                  d={`M 0,${200 - (priceData[0].price / Math.max(...priceData.map(p => p.price)) * 180)} ${
                    priceData.map((point, i) => 
                      `L ${(i / (priceData.length - 1)) * 400},${200 - (point.price / Math.max(...priceData.map(p => p.price)) * 180)}`
                    ).join(' ')
                  }`}
                  stroke={signal.action === 'BUY' ? '#10B981' : signal.action === 'SELL' ? '#EF4444' : '#6B7280'}
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              
              <div 
                className="absolute w-3 h-3 rounded-full border-2 border-white bg-accent"
                style={{
                  left: '95%',
                  top: `${200 - (priceData[priceData.length - 1].price / Math.max(...priceData.map(p => p.price)) * 180) - 6}px`
                }}
              ></div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4">
            <div className="text-2xl font-bold text-white">${signal.price.toFixed(2)}</div>
            <div className={`text-sm ${
              marketAnalysis.trend === 'BULLISH' ? 'text-profit' : 
              marketAnalysis.trend === 'BEARISH' ? 'text-loss' : 'text-gray-400'
            }`}>
              {marketAnalysis.trend} Market
            </div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/50 rounded-lg p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">RSI</div>
          <div className={`text-xl font-bold ${
            marketAnalysis.rsi < 30 ? 'text-profit' : 
            marketAnalysis.rsi > 70 ? 'text-loss' : 'text-white'
          }`}>
            {marketAnalysis.rsi.toFixed(1)}
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">Volatility</div>
          <div className="text-xl font-bold text-white">
            {marketAnalysis.volatility.toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">Trend Strength</div>
          <div className="text-xl font-bold text-white">
            {(marketAnalysis.strength * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">MACD</div>
          <div className={`text-sm font-bold ${
            marketAnalysis.macd.histogram > 0 ? 'text-profit' : 'text-loss'
          }`}>
            {marketAnalysis.macd.histogram > 0 ? 'Bullish' : 'Bearish'}
          </div>
        </div>
      </div>

      {/* Trade Info */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-loss/20 rounded-lg p-4 border border-loss">
          <div className="text-loss text-sm font-semibold">Stop Loss</div>
          <div className="text-white font-bold">${signal.stopLoss.toFixed(2)}</div>
        </div>
        
        <div className="bg-profit/20 rounded-lg p-4 border border-profit">
          <div className="text-profit text-sm font-semibold">Take Profit</div>
          <div className="text-white font-bold">${signal.takeProfit.toFixed(2)}</div>
        </div>
      </div>

      {/* Strategy Confidence */}
      <div className="mt-6 bg-accent/10 rounded-xl p-4 border border-accent">
        <h3 className="text-lg font-semibold text-white mb-2">Strategy Confidence</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Based on {strategyBreakdown.total} strategies</span>
          <span className={`text-lg font-bold ${
            signal.confidence >= 0.8 ? 'text-profit' : 
            signal.confidence >= 0.6 ? 'text-yellow-400' : 'text-loss'
          }`}>
            {(signal.confidence * 100).toFixed(1)}% Confidence
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradingView;