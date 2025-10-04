'use client';

import React from 'react';
import { X, TrendingUp, TrendingDown, Clock, Shield, Target, BarChart3, DollarSign } from 'lucide-react';
import { CoinData, TradeSignal } from '../types';
import { calculateRiskReward } from '../lib/utils';

interface CoinDetailsProps {
  coin: CoinData;
  onClose: () => void;
  signal: TradeSignal;
}

const CoinDetails: React.FC<CoinDetailsProps> = ({ 
  coin, 
  onClose, 
  signal
}) => {
  const riskRewardInfo = calculateRiskReward(signal.price, signal.stopLoss, signal.takeProfit);
  
  const getRiskRewardDescription = (ratio: number) => {
    let description = 'Poor';
    if (ratio >= 3) description = 'Excellent';
    else if (ratio >= 2) description = 'Good';
    else if (ratio >= 1.5) description = 'Fair';
    return description;
  };

  const getTradeRecommendation = () => {
    if (signal.action === 'HOLD') {
      return {
        action: 'WAIT',
        reason: 'Market conditions not favorable',
        confidence: signal.confidence,
        color: 'text-yellow-400'
      };
    }

    const riskRewardDescription = getRiskRewardDescription(riskRewardInfo);
    
    let recommendation = {
      action: signal.action,
      reason: '',
      confidence: signal.confidence,
      color: signal.action === 'BUY' ? 'text-profit' : 'text-loss'
    };

    if (signal.confidence >= 0.8 && riskRewardInfo >= 2) {
      recommendation.reason = 'High confidence with excellent risk/reward';
    } else if (signal.confidence >= 0.6 && riskRewardInfo >= 1.5) {
      recommendation.reason = 'Good opportunity with favorable risk/reward';
    } else {
      recommendation.reason = 'Moderate confidence - proceed with caution';
    }

    return recommendation;
  };

  const recommendation = getTradeRecommendation();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl p-6 border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              coin.change24h >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              {coin.change24h >= 0 ? (
                <TrendingUp className="w-6 h-6 text-profit" />
              ) : (
                <TrendingDown className="w-6 h-6 text-loss" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{coin.symbol}</h2>
              <p className="text-gray-400">Real-time trading analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price & Stats */}
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-accent" />
                Price Statistics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-white font-bold">${coin.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Change</span>
                  <span className={`font-bold ${
                    coin.change24h >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white">
                    ${(coin.volume / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Change</span>
                  <span className={`${coin.priceChange >= 0 ? 'text-profit' : 'text-loss'}`}>
                    ${Math.abs(coin.priceChange).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trading Signal */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Trading Signal
              </h3>
              <div className={`p-3 rounded-lg text-center ${
                signal.action === 'BUY' ? 'bg-green-900/30 border border-profit' :
                signal.action === 'SELL' ? 'bg-red-900/30 border border-loss' :
                'bg-yellow-900/30 border border-yellow-500'
              }`}>
                <div className="text-xl font-bold mb-1">
                  <span className={recommendation.color}>
                    {signal.action}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Confidence: {(signal.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {signal.reason}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Setup */}
          <div className="space-y-4">
            {/* Risk Management */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-accent" />
                Risk Management
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stop Loss</span>
                  <span className="text-loss">${signal.stopLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Take Profit</span>
                  <span className="text-profit">${signal.takeProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Leverage</span>
                  <span className="text-yellow-400">{signal.leverage}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk/Reward</span>
                  <span className={`${
                    riskRewardInfo >= 2 ? 'text-profit' : 
                    riskRewardInfo >= 1 ? 'text-yellow-400' : 'text-loss'
                  }`}>
                    {riskRewardInfo.toFixed(2)}:1
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Duration */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-accent" />
                Trade Duration
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Recommended</span>
                  <span className="text-white">{signal.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Strategy Type</span>
                  <span className="text-accent">Swing Trade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exit Condition</span>
                  <span className="text-white">TP/SL Hit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-6 bg-accent/10 rounded-xl p-4 border border-accent">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Trading Recommendation
          </h3>
          <div className="space-y-2">
            <p className={`text-lg font-bold ${recommendation.color}`}>
              {recommendation.action === 'WAIT' ? 'WAIT FOR BETTER ENTRY' : `${recommendation.action} RECOMMENDED`}
            </p>
            <p className="text-gray-300">{recommendation.reason}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400">Risk Level:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                signal.confidence >= 0.8 ? 'bg-green-900/50 text-profit' :
                signal.confidence >= 0.6 ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-loss'
              }`}>
                {signal.confidence >= 0.8 ? 'LOW' : signal.confidence >= 0.6 ? 'MEDIUM' : 'HIGH'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="flex-1 bg-profit hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
            Execute Trade
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;