'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Cpu, Target } from 'lucide-react';
import { CoinData, TradeSignal } from '../types';

interface MarketOverviewProps {
  coins: CoinData[];
  allSignals: TradeSignal[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ coins, allSignals }) => {
  const topGainers = coins
    .filter(coin => coin.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5);

  const topLosers = coins
    .filter(coin => coin.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5);

  const highVolume = coins
    .filter(coin => coin.volume > 50000000)
    .slice(0, 5);

  // Strategy statistics
  const buySignals = allSignals.filter(s => s.action === 'BUY').length;
  const sellSignals = allSignals.filter(s => s.action === 'SELL').length;
  const totalStrategies = allSignals.length;
  const consensus = totalStrategies > 0 ? (Math.max(buySignals, sellSignals) / totalStrategies) * 100 : 0;

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-accent" />
          <span>Market Overview</span>
        </h2>
        <div className="text-sm text-gray-400 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Live Updates</span>
        </div>
      </div>

      {/* Strategy Consensus Header */}
      <div className="mb-6 bg-accent/10 rounded-xl p-4 border border-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-accent" />
            <div>
              <h3 className="text-lg font-semibold text-white">Multi-Strategy Consensus</h3>
              <p className="text-gray-400 text-sm">{totalStrategies} strategies analyzing market</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              buySignals > sellSignals ? 'text-profit' : 
              sellSignals > buySignals ? 'text-loss' : 'text-gray-400'
            }`}>
              {consensus.toFixed(0)}%
            </div>
            <div className="text-gray-400 text-sm">Agreement</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-profit" />
            Top Gainers
          </h3>
          <div className="space-y-2">
            {topGainers.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded transition-colors">
                <span className="text-white text-sm">{coin.symbol}</span>
                <span className="text-profit text-sm font-bold">+{coin.change24h.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-loss" />
            Top Losers
          </h3>
          <div className="space-y-2">
            {topLosers.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded transition-colors">
                <span className="text-white text-sm">{coin.symbol}</span>
                <span className="text-loss text-sm font-bold">{coin.change24h.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Volume */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            High Volume
          </h3>
          <div className="space-y-2">
            {highVolume.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded transition-colors">
                <span className="text-white text-sm">{coin.symbol}</span>
                <span className="text-blue-400 text-sm font-bold">
                  ${(coin.volume / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Signal Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-900/20 rounded-lg p-3 text-center border border-blue-700">
          <div className="text-blue-400 text-sm">Buy Signals</div>
          <div className="text-white font-bold text-xl">{buySignals}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-600">
          <div className="text-gray-400 text-sm">Total Strategies</div>
          <div className="text-white font-bold text-xl">{totalStrategies}</div>
        </div>
        <div className="bg-red-900/20 rounded-lg p-3 text-center border border-red-700">
          <div className="text-red-400 text-sm">Sell Signals</div>
          <div className="text-white font-bold text-xl">{sellSignals}</div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;