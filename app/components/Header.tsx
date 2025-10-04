'use client';

import React from 'react';
import { Activity, Wifi, WifiOff, TrendingUp, TrendingDown, BarChart3, Wallet, ShoppingCart } from 'lucide-react';
import { TradeSignal } from '../types';

interface HeaderProps {
  signal: TradeSignal;
  marketStatus: 'CONNECTING' | 'INITIALIZING' | 'LIVE' | 'ERROR';
  lastUpdate: Date;
  totalTrades: number;
  winRate: number;
  onFilterChange: (filter: 'all' | 'buy' | 'sell') => void;
  currentFilter: 'all' | 'buy' | 'sell';
  activeTab: 'trading' | 'analytics' | 'portfolio';
  onTabChange: (tab: 'trading' | 'analytics' | 'portfolio') => void;
  totalBalance: number;
}

const Header: React.FC<HeaderProps> = ({ 
  signal, 
  marketStatus, 
  lastUpdate, 
  totalTrades, 
  winRate,
  onFilterChange,
  currentFilter,
  activeTab,
  onTabChange,
  totalBalance
}) => {
  const getStatusColor = () => {
    switch (marketStatus) {
      case 'LIVE': return 'text-profit';
      case 'ERROR': return 'text-loss';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = () => {
    switch (marketStatus) {
      case 'LIVE': return <Wifi className="w-5 h-5" />;
      case 'ERROR': return <WifiOff className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Bot Status */}
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-secondary/50 ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Trading Bot v2.0</h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
              <span className={`text-sm ${getStatusColor()}`}>
                {marketStatus === 'LIVE' ? 'SYSTEM LIVE' : 
                 marketStatus === 'ERROR' ? 'SYSTEM ERROR' : 'INITIALIZING'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400 text-sm">
                Last: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-secondary/50 rounded-xl p-1">
          <button
            onClick={() => onTabChange('trading')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'trading' 
                ? 'bg-accent text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Trading</span>
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'analytics' 
                ? 'bg-accent text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onTabChange('portfolio')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'portfolio' 
                ? 'bg-accent text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>

        {/* Right Section - Stats & Filters */}
        <div className="flex items-center space-x-6">
          {/* Trading Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-gray-400 text-sm">Balance</div>
              <div className="text-lg font-bold text-white">${totalBalance.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm">Trades</div>
              <div className="text-lg font-bold text-white">{totalTrades}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-sm">Win Rate</div>
              <div className="text-lg font-bold text-profit">{winRate}%</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 bg-secondary/50 rounded-xl p-1">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentFilter === 'all' 
                  ? 'bg-accent text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Coins
            </button>
            <button
              onClick={() => onFilterChange('buy')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                currentFilter === 'buy' 
                  ? 'bg-profit text-white' 
                  : 'text-gray-400 hover:text-profit'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>100% Buy</span>
            </button>
            <button
              onClick={() => onFilterChange('sell')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                currentFilter === 'sell' 
                  ? 'bg-loss text-white' 
                  : 'text-gray-400 hover:text-loss'
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              <span>100% Sell</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Signal & Strategy Info */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-lg font-bold ${
              signal.action === 'BUY' ? 'text-profit' : 
              signal.action === 'SELL' ? 'text-loss' : 'text-gray-400'
            }`}>
              {signal.action} Signal ({(signal.confidence * 100).toFixed(1)}%)
            </div>
            <div className="text-gray-400 text-sm">
              {signal.symbol} • ${signal.price.toFixed(2)}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-gray-400">
              Stop: <span className="text-loss">${signal.stopLoss.toFixed(2)}</span>
            </div>
            <div className="text-gray-400">
              Target: <span className="text-profit">${signal.takeProfit.toFixed(2)}</span>
            </div>
            <div className="text-gray-400">
              Leverage: <span className="text-yellow-400">{signal.leverage}x</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-gray-400 text-sm">
          Strategy: {signal.reason}
        </div>
      </div>
    </div>
  );
};

export default Header;