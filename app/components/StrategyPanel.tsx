'use client';

import React from 'react';
import { 
  Zap, Cpu, TrendingUp, Repeat, CheckCircle, XCircle, Navigation, 
  Activity, BarChart3, Waves, Target, GitBranch, Sparkles, 
  Brain, Network, Satellite, Shield, Clock, Calendar,
  Layers, PieChart, Sigma, Crosshair, DollarSign, Users,
  BarChart, TrendingDown, Eye, Database, Cctv, Filter,
  Wind, Sun, Moon, Star, Cloud, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, Thermometer, Droplets,
  Umbrella, Tornado
} from 'lucide-react';

import { TradeSignal } from '../types/index';
interface StrategyPanelProps {
  signals: TradeSignal[];
  activeStrategies: string[];
}

const StrategyPanel: React.FC<StrategyPanelProps> = ({ signals, activeStrategies }) => {
  const strategies = [
    {
      name: 'Multi-Timeframe RSI',
      description: 'Combines RSI signals from 5, 14, and 21 periods',
      icon: <Repeat className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700'
    },
    {
      name: 'Trend Following MACD',
      description: 'Uses MACD histogram and EMA crossovers',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700'
    },
    {
      name: 'Mean Reversion BB',
      description: 'Bollinger Bands with RSI confirmation',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700'
    },
    {
      name: 'Volume-Weighted MACD',
      description: 'MACD weighted by trading volume',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700'
    },
    {
      name: 'Ichimoku Cloud',
      description: 'Cloud-based trend analysis',
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20',
      borderColor: 'border-pink-700'
    },
    {
      name: 'Supertrend Strategy',
      description: 'ATR-based trend following',
      icon: <Navigation className="w-5 h-5" />,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/20',
      borderColor: 'border-teal-700'
    },
    {
      name: 'Parabolic SAR',
      description: 'Stop and reversal points',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700'
    },
    {
      name: 'ADX Momentum',
      description: 'Directional movement index',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700'
    },
    {
      name: 'RSI Divergence',
      description: 'Price and RSI divergence detection',
      icon: <Waves className="w-5 h-5" />,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-900/20',
      borderColor: 'border-indigo-700'
    },
    {
      name: 'MACD Histogram',
      description: 'MACD histogram momentum analysis',
      icon: <BarChart className="w-5 h-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-700'
    },
    {
      name: 'Bollinger Squeeze',
      description: 'Volatility breakout detection',
      icon: <Target className="w-5 h-5" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-700'
    },
    {
      name: 'Stochastic Oscillator',
      description: 'Momentum and overbought/oversold levels',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'text-violet-400',
      bgColor: 'bg-violet-900/20',
      borderColor: 'border-violet-700'
    },
    {
      name: 'Williams %R',
      description: 'Momentum oscillator for reversals',
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-rose-400',
      bgColor: 'bg-rose-900/20',
      borderColor: 'border-rose-700'
    },
    {
      name: 'CCI Strategy',
      description: 'Commodity Channel Index cycles',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-700'
    },
    {
      name: 'ATR Breakout',
      description: 'Average True Range volatility breakout',
      icon: <Navigation className="w-5 h-5" />,
      color: 'text-lime-400',
      bgColor: 'bg-lime-900/20',
      borderColor: 'border-lime-700'
    },
    {
      name: 'VWAP Strategy',
      description: 'Volume Weighted Average Price',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-sky-400',
      bgColor: 'bg-sky-900/20',
      borderColor: 'border-sky-700'
    },
    {
      name: 'Fibonacci Retracement',
      description: 'Fibonacci levels for support/resistance',
      icon: <Sigma className="w-5 h-5" />,
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-900/20',
      borderColor: 'border-fuchsia-700'
    },
    {
      name: 'Pivot Points',
      description: 'Daily pivot point analysis',
      icon: <Crosshair className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700'
    },
    {
      name: 'Moving Average Cross',
      description: 'SMA crossovers for trend changes',
      icon: <Layers className="w-5 h-5" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-700'
    },
    {
      name: 'EMA Ribbon',
      description: 'Multiple EMA alignment analysis',
      icon: <PieChart className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-700'
    },
    {
      name: 'Price Action',
      description: 'Pure price movement analysis',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-900/20',
      borderColor: 'border-gray-700'
    },
    {
      name: 'Support Resistance',
      description: 'Key level breakout/rejection',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700'
    },
    {
      name: 'Volume Profile',
      description: 'Volume-based price levels',
      icon: <Database className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700'
    },
    {
      name: 'Order Flow',
      description: 'Market depth and order analysis',
      icon: <Filter className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700'
    },
    {
      name: 'Market Structure',
      description: 'Higher timeframe structure analysis',
      icon: <Network className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-700'
    },
    {
      name: 'Elliott Wave',
      description: 'Wave pattern recognition',
      icon: <Waves className="w-5 h-5" />,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-900/20',
      borderColor: 'border-indigo-700'
    },
    {
      name: 'Harmonic Patterns',
      description: 'Geometric price patterns',
      icon: <Satellite className="w-5 h-5" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-900/20',
      borderColor: 'border-pink-700'
    },
    {
      name: 'Deep Learning AI',
      description: 'Neural network predictions',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-700'
    },
    {
      name: 'Neural Network',
      description: 'AI-based pattern recognition',
      icon: <Cpu className="w-5 h-5" />,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/20',
      borderColor: 'border-teal-700'
    },
    {
      name: 'Sentiment Analysis',
      description: 'Market sentiment indicators',
      icon: <Users className="w-5 h-5" />,
      color: 'text-rose-400',
      bgColor: 'bg-rose-900/20',
      borderColor: 'border-rose-700'
    },
    {
      name: 'Whale Tracking',
      description: 'Large wallet movement tracking',
      icon: <Cctv className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-700'
    },
    {
      name: 'On-Chain Analysis',
      description: 'Blockchain metrics analysis',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'text-lime-400',
      bgColor: 'bg-lime-900/20',
      borderColor: 'border-lime-700'
    },
    {
      name: 'Market Cycle',
      description: 'Macro market cycle analysis',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-sky-400',
      bgColor: 'bg-sky-900/20',
      borderColor: 'border-sky-700'
    },
    {
      name: 'Seasonality',
      description: 'Seasonal pattern analysis',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-900/20',
      borderColor: 'border-fuchsia-700'
    },
    {
      name: 'Fear & Greed',
      description: 'Market sentiment index',
      icon: <Wind className="w-5 h-5" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-700'
    },
    {
      name: 'Network Growth',
      description: 'Blockchain network metrics',
      icon: <Network className="w-5 h-5" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-700'
    }
  ];

  const getStrategySignal = (strategyName: string): TradeSignal | undefined => {
    // Enhanced mapping to handle all strategy names
    const strategyMap: { [key: string]: string } = {
      'Multi-Timeframe RSI': 'Multi-timeframe RSI',
      'Trend Following MACD': 'Trend Following',
      'Mean Reversion BB': 'Mean Reversion',
      'Volume-Weighted MACD': 'Volume-Weighted MACD',
      'Ichimoku Cloud': 'Ichimoku Cloud',
      'Supertrend Strategy': 'Supertrend',
      'Parabolic SAR': 'Parabolic SAR',
      'ADX Momentum': 'ADX Momentum',
      'RSI Divergence': 'RSI Divergence',
      'MACD Histogram': 'MACD Histogram',
      'Bollinger Squeeze': 'Bollinger Squeeze',
      'Stochastic Oscillator': 'Stochastic',
      'Williams %R': 'Williams %R',
      'CCI Strategy': 'CCI',
      'ATR Breakout': 'ATR Breakout',
      'VWAP Strategy': 'VWAP',
      'Fibonacci Retracement': 'Fibonacci',
      'Pivot Points': 'Pivot Points',
      'Moving Average Cross': 'MA Cross',
      'EMA Ribbon': 'EMA Ribbon',
      'Price Action': 'Price Action',
      'Support Resistance': 'Support/Resistance',
      'Volume Profile': 'Volume Profile',
      'Order Flow': 'Order Flow',
      'Market Structure': 'Market Structure',
      'Elliott Wave': 'Elliott Wave',
      'Harmonic Patterns': 'Harmonic Patterns',
      'Deep Learning AI': 'Deep Learning AI',
      'Neural Network': 'Neural Network',
      'Sentiment Analysis': 'Sentiment Analysis',
      'Whale Tracking': 'Whale Tracking',
      'On-Chain Analysis': 'On-Chain Analysis',
      'Market Cycle': 'Market Cycle',
      'Seasonality': 'Seasonality',
      'Fear & Greed': 'Fear & Greed',
      'Network Growth': 'Network Growth'
    };
    
    const searchTerm = strategyMap[strategyName] || strategyName;
    return signals.find(signal => 
      signal.reason.includes(searchTerm) || 
      signal.reason.toLowerCase().includes(strategyName.toLowerCase())
    );
  };

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-profit bg-green-900/30 border-profit';
      case 'SELL': return 'text-loss bg-red-900/30 border-loss';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-600';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-accent" />
          <span>Trading Strategies</span>
        </h2>
        <div className="text-sm text-gray-400">
          {activeStrategies.length} Active / {strategies.length} Total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {strategies.map((strategy, index) => {
          const signal = getStrategySignal(strategy.name);
          const isActive = activeStrategies.includes(strategy.name);
          
          return (
            <div 
              key={index}
              className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                isActive 
                  ? `${strategy.bgColor} ${strategy.borderColor} glow-effect` 
                  : 'bg-gray-900/30 border-gray-600 opacity-60'
              }`}
            >
              {/* Strategy Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${strategy.bgColor} ${strategy.color}`}>
                    {strategy.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{strategy.name}</h3>
                    <div className="flex items-center space-x-1">
                      {isActive ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-profit" />
                          <span className="text-xs text-profit">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-loss" />
                          <span className="text-xs text-loss">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy Description */}
              <p className="text-gray-400 text-xs mb-3">
                {strategy.description}
              </p>

              {/* Signal Output */}
              {signal && (
                <div className={`mt-2 p-2 rounded-lg text-center border ${getSignalColor(signal.action)}`}>
                  <div className="text-xs font-semibold">{signal.action}</div>
                  <div className="text-xs opacity-80">
                    {signal.confidence > 0 ? (signal.confidence * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                </div>
              )}

              {/* Strategy Details */}
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{signal?.duration || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Leverage:</span>
                  <span className="text-yellow-400">{signal?.leverage || 'N/A'}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Analysis */}
      <div className="mt-6 p-4 bg-secondary/50 rounded-xl border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Strategy Consensus</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700">
            <div className="text-blue-400 text-sm">Buy Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'BUY').length}
            </div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
            <div className="text-gray-400 text-sm">Hold Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'HOLD').length}
            </div>
          </div>
          <div className="p-3 bg-red-900/20 rounded-lg border border-red-700">
            <div className="text-red-400 text-sm">Sell Signals</div>
            <div className="text-white font-bold text-xl">
              {signals.filter(s => s.action === 'SELL').length}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent">
          <div className="text-white text-sm text-center">
            <strong>Final Decision:</strong> Based on weighted consensus of {signals.length} strategies
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyPanel;