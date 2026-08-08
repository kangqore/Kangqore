
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, ArrowRight, Sparkles } from 'lucide-react';

const ClientFeedbackWidget = () => {
  return (
    <div className="bg-brand-gradient rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group border border-blue-500/20">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-lg backdrop-blur-sm border border-white/10">
              <MessageSquare className="w-4 h-4 text-blue-100" />
            </div>
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Premium Support
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">How is your experience with Kangqore?</h3>
          <p className="text-blue-50 text-sm leading-relaxed max-w-lg opacity-90">
            Your insights drive our innovation engine. Share your thoughts on delivery, communication, and overall partnership impact.
          </p>
          
          <div className="flex items-center gap-4 mt-5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-white/50 fill-white/20" />
              ))}
            </div>
            <div className="px-2 py-1 rounded bg-white dark:bg-black/10 backdrop-blur-sm">
                <span className="text-xs text-blue-100 font-medium tracking-wide">Rate your engagement</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto">
          <Link 
            to="/dashboard/client/feedback" 
            className="group/btn relative px-8 py-3.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-900 font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 whitespace-nowrap">Share Feedback</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientFeedbackWidget;
