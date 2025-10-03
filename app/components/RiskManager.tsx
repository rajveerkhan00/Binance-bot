'use client';

import React from 'react';
import { Shield, AlertTriangle, Target, Zap, BarChart3, Clock } from 'lucide-react';

const RiskManager: React.FC = () => {
  const riskMetrics = [
    {
      name: 'Portfolio Risk',
      value: '2.1%',
      max: '5%',
      level: 'low',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-profit'
    },
    {
      name: 'Max Drawdown',
      value: '3.4%',
      max: '10%',
      level: 'medium',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    {
      name: 'Volatility',
      value: '12.8%',
      max: '20%',
      level: 'low',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-profit'
    },
    {
      name: 'Position Size',
      value: '1.5%',
      max: '3%',
      level: 'low',
      icon: <Target className="w-5 h-5" />,
      color: 'text-profit'
    }
  ];

  const riskRules = [
    {
      rule: 'Maximum 2% risk per trade',
      status: 'active',
      description: 'Stop loss set to limit losses'
    },
    {
      rule: 'Maximum 10% portfolio drawdown',
      status: 'active',
      description: 'Auto-stop trading if reached'
    },
    {
      rule: 'Minimum 1:2 risk-reward ratio',
      status: 'active',
      description: 'All trades must meet criteria'
    },
    {
      rule: 'No trading during high volatility',
      status: 'monitoring',
      description: 'Pause during major news'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-profit';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-loss';
      default: return 'text-gray-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-900/20';
      case 'medium': return 'bg-yellow-900/20';
      case 'high': return 'bg-red-900/20';
      default: return 'bg-gray-900/20';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-accent" />
          <span>Risk Management</span>
        </h2>
        <div className="flex items-center space-x-2 text-profit">
          <div className="w-2 h-2 bg-profit rounded-full animate-pulse"></div>
          <span className="text-sm">All Systems Normal</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Risk Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Metrics</h3>
          
          {riskMetrics.map((metric, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border ${getLevelBg(metric.level)} border-gray-600`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <span className="text-white font-semibold">{metric.name}</span>
                </div>
                <div className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Max: {metric.max}</span>
                <span className={`capitalize ${getLevelColor(metric.level)}`}>
                  {metric.level} risk
                </span>
              </div>
              
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getLevelColor(metric.level)}`}
                  style={{ 
                    width: `${parseFloat(metric.value) / parseFloat(metric.max) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Risk Rules */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Trading Rules</h3>
          
          {riskRules.map((rule, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl border border-gray-600 bg-secondary/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {rule.status === 'active' ? (
                    <div className="w-3 h-3 bg-profit rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  )}
                  <span className="text-white font-semibold">{rule.rule}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  rule.status === 'active' 
                    ? 'bg-green-900/30 text-profit border border-green-700' 
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                }`}>
                  {rule.status.toUpperCase()}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm">
                {rule.description}
              </p>
            </div>
          ))}

          {/* Risk Warning */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Important Notice</span>
            </div>
            <p className="text-yellow-400 text-sm">
              Trading futures involves significant risk. The AI bot provides signals based on technical analysis, 
              but past performance doesn't guarantee future results. Always trade responsibly and never risk more 
              than you can afford to lose.
            </p>
          </div>

          {/* Performance Stats */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-gray-600">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Performance Safety</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Loss Limit:</span>
                <span className="text-white">5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weekly Loss Limit:</span>
                <span className="text-white">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Open Trades:</span>
                <span className="text-white">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cool-off Period:</span>
                <span className="text-white">2 Losses → 1hr break</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-red-400 font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Emergency Controls</span>
            </h4>
            <p className="text-red-400 text-sm mt-1">
              Immediate stop of all trading activities
            </p>
          </div>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            STOP ALL TRADING
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskManager;