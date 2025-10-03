'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Shield, Database } from 'lucide-react';
import { TradeSignal } from '../types';

interface HeaderProps {
  signal: TradeSignal;
  marketStatus: string;
  lastUpdate: Date;
  totalTrades: number;
  winRate: number;
}

const Header: React.FC<HeaderProps> = ({ signal, marketStatus, lastUpdate, totalTrades, winRate }) => {
  const getSignalColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-profit profit-glow bg-green-900/20 border-profit';
      case 'SELL': return 'text-loss loss-glow bg-red-900/20 border-loss';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getSignalIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-8 h-8" />;
      case 'SELL': return <TrendingDown className="w-8 h-8" />;
      default: return <Clock className="w-8 h-8" />;
    }
  };

  return (
    <header className="glass-effect rounded-2xl p-6 mb-6 border border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left Side - Brand and Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-accent to-purple-600 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Binance Futures AI Bot
              </h1>
              <p className="text-gray-400 flex items-center space-x-2 mt-1">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Advanced Multi-Strategy Trading System</span>
                <Database className="w-4 h-4 text-blue-400" />
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 pl-6 border-l border-gray-700">
            <div className="text-center">
              <div className="text-sm text-gray-400">Total Trades</div>
              <div className="text-white font-bold text-xl">{totalTrades}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-profit font-bold text-xl">{winRate}%</div>
            </div>
          </div>
        </div>

        {/* Right Side - Market Info and Signal */}
        <div className="flex items-center space-x-6">
          {/* Market Status */}
          <div className="text-center">
            <div className="text-sm text-gray-400">Market Status</div>
            <div className="text-profit font-semibold flex items-center space-x-2 justify-center">
              <div className="w-3 h-3 bg-profit rounded-full animate-pulse-slow"></div>
              <span>{marketStatus}</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-center">
            <div className="text-sm text-gray-400">Last Update</div>
            <div className="text-white font-mono text-sm bg-gray-800 px-2 py-1 rounded">
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          {/* Main Signal */}
          <div className={`border-2 rounded-2xl p-4 min-w-[140px] transition-all duration-300 ${getSignalColor(signal.action)}`}>
            <div className="flex items-center space-x-3">
              {getSignalIcon(signal.action)}
              <div className="text-center">
                <div className="text-xs opacity-80 uppercase tracking-wider">AI SIGNAL</div>
                <div className="text-2xl font-bold">{signal.action}</div>
                <div className="text-xs opacity-80 mt-1">
                  {signal.confidence > 0 ? `${(signal.confidence * 100).toFixed(1)}% confidence` : 'Analyzing...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Details */}
      {signal.action !== 'HOLD' && (
        <div className="mt-6 grid grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-secondary/50 rounded-lg border border-gray-600">
            <div className="text-gray-400">Trade Duration</div>
            <div className="text-white font-semibold">{signal.duration}</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg border border-gray-600">
            <div className="text-gray-400">Stop Loss</div>
            <div className="text-loss font-semibold">${signal.stopLoss.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg border border-gray-600">
            <div className="text-gray-400">Take Profit</div>
            <div className="text-profit font-semibold">${signal.takeProfit.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg border border-gray-600">
            <div className="text-gray-400">Leverage</div>
            <div className="text-yellow-400 font-semibold">{signal.leverage}x</div>
          </div>
        </div>
      )}

      {/* Warning Banner */}
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-yellow-400 text-sm">
          <Shield className="w-4 h-4" />
          <span>⚠️ Trading involves risk. Always use proper risk management.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;