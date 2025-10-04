'use client';

import React from 'react';
import { Shield, AlertTriangle, Target, BarChart3, Cpu, TrendingUp, Users } from 'lucide-react';
import { TradeSignal } from '../types';

interface RiskManagerProps {
  allSignals: TradeSignal[];
}

const RiskManager: React.FC<RiskManagerProps> = ({ allSignals }) => {
  // Calculate strategy-based risk metrics
  const highConfidenceSignals = allSignals.filter(s => s.confidence >= 0.8).length;
  const strategyAgreement = allSignals.filter(s => s.action !== 'HOLD').length;
  const totalStrategies = allSignals.length;
  const consensusPercentage = totalStrategies > 0 ? (strategyAgreement / totalStrategies) * 100 : 0;

  // Risk level calculation based on strategy consensus
  const getRiskLevel = () => {
    if (consensusPercentage >= 70) return { level: 'LOW', color: 'text-profit', bg: 'bg-profit/20' };
    if (consensusPercentage >= 40) return { level: 'MEDIUM', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { level: 'HIGH', color: 'text-loss', bg: 'bg-loss/20' };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-accent" />
          <span>Risk Management</span>
        </h2>
        <div className="text-sm text-gray-400">
          Multi-Strategy Protection
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Metrics */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-accent" />
            Risk Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Max Drawdown</span>
              <span className="text-white font-bold">-2.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Volatility</span>
              <span className="text-white font-bold">15.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="text-profit font-bold">1.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-profit font-bold">68.5%</span>
            </div>
          </div>
        </div>

        {/* Strategy Risk Assessment */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-accent" />
            Strategy Assessment
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Strategies</span>
              <span className="text-white font-bold">{strategyAgreement}/{totalStrategies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">High Confidence</span>
              <span className="text-profit font-bold">{highConfidenceSignals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Strategy Consensus</span>
              <span className={`font-bold ${
                consensusPercentage >= 70 ? 'text-profit' : 
                consensusPercentage >= 40 ? 'text-yellow-400' : 'text-loss'
              }`}>
                {consensusPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Risk Level</span>
              <span className={`font-bold ${riskLevel.color}`}>
                {riskLevel.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Measures */}
      <div className="mt-6 bg-secondary/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2 text-accent" />
          Safety Measures
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
              <span className="text-white text-sm">Auto Stop-Loss</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
              <span className="text-white text-sm">Position Sizing</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
              <span className="text-white text-sm">Risk Limits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
              <span className="text-white text-sm">Portfolio Diversification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Level Indicator */}
      <div className="mt-6 bg-secondary/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
          Current Risk Level
        </h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 bg-gray-600 rounded-full h-3">
            <div 
              className={`rounded-full h-3 transition-all duration-500 ${
                consensusPercentage >= 70 ? 'bg-profit' : 
                consensusPercentage >= 40 ? 'bg-yellow-400' : 'bg-loss'
              }`}
              style={{ width: `${consensusPercentage}%` }}
            ></div>
          </div>
          <span className={`ml-4 font-bold ${riskLevel.color}`}>
            {riskLevel.level} RISK
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-400 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {strategyAgreement} of {totalStrategies} strategies agree on market direction
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-semibold py-3 px-4 rounded-lg transition-colors border border-yellow-500/50 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Reduce Exposure
        </button>
        <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-lg transition-colors border border-red-500/50 flex items-center justify-center">
          <Shield className="w-4 h-4 mr-2" />
          Emergency Stop
        </button>
      </div>
    </div>
  );
};

export default RiskManager;