import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';

const ClientNorthStar = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-brand-gradient border-b border-blue-900/20 sticky top-24 z-30 shadow-lg text-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-10 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  // Use dynamic data with defaults
  const health = data?.health?.status || 'On Track';
  const healthScore = data?.health?.score || 100;
  const timelineConfidence = data?.timelineConfidence || 92;
  const budgetUsed = data?.financials?.totalSpend || 0;
  const budgetTotal = data?.financials?.totalBudget || 0;
  const budgetPercent = data?.financials?.budgetUtilized || 0;
  const nextAction = data?.nextAction?.title || 'Review Deliverables';
  const nextActionDue = data?.nextAction?.due || 'Action Required';

  return (
    <div className="bg-brand-gradient border-b border-blue-900/20 sticky top-24 z-30 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* 1. Engagement Health */}
          <div className="flex items-center gap-4 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 backdrop-blur-sm shadow-inner">
                 <Activity className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Engagement Health</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${health === 'On Track' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <h3 className="font-extrabold text-white text-lg tracking-tight">{health}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Timeline Confidence */}
          <div className="flex items-center gap-4 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-8">
             <div className="flex items-center gap-4">
               <div className="p-2.5 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl border border-white/20 backdrop-blur-sm text-blue-300">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Timeline Confidence</p>
                 <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="font-extrabold text-white text-lg tracking-tight">{timelineConfidence}%</h3>
                    {timelineConfidence > 90 && <span className="text-[10px] font-bold text-emerald-900 bg-emerald-300 px-1.5 py-0.5 rounded shadow-sm">High</span>}
                 </div>
               </div>
             </div>
          </div>

          {/* 3. Budget Burn */}
          <div className="hidden md:flex items-center gap-4 w-full lg:w-auto border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-8">
             <div className="flex items-center gap-4 w-full">
               <div className="p-2.5 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl border border-white/20 backdrop-blur-sm text-purple-300">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div className="flex-1 min-w-[160px]">
                 <div className="flex justify-between items-center mb-1.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Budget Consumed</p>
                    <span className="text-[10px] font-bold text-white">
                      {budgetUsed >= 1000 ? `${Math.round(budgetUsed/1000)}k` : `$${budgetUsed}`} / {budgetTotal >= 1000 ? `${Math.round(budgetTotal/1000)}k` : `$${budgetTotal}`}
                    </span>
                 </div>
                 <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full shadow-sm ${budgetPercent > 90 ? 'bg-red-400' : 'bg-gradient-to-r from-blue-400 to-purple-400'}`} 
                      style={{ width: `${budgetPercent > 100 ? 100 : budgetPercent}%` }} 
                    />
                 </div>
               </div>
             </div>
          </div>

          {/* 4. Next Action (Call to Action) */}
          <div className="flex items-center gap-4 w-full lg:w-auto bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 p-2 pr-5 rounded-xl lg:ml-auto shadow-lg hover:bg-white dark:bg-gray-900 dark:border-gray-800/15 transition-all cursor-pointer group backdrop-blur-md">
             <div className="bg-amber-500 p-2 rounded-xl flex-shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5 text-white" />
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-200 uppercase tracking-wider mb-0.5">Action Required • {nextActionDue}</p>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                   {nextAction} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientNorthStar;
