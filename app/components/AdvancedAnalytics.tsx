'use client';

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity, Target } from 'lucide-react';
import { CoinData, TradeSignal, TradeHistory as TradeHistoryType } from '../types';

interface AdvancedAnalyticsProps {
  coins: CoinData[];
  trades: TradeHistoryType[];
  signals: TradeSignal[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ coins, trades, signals }) => {
  const profitableTrades = trades.filter(t => t.status === 'WIN').length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  
  const totalVolume = coins.reduce((sum, coin) => sum + coin.volume, 0);
  const averageChange = coins.reduce((sum, coin) => sum + coin.change24h, 0) / coins.length;
  
  const buySignals = signals.filter(s => s.action === 'BUY').length;
  const sellSignals = signals.filter(s => s.action === 'SELL').length;
  const holdSignals = signals.filter(s => s.action === 'HOLD').length;

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          <span>Advanced Analytics</span>
        </h2>
        <div className="text-sm text-gray-400">
          Real-time Market Insights
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {/* Market Overview Cards */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Total Coins</div>
              <div className="text-2xl font-bold text-white">{coins.length}</div>
            </div>
            <PieChart className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Tracking 1000+ assets
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Market Volume</div>
              <div className="text-2xl font-bold text-white">
                ${(totalVolume / 1000000).toFixed(0)}M
              </div>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 text-xs text-gray-400">
            24h trading volume
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Avg Change</div>
              <div className={`text-2xl font-bold ${
                averageChange >= 0 ? 'text-profit' : 'text-loss'
              }`}>
                {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
              </div>
            </div>
            {averageChange >= 0 ? (
              <TrendingUp className="w-8 h-8 text-profit" />
            ) : (
              <TrendingDown className="w-8 h-8 text-loss" />
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Market sentiment
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Win Rate</div>
              <div className="text-2xl font-bold text-profit">{winRate.toFixed(1)}%</div>
            </div>
            <Target className="w-8 h-8 text-profit" />
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {profitableTrades}/{totalTrades} trades
          </div>
        </div>
      </div>

      {/* Strategy Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Signal Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Buy Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-profit"></div>
                <span className="text-white font-bold">{buySignals}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sell Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-loss"></div>
                <span className="text-white font-bold">{sellSignals}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hold Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-white font-bold">{holdSignals}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
          <div className="space-y-2">
            {coins
              .filter(coin => coin.change24h > 10)
              .slice(0, 5)
              .map((coin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white text-sm">{coin.symbol}</span>
                  <span className="text-profit text-sm">+{coin.change24h.toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-accent/10 rounded-lg p-3 text-center">
          <div className="text-white font-bold text-lg">50+</div>
          <div className="text-gray-400 text-sm">Strategies</div>
        </div>
        <div className="bg-accent/10 rounded-lg p-3 text-center">
          <div className="text-white font-bold text-lg">1000+</div>
          <div className="text-gray-400 text-sm">Coins</div>
        </div>
        <div className="bg-accent/10 rounded-lg p-3 text-center">
          <div className="text-white font-bold text-lg">24/7</div>
          <div className="text-gray-400 text-sm">Monitoring</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;