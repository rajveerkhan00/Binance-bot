'use client';

import React, { useEffect, useState } from 'react';
import { Play, Square, TrendingUp, AlertTriangle, Target, Clock, DollarSign } from 'lucide-react';
import { TradeSignal, TradeHistory, MarketAnalysis } from '../types';
import { formatPrice, formatPercent, calculatePnL, generateId } from '../lib/utils';

interface TradingViewProps {
  signal: TradeSignal;
  marketAnalysis: MarketAnalysis;
  onTradeExecute: (trade: TradeHistory) => void;
}

const TradingView: React.FC<TradingViewProps> = ({ 
  signal, 
  marketAnalysis, 
  onTradeExecute 
}) => {
  const [isTrading, setIsTrading] = useState(false);
  const [currentTrade, setCurrentTrade] = useState<TradeHistory | null>(null);
  const [tradeStartTime, setTradeStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState<string>('0s');
  const [currentPnL, setCurrentPnL] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTrading && tradeStartTime && currentTrade) {
      interval = setInterval(() => {
        const duration = Date.now() - tradeStartTime.getTime();
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        setCurrentDuration(minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`);
        
        // Calculate real-time PnL
        const isLong = currentTrade.action === 'BUY';
        const { pnl } = calculatePnL(
          currentTrade.entryPrice,
          signal.price,
          currentTrade.quantity,
          signal.leverage,
          isLong
        );
        setCurrentPnL(pnl);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTrading, tradeStartTime, currentTrade, signal.price]);

  const handleStartTrade = () => {
    if (signal.action === 'HOLD' || signal.confidence < 0.6) {
      alert('🚫 Low confidence signal. Wait for better opportunity.');
      return;
    }

    const trade: TradeHistory = {
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
    setIsTrading(true);
    setTradeStartTime(new Date());
    setCurrentPnL(0);
  };

  const handleCloseTrade = () => {
    if (!currentTrade) return;

    const exitPrice = signal.price;
    const isLong = currentTrade.action === 'BUY';
    const { pnl, pnlPercent } = calculatePnL(
      currentTrade.entryPrice,
      exitPrice,
      currentTrade.quantity,
      signal.leverage,
      isLong
    );

    const closedTrade: TradeHistory = {
      ...currentTrade,
      exitPrice,
      pnl,
      pnlPercent,
      duration: currentDuration,
      status: pnl >= 0 ? 'WIN' : 'LOSS'
    };

    onTradeExecute(closedTrade);
    setCurrentTrade(null);
    setIsTrading(false);
    setTradeStartTime(null);
    setCurrentDuration('0s');
    setCurrentPnL(0);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'BULLISH': return 'text-profit';
      case 'BEARISH': return 'text-loss';
      default: return 'text-yellow-400';
    }
  };

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return 'text-profit';
    if (rsi > 70) return 'text-loss';
    return 'text-yellow-400';
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Trading Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full ${getTrendColor(marketAnalysis.trend)} bg-opacity-20 border ${getTrendColor(marketAnalysis.trend)} border-opacity-30`}>
            {marketAnalysis.trend} Market
          </div>
          <div className="text-sm text-gray-400">
            Strength: {(marketAnalysis.strength * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Market Analysis */}
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span>Market Analysis</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">RSI (14)</span>
                <span className={getRSIColor(marketAnalysis.rsi)}>
                  {marketAnalysis.rsi.toFixed(1)}
                  {marketAnalysis.rsi < 30 && ' (Oversold)'}
                  {marketAnalysis.rsi > 70 && ' (Overbought)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">MACD Histogram</span>
                <span className={marketAnalysis.macd.histogram > 0 ? 'text-profit' : 'text-loss'}>
                  {marketAnalysis.macd.histogram.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volatility</span>
                <span className="text-yellow-400">{marketAnalysis.volatility.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trend Strength</span>
                <div className="w-24 bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getTrendColor(marketAnalysis.trend)}`}
                    style={{ width: `${marketAnalysis.strength * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3">Signal Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Strategy:</span>
                <span className="text-white">Multi-Strategy Consensus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reason:</span>
                <span className="text-white text-right">{signal.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confidence:</span>
                <span className="text-white">{signal.confidence > 0 ? (signal.confidence * 100).toFixed(1) + '%' : 'Calculating...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Trading Controls */}
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Trade Controls</span>
            </h3>
            
            {!isTrading ? (
              <div className="space-y-4">
                <button
                  onClick={handleStartTrade}
                  disabled={signal.action === 'HOLD' || signal.confidence < 0.6}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    signal.action !== 'HOLD' && signal.confidence >= 0.6
                      ? 'bg-profit hover:bg-green-500 text-white profit-glow'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  <span>Start {signal.action} Trade</span>
                </button>
                
                {signal.action === 'HOLD' && (
                  <div className="text-center p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-yellow-400 text-sm">No clear trading signal. Waiting for better opportunity.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-gray-400 text-sm">Duration</div>
                    <div className="text-white font-bold flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentDuration}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${currentPnL >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <div className="text-gray-400 text-sm">Current PnL</div>
                    <div className={`font-bold ${currentPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ${currentPnL.toFixed(4)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseTrade}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    currentPnL >= 0 
                      ? 'bg-profit hover:bg-green-500 text-white' 
                      : 'bg-loss hover:bg-red-500 text-white'
                  }`}
                >
                  <Square className="w-5 h-5" />
                  <span>Close Trade ({currentPnL >= 0 ? 'WIN' : 'LOSS'})</span>
                </button>

                <div className="text-center p-2 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <p className="text-blue-400 text-xs">
                    Trade Active: {currentTrade?.action} {currentTrade?.symbol} @ ${currentTrade?.entryPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3">Risk Management</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Position Size:</span>
                <span className="text-white">0.001 BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Risk per Trade:</span>
                <span className="text-white">2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Drawdown:</span>
                <span className="text-white">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;