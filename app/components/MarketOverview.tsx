'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { CoinData } from '../types';

interface MarketOverviewProps {
  coins: CoinData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ coins }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-profit" />
            Top Gainers
          </h3>
          <div className="space-y-2">
            {topGainers.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded">
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
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded">
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
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded">
                <span className="text-white text-sm">{coin.symbol}</span>
                <span className="text-blue-400 text-sm font-bold">
                  ${(coin.volume / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;