'use client';

import React from 'react';
import { History, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { TradeHistory as TradeHistoryType } from '../types';
import { formatPrice, formatPercent, formatNumber } from '../lib/utils';

interface TradeHistoryProps {
  trades: TradeHistoryType[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WIN':
        return <CheckCircle className="w-4 h-4 text-profit" />;
      case 'LOSS':
        return <XCircle className="w-4 h-4 text-loss" />;
      case 'OPEN':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WIN':
        return 'text-profit';
      case 'LOSS':
        return 'text-loss';
      case 'OPEN':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-profit' : 'text-loss';
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <History className="w-6 h-6 text-accent" />
          <span>Trade History</span>
        </h2>
        <div className="text-sm text-gray-400">
          {trades.length} trades
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No trades yet</p>
          <p className="text-sm">Your trading history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="bg-secondary/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    trade.action === 'BUY' ? 'bg-green-900/30' : 'bg-red-900/30'
                  }`}>
                    {trade.action === 'BUY' ? (
                      <TrendingUp className="w-4 h-4 text-profit" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-loss" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{trade.symbol}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(trade.status)}
                      <span className={`text-xs font-medium ${getStatusColor(trade.status)}`}>
                        {trade.status}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-400 text-xs">{trade.strategy}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${getPnLColor(trade.pnl)}`}>
                    {formatPrice(trade.pnl)}
                  </div>
                  <div className={`text-xs ${getPnLColor(trade.pnl)}`}>
                    {formatPercent(trade.pnlPercent)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entry Price</span>
                    <span className="text-white">{formatPrice(trade.entryPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exit Price</span>
                    <span className="text-white">
                      {trade.exitPrice ? formatPrice(trade.exitPrice) : 'Open'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-white">{formatNumber(trade.quantity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{trade.duration}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center">
                <div className="text-gray-400 text-xs">
                  {trade.timestamp.toLocaleTimeString()}
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-xs">
                    {trade.action} • {trade.quantity} units
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {trades.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <div className="text-profit text-sm">Wins</div>
              <div className="text-white font-bold">
                {trades.filter(t => t.status === 'WIN').length}
              </div>
            </div>
            <div className="p-2 bg-red-900/20 rounded-lg">
              <div className="text-loss text-sm">Losses</div>
              <div className="text-white font-bold">
                {trades.filter(t => t.status === 'LOSS').length}
              </div>
            </div>
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <div className="text-blue-400 text-sm">Open</div>
              <div className="text-white font-bold">
                {trades.filter(t => t.status === 'OPEN').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;