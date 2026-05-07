import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  DollarSign, 
  Download, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Landmark
} from 'lucide-react';
import { usePartnerDashboard } from '../../../hooks/useDashboardData';

const EARNINGS_DATA = {
  available_balance: 4250.00,
  pending_clearance: 1200.00,
  total_earned: 48500.00,
  next_payout: 'Feb 15, 2026',
  currency: 'USD'
};

const TRANSACTIONS = [
  { id: 'TXN-8821', date: 'Jan 28, 2026', description: 'Milestone Payout: Mobile App MVP', amount: 2500.00, status: 'Pending', type: 'Credit' },
  { id: 'TXN-8819', date: 'Jan 15, 2026', description: 'Monthly Retainer - Jan', amount: 2000.00, status: 'Cleared', type: 'Credit' },
  { id: 'TXN-8804', date: 'Jan 01, 2026', description: 'Withdrawal to Bank Account (**** 4421)', amount: -3500.00, status: 'Completed', type: 'Debit' },
  { id: 'TXN-8792', date: 'Dec 15, 2025', description: 'Bug Bounty Reward - Critical', amount: 500.00, status: 'Cleared', type: 'Credit' },
];

const PartnerEarnings = () => {
  const [filter, setFilter] = useState('All');
  return (
    <DashboardLayout role="partner" title="Earnings & Payouts" subtitle="Track your income and manage withdrawals">
      
      {/* 1. Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Available Balance */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-black/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                      <div className="flex items-center gap-2 text-emerald-100 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
                      </div>
                      <h2 className="text-3xl font-bold">${(available_balance || 0).toLocaleString()}</h2>
                  </div>
                  <button className="mt-4 w-full py-2 bg-white dark:bg-gray-900 dark:border-gray-800 text-emerald-700 font-bold rounded-lg text-sm hover:bg-emerald-50 transition-colors shadow-sm">
                      Withdraw Funds
                  </button>
              </div>
          </div>

          {/* Pending Clearance */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col h-full justify-between">
                  <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Pending Clearance</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">${(pending_clearance || 0).toLocaleString()}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-4 border border-amber-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>Est. clears by {next_payout || 'TBD'}</span>
                  </div>
              </div>
          </div>

          {/* Lifetime Earnings */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm">
               <div className="flex flex-col h-full justify-between">
                  <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Lifetime Earnings</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">${(total_earned || 0).toLocaleString()}</h2>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                          <span className="block font-bold text-gray-900 dark:text-white">Tax Documents</span>
                          <span className="text-[10px] text-gray-400">1099 form ready</span>
                      </div>
                      <button className="text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Transaction History */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
                    <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
                    <div className="flex gap-2">
                        {['All', 'Credit', 'Debit'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
               </div>
               <div className="divide-y divide-gray-50">
                   {transactions.filter(t => filter === 'All' || t.type === filter).map((txn) => (
                       <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:bg-[#050505] transition-colors group">
                           <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                   txn.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-500'
                               }`}>
                                   {txn.type === 'Credit' ? <DollarSign className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                               </div>
                               <div>
                                   <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{txn.description}</p>
                                   <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                       <span>{txn.date}</span>
                                       <span>•</span>
                                       <span className="font-mono">{txn.id}</span>
                                   </div>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                   {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                               </p>
                               <span className={`text-[10px] font-bold uppercase ${
                                   txn.status === 'Completed' || txn.status === 'Cleared' || txn.status === 'PAID' ? 'text-green-600' : 'text-amber-600'
                               }`}>
                                   {txn.status}
                               </span>
                           </div>
                       </div>
                   ))}
                   {transactions.length === 0 && (
                       <div className="p-8 text-center text-gray-500 text-sm">No transactions found.</div>
                   )}
               </div>
               <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                   <button className="text-xs font-bold text-brand-blue hover:underline">View All Transactions</button>
               </div>
          </div>

          {/* 3. Payout Methods */}
          <div className="space-y-6">
               <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <CreditCard className="w-5 h-5 text-gray-400" /> Payout Method
                   </h3>
                   
                   <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                               VISA
                           </div>
                           <div>
                               <p className="text-xs font-bold text-gray-900 dark:text-white">Start Bank •••• 4242</p>
                               <p className="text-[10px] text-gray-500">Primary • USD</p>
                           </div>
                       </div>
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                   </div>

                   <button className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-all flex items-center justify-center gap-2">
                       <DollarSign className="w-3 h-3" /> Add Payout Method
                   </button>
               </div>

               {/* Tax & Compliance */}
               <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 text-gray-400" /> Compliance
                   </h3>
                   <ul className="space-y-3">
                       <li className="flex items-center justify-between text-xs">
                           <span className="text-gray-600 dark:text-gray-400">Identity Verification</span>
                           <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                       </li>
                       <li className="flex items-center justify-between text-xs">
                           <span className="text-gray-600 dark:text-gray-400">Tax Form (W-8BEN)</span>
                           <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Submitted</span>
                       </li>
                        <li className="flex items-center justify-between text-xs">
                           <span className="text-gray-600 dark:text-gray-400">NDA Signed</span>
                           <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                       </li>
                   </ul>
               </div>
          </div>

      </div>
    </DashboardLayout>
  );
};

export default PartnerEarnings;
