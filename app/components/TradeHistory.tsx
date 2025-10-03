'use client';

import React from 'react';
import { History, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { TradeHistory as TradeHistoryType } from '../types';
import { formatPrice, formatPercent } from '../lib/utils';

interface TradeHistoryProps {
  trades: TradeHistoryType[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WIN': return 'text-profit bg-green-900/20 border-profit';
      case 'LOSS': return 'text-loss bg-red-900/20 border-loss';
      case 'OPEN': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WIN': return <CheckCircle className="w-4 h-4" />;
      case 'LOSS': return <XCircle className="w-4 h-4" />;
      case 'OPEN': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    return action === 'BUY' ? 'text-profit' : 'text-loss';
  };

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.status === 'WIN').length;
  const losingTrades = trades.filter(t => t.status === 'LOSS').length;
  const openTrades = trades.filter(t => t.status === 'OPEN').length;
  const winRate = totalTrades > 0 ? (winningTrades / (winningTrades + losingTrades)) * 100 : 0;
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <History className="w-6 h-6 text-accent" />
          <span>Trade History</span>
        </h2>
        
        {/* Statistics */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-gray-400">Total PnL</div>
            <div className={`font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
              ${totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Win Rate</div>
            <div className="text-profit font-bold">{winRate.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">Total Trades</div>
            <div className="text-white font-bold">{totalTrades}</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
          <div className="text-profit font-bold text-xl">{winningTrades}</div>
          <div className="text-green-400 text-sm">Winning</div>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-center">
          <div className="text-loss font-bold text-xl">{losingTrades}</div>
          <div className="text-red-400 text-sm">Losing</div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 text-center">
          <div className="text-yellow-400 font-bold text-xl">{openTrades}</div>
          <div className="text-yellow-400 text-sm">Open</div>
        </div>
        <div className={`border rounded-lg p-3 text-center ${
          totalPnL >= 0 ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
        }`}>
          <div className={`font-bold text-xl ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
            ${totalPnL.toFixed(2)}
          </div>
          <div className={totalPnL >= 0 ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
            Total PnL
          </div>
        </div>
      </div>

      {/* Trade History Table */}
      <div className="overflow-hidden">
        {trades.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No trades yet. Start trading to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {trades.slice().reverse().map((trade) => (
              <div 
                key={trade.id}
                className="bg-secondary/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Trade Basic Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg border ${getStatusColor(trade.status)}`}>
                      {getStatusIcon(trade.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${getActionColor(trade.action)}`}>
                          {trade.action} {trade.symbol}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{trade.strategy}</span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {trade.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Trade Details */}
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="text-sm text-gray-400">Entry/Exit</div>
                      <div className="text-white text-sm">
                        ${formatPrice(trade.entryPrice)} → ${formatPrice(trade.exitPrice)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="text-white text-sm">{trade.duration}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400">PnL</div>
                      <div className={`font-semibold ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(4)}
                      </div>
                      <div className={`text-xs ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </div>
                  </div>
                </div>

                {/* Additional Info for Open Trades */}
                {trade.status === 'OPEN' && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-yellow-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Trade in progress...</span>
                      </div>
                      <div className="text-gray-400">
                        Started {trade.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {trades.length > 0 && (
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Showing {trades.length} trades total
            </div>
            <div className={`font-semibold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
              Overall: {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnL >= 0 ? '+' : ''}{((totalPnL / Math.abs(totalPnL - totalPnL)) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;