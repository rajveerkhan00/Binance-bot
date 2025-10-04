'use client';

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Activity, Target, Cpu, Users, Zap } from 'lucide-react';
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
  const totalStrategies = signals.length;
  const highConfidenceSignals = signals.filter(s => s.confidence >= 0.8).length;

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          <span>Advanced Analytics</span>
        </h2>
        <div className="text-sm text-gray-400 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-accent" />
          <span>{totalStrategies} Strategies Active</span>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="mb-6 bg-accent/10 rounded-xl p-4 border border-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-accent" />
            <div>
              <h3 className="text-lg font-semibold text-white">Multi-Strategy Performance</h3>
              <p className="text-gray-400 text-sm">Real-time analysis from {totalStrategies} trading strategies</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{highConfidenceSignals}</div>
            <div className="text-gray-400 text-sm">High Confidence</div>
          </div>
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
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-accent" />
            Strategy Signal Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Buy Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-profit"></div>
                <span className="text-white font-bold">{buySignals}</span>
                <span className="text-gray-400 text-sm">
                  ({((buySignals / totalStrategies) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sell Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-loss"></div>
                <span className="text-white font-bold">{sellSignals}</span>
                <span className="text-gray-400 text-sm">
                  ({((sellSignals / totalStrategies) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hold Signals</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-white font-bold">{holdSignals}</span>
                <span className="text-gray-400 text-sm">
                  ({((holdSignals / totalStrategies) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">High Confidence</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-white font-bold">{highConfidenceSignals}</span>
                <span className="text-gray-400 text-sm">
                  ({((highConfidenceSignals / totalStrategies) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-accent" />
            Top Performers
          </h3>
          <div className="space-y-2">
            {coins
              .filter(coin => coin.change24h > 10)
              .slice(0, 5)
              .map((coin, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded transition-colors">
                  <span className="text-white text-sm">{coin.symbol}</span>
                  <span className="text-profit text-sm font-bold">+{coin.change24h.toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Strategy Metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-accent/10 rounded-lg p-3 text-center border border-accent">
          <Cpu className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-white font-bold text-lg">{totalStrategies}</div>
          <div className="text-gray-400 text-sm">Strategies</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500">
          <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-bold text-lg">1000+</div>
          <div className="text-gray-400 text-sm">Coins</div>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-white font-bold text-lg">{highConfidenceSignals}</div>
          <div className="text-gray-400 text-sm">High Confidence</div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3 text-center border border-purple-500">
          <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-white font-bold text-lg">24/7</div>
          <div className="text-gray-400 text-sm">Monitoring</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;