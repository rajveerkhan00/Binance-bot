'use client';

import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, RefreshCw } from 'lucide-react';
import { CoinData } from '../types';
import { calculatePortfolioValue } from '../lib/utils';

interface PortfolioManagerProps {
  portfolio: { [key: string]: number };
  coins: CoinData[];
  totalBalance: number;
  onUpdateBalance: (balance: number) => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ 
  portfolio, 
  coins, 
  totalBalance, 
  onUpdateBalance 
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const portfolioValue = calculatePortfolioValue(portfolio, coins);
  const totalValue = totalBalance + portfolioValue;
  const profitLoss = totalValue - 10000; // Initial balance

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      onUpdateBalance(totalBalance + amount);
      setDepositAmount('');
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= totalBalance) {
      onUpdateBalance(totalBalance - amount);
      setWithdrawAmount('');
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-accent" />
          <span>Portfolio Manager</span>
        </h2>
        <div className="text-sm text-gray-400">
          Real-time Portfolio Tracking
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">Total Balance</div>
          <div className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</div>
          <div className={`text-sm ${profitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">Available Balance</div>
          <div className="text-2xl font-bold text-white">${totalBalance.toFixed(2)}</div>
          <div className="text-gray-400 text-sm">For trading</div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <div className="text-gray-400 text-sm">Portfolio Value</div>
          <div className="text-2xl font-bold text-white">${portfolioValue.toFixed(2)}</div>
          <div className="text-gray-400 text-sm">In assets</div>
        </div>
      </div>

      {/* Fund Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-profit" />
            Deposit Funds
          </h3>
          <div className="flex space-x-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            <button
              onClick={handleDeposit}
              className="bg-profit hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Deposit
            </button>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Minus className="w-5 h-5 mr-2 text-loss" />
            Withdraw Funds
          </h3>
          <div className="flex space-x-2">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            <button
              onClick={handleWithdraw}
              className="bg-loss hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-secondary/50 rounded-xl p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Current Holdings</h3>
        {Object.keys(portfolio).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active holdings</p>
            <p className="text-sm">Your portfolio assets will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(portfolio).map(([symbol, quantity]) => {
              const coin = coins.find(c => c.symbol === symbol);
              const value = coin ? coin.price * quantity : 0;
              const change = coin ? coin.change24h : 0;
              
              return (
                <div key={symbol} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      change >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}>
                      {change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-profit" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-loss" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{symbol}</div>
                      <div className="text-gray-400 text-sm">
                        {quantity} units • ${value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    change >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;