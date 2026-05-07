import React from 'react';
import { usePsychologicalProgress } from '../../hooks/usePsychologicalProgress';

const SmartProgressBar = ({ isProcessing, label = "Processing Request..." }) => {
  const progress = usePsychologicalProgress(isProcessing);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] animate-in fade-in duration-300">
      <div className="h-1.5 w-full bg-blue-100/30 backdrop-blur-sm overflow-hidden border-b border-white/10">
        <div 
          className="h-full bg-brand-gradient transition-all duration-300 ease-out relative shadow-md"
          style={{ width: `${progress}%` }}
        >
          {/* Moving Light Glint */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
        </div>
      </div>
      
      {isProcessing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xl border border-blue-50 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
          <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse shadow-sm"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-blue">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default SmartProgressBar;
