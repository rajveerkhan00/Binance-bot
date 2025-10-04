'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Loader, Star, Zap } from 'lucide-react';
import { CoinData } from '../types';
import { formatNumber } from '../lib/utils';

interface CoinGridProps {
  coins: CoinData[];
  onSelectCoin: (coin: CoinData) => void;
  selectedCoin: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  filterMode: 'all' | 'buy' | 'sell';
}

const CoinGrid: React.FC<CoinGridProps> = ({ 
  coins, 
  onSelectCoin, 
  selectedCoin, 
  onLoadMore, 
  hasMore, 
  isLoading,
  filterMode
}) => {
  const getFilterTitle = () => {
    switch (filterMode) {
      case 'buy': return '100% Buy Signals (95%+ Confidence)';
      case 'sell': return '100% Sell Signals (95%+ Confidence)';
      default: return 'All Market Coins';
    }
  };

  const getFilterDescription = () => {
    switch (filterMode) {
      case 'buy': return `Showing ${coins.length} coins with strong buy signals`;
      case 'sell': return `Showing ${coins.length} coins with strong sell signals`;
      default: return `Showing ${coins.length} of 1000+ coins`;
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{getFilterTitle()}</h2>
          <p className="text-gray-400 text-sm mt-1">{getFilterDescription()}</p>
        </div>
        <div className="text-sm text-gray-400 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {coins.map((coin, index) => (
          <div
            key={`${coin.symbol}-${index}`}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:scale-[1.02] ${
              selectedCoin === coin.symbol
                ? 'bg-accent/20 border-accent glow-effect'
                : 'bg-secondary/50 border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => onSelectCoin(coin)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    coin.change24h >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'
                  }`}>
                    {coin.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-profit" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-loss" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm">{coin.symbol}</h3>
                        {coin.change24h > 10 && (
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <span className={`text-sm font-bold ${
                        coin.change24h >= 0 ? 'text-profit' : 'text-loss'
                      }`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-xs">
                        ${coin.price.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Vol: {formatNumber(coin.volume)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Metrics */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded ${
                coin.volume > 50000000 ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {coin.volume > 50000000 ? 'High Volume' : 'Normal'}
              </span>
              <span className={`px-2 py-1 rounded ${
                Math.abs(coin.change24h) > 15 ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {Math.abs(coin.change24h) > 15 ? 'High Volatility' : 'Stable'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-accent hover:bg-purple-600 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Coins</span>
            )}
          </button>
        </div>
      )}

      {!hasMore && coins.length > 0 && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          🎉 All {coins.length} coins loaded from 1000+ market
        </div>
      )}

      {coins.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No coins match current filter</p>
          <p className="text-sm">Try changing your filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CoinGrid;