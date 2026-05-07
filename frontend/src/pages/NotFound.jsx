import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ShieldCheck, Cpu, Cloud } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-[#050505] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Background Radar / Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute w-[400px] h-[400px] border border-cyan-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <div className="relative inline-block mb-6">
          <h1 className="text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-2xl">
            404
          </h1>
          <div className="absolute inset-0 bg-brand-cyan/20 blur-3xl -z-10 mix-blend-screen"></div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          System Anomaly Detected
        </h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed font-light">
          The requested coordinate does not exist within our architecture. The page may have been moved, deleted, or you might have followed a broken link.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link
            to="/"
            className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-black bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Base
          </Link>
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/10 rounded-xl hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:border-cyan-400/50 transition-all duration-300 w-full sm:w-auto"
          >
            Report Issue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/10 pt-10">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Explore Core Systems</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link to="/department/ai-cognitive" className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">AI & Cognitive</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link to="/department/cloud-engineering" className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Cloud Systems</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link to="/department/cybersecurity" className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Cybersecurity</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default NotFound;
