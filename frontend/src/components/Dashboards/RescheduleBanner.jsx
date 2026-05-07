import React from 'react';
import { Calendar, ArrowRight, RefreshCw } from 'lucide-react';

const RescheduleBanner = ({ count, onReview }) => {
  if (count === 0) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-brand-gradient rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Decorative Background */ }
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-inner border border-white/10">
            <RefreshCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              Meeting Rescheduled
              <span className="flex h-2 w-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            </h3>
            <p className="text-sm text-blue-100 mt-0.5 max-w-md">
              One or more meetings have been updated. Please review the changes.
            </p>
          </div>
        </div>
        
        <button 
          onClick={onReview}
          className="relative z-10 w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap"
        >
          Review & Confirm
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};

export default RescheduleBanner;
