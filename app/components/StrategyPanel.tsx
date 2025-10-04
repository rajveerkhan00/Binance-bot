'use client';

import React from 'react';
import { Zap, Cpu, TrendingUp, Repeat, CheckCircle, XCircle, Navigation, Activity, BarChart3 } from 'lucide-react';
import { TradeSignal } from '../types';

interface StrategyPanelProps {
  signals: TradeSignal[];
  activeStrategies: string[];
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ signals, activeStrategies }) => {
  const strategies = [
    {
      name: 'Multi-Timeframe RSI',
      description: 'Combines RSI signals from 5, 14, and 21 periods',
      icon: <Repeat className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700'
    },
    {
      name: 'Trend Following MACD',
      description: 'Uses MACD histogram and EMA crossovers',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700'
    },
    {
      name: 'Mean Reversion BB',
      description: 'Bollinger Bands with RSI confirmation',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700'
    },
    {
      name: 'Volume-Weighted MACD',
      description: 'MACD weighted by trading volume',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700'
    },
    {
      name: 'Ichimoku Cloud',
      description: 'Cloud-based trend analysis',
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20',
      borderColor: 'border-pink-700'
    },
    {
      name: 'Supertrend Strategy',
      description: 'ATR-based trend following',
      icon: <Navigation className="w-5 h-5" />,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/20',
      borderColor: 'border-teal-700'
    },
    {
      name: 'Parabolic SAR',
      description: 'Stop and reversal points',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700'
    },
    {
      name: 'ADX Momentum',
      description: 'Directional movement index',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700'
    }
  ];

  const getStrategySignal = (strategyName: string): TradeSignal | undefined => {
    const strategyMap: { [key: string]: string } = {
      'Multi-Timeframe RSI': 'Multi-timeframe RSI',
      'Trend Following MACD': 'Trend Following',
      'Mean Reversion BB': 'Mean Reversion',
      'Volume-Weighted MACD': 'Volume-Weighted MACD',
      'Ichimoku Cloud': 'Ichimoku Cloud',
      'Supertrend Strategy': 'Supertrend',
      'Parabolic SAR': 'Parabolic SAR',
      'ADX Momentum': 'ADX Momentum'
    };
    
    return signals.find(signal => 
      signal.reason.includes(strategyMap[strategyName])
    );
  };

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-profit bg-green-900/30 border-profit';
      case 'SELL': return 'text-loss bg-red-900/30 border-loss';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-accent" />
          <span>Trading Strategies</span>
        </h2>
        <div className="text-sm text-gray-400">
          {activeStrategies.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((strategy, index) => {
          const signal = getStrategySignal(strategy.name);
          const isActive = activeStrategies.includes(strategy.name);
          
          return (
            <div 
              key={index}
              className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                isActive 
                  ? `${strategy.bgColor} ${strategy.borderColor} glow-effect` 
                  : 'bg-gray-900/30 border-gray-600 opacity-60'
              }`}
            >
              {/* Strategy Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${strategy.bgColor} ${strategy.color}`}>
                    {strategy.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{strategy.name}</h3>
                    <div className="flex items-center space-x-1">
                      {isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-profit" />
                          <span className="text-xs text-profit">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-loss" />
                          <span className="text-xs text-loss">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Description */}
              <p className="text-gray-400 text-xs mb-3">
                {strategy.description}
              </p>

              {/* Signal Output */}
              {signal && (
                <div className={`mt-2 p-2 rounded-lg text-center border ${getSignalColor(signal.action)}`}>
                  <div className="text-xs font-semibold">{signal.action}</div>
                  <div className="text-xs opacity-80">
                    {signal.confidence > 0 ? (signal.confidence * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                </div>
              )}

              {/* Strategy Details */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{signal?.duration || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Leverage:</span>
                  <span className="text-yellow-400">{signal?.leverage || 'N/A'}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Analysis */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Strategy Consensus</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700">
            <div className="text-blue-400 text-sm">Buy Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'BUY').length}
            </div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
            <div className="text-gray-400 text-sm">Hold Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'HOLD').length}
            </div>
          </div>
          <div className="p-3 bg-red-900/20 rounded-lg border border-red-700">
            <div className="text-red-400 text-sm">Sell Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'SELL').length}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent">
          <div className="text-white text-sm text-center">
            <strong>Final Decision:</strong> Based on weighted consensus of all active strategies
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyPanel;