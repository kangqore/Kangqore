import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Receipt, CreditCard, Calendar, Download, AlertCircle, FileText, CheckCircle, TrendingUp, Wallet, ArrowDownRight } from 'lucide-react';
import { useClientInvoices } from '../../../hooks/useDashboardData';

const ClientBilling = ({ isTabContent = false }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Data
  useEffect(() => {
     // Mock fetch
     const timer = setTimeout(() => {
         setProject({
             budget: 150000,
             spend: 45000,
             forecast: 148000
         });
         setLoading(false);
     }, 1000);
     return () => clearTimeout(timer);
  }, []);

  const Content = () => {
      if (loading) return <div className="p-12 text-center animate-pulse text-slate-400">Loading financial data...</div>;

      return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Billing & <span className="text-brand-blue">Contracts</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
                        Financial oversight, invoice history, and contract change management.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                     <span className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Contract Active
                     </span>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-24 h-24 text-white" />
                     </div>
                     <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Total Budget</p>
                     <p className="text-4xl font-black tracking-tight mb-2">${(project?.budget || 0).toLocaleString()}</p>
                     <p className="text-xs font-bold text-slate-400">Fixed Cost Engagement</p>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-24 h-24 text-brand-blue" />
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Invoiced to Date</p>
                     <p className="text-4xl font-black text-brand-blue tracking-tight mb-2">${(project?.spend || 0).toLocaleString()}</p>
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <span className="text-brand-blue">{Math.round((project?.spend / project?.budget) * 100)}%</span> of budget utilized
                     </p>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div style={{ width: `${(project?.spend / project?.budget) * 100}%` }} className="h-full bg-brand-blue rounded-full" />
                     </div>
                </div>

                <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-green-500" />
                     </div>
                     <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">Forecast at Completion</p>
                     <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">${(project?.forecast || 0).toLocaleString()}</p>
                     <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                        <ArrowDownRight className="w-3 h-3" /> Within Budget
                     </p>
                </div>
</div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invoices List */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <FileText className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                        Invoice History
                    </h3>
                    <div className="space-y-4">
                        {[
                            { id: 'INV-2024-001', date: 'Jan 15, 2024', amount: 15000, status: 'PAID', desc: 'Mobilization & Discovery Phase' },
                            { id: 'INV-2024-002', date: 'Feb 01, 2024', amount: 30000, status: 'PENDING', desc: 'Design System & Architecture' }
                        ].map((inv, i) => (
                            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow gap-4">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{inv.id}</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{inv.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</p>
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{inv.date}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide ${
                                        inv.status === 'PAID' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                    }`}>
                                        {inv.status}
                                    </span>
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                        <Download className="w-5 h-5 text-slate-400 hover:text-brand-blue" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Change Orders Context */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 space-y-6 self-start">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Active Change Orders
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Modifications to the original scope that have financial impact.
                    </p>
                    
                    <div className="space-y-4">
                         <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg">Pending</span>
                                 <span className="text-sm font-black text-slate-900 dark:text-white">+$12,500</span>
                             </div>
                             <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Add AI Chatbot Module</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Requested Feb 05, 2024</p>
                             <button className="w-full mt-4 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition">
                                 Review Impact
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  if (isTabContent) return <Content />;

  return (
    <DashboardLayout role="client" title="Billing & Contracts" subtitle="Financial records and agreement details">
      <Content />
    </DashboardLayout>
  );
};

export default ClientBilling;
