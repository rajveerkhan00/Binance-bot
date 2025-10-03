'use client';

import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Volume2 } from 'lucide-react';
import { CoinData } from '../types';
import { formatPrice, formatPercent } from '../lib/utils';
import binance from '../lib/binance';

const CoinGrid: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<CoinData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTCUSDT');

  const popularCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT'];

  useEffect(() => {
    loadCoinData();
    const interval = setInterval(loadCoinData, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = coins.filter(coin =>
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchTerm, coins]);

  const loadCoinData = async () => {
    try {
      const prices = await binance.getAllPrices();
      const coinData: CoinData[] = [];

      for (const symbol of popularCoins) {
        const price = parseFloat(prices[symbol]);
        if (price) {
          // Simulate price change for demo (in real app, you'd get this from 24h stats)
          const change24h = (Math.random() - 0.5) * 10;
          const priceChange = price * (change24h / 100);
          
          coinData.push({
            symbol,
            price,
            change24h,
            volume: Math.random() * 1000000000,
            priceChange,
            priceChangePercent: change24h,
            lastUpdate: new Date()
          });
        }
      }

      setCoins(coinData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading coin data:', error);
      setIsLoading(false);
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-profit' : 'text-loss';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 
      <TrendingUp className="w-4 h-4" /> : 
      <TrendingDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          <span>Market Overview</span>
        </h2>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-semibold">Coin</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold">Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold">24h Change</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold">Volume</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr 
                key={coin.symbol} 
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCoin(coin.symbol)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{coin.symbol.replace('USDT', '')}</div>
                      <div className="text-gray-400 text-xs">USDT</div>
                    </div>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <div className="text-white font-mono">${formatPrice(coin.price)}</div>
                </td>
                <td className="text-right py-3 px-4">
                  <div className={`flex items-center justify-end space-x-1 ${getChangeColor(coin.change24h)}`}>
                    {getChangeIcon(coin.change24h)}
                    <span className="font-semibold">
                      {formatPercent(coin.change24h)}
                    </span>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1 text-gray-400">
                    <Volume2 className="w-3 h-3" />
                    <span className="text-sm">
                      ${(coin.volume / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </td>
                <td className="text-right py-3 px-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    coin.change24h >= 0 
                      ? 'bg-green-900/30 text-profit border border-green-700' 
                      : 'bg-red-900/30 text-loss border border-red-700'
                  }`}>
                    {coin.change24h >= 0 ? 'BULLISH' : 'BEARISH'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCoins.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No coins found matching your search.
          </div>
        )}
      </div>

      {/* Selected Coin Info */}
      {selectedCoin && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">{selectedCoin}</h3>
              <p className="text-gray-400 text-sm">Selected for analysis</p>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-lg">
                ${formatPrice(coins.find(c => c.symbol === selectedCoin)?.price || 0)}
              </div>
              <div className={getChangeColor(coins.find(c => c.symbol === selectedCoin)?.change24h || 0)}>
                {formatPercent(coins.find(c => c.symbol === selectedCoin)?.change24h || 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinGrid;