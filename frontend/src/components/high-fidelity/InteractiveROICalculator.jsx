import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const InteractiveROICalculator = ({ type = 'ai' }) => {
  const [value, setValue] = useState(type === 'ai' ? 40 : 30); // Hours saved or Cost reduction %

  const results = useMemo(() => {
    if (type === 'ai') {
      const annualSavings = value * 52 * 80;
      return {
        label: 'Annual Operational Savings',
        value: `$${(annualSavings / 1000).toFixed(0)}k`,
        metric: `${value} Hours`,
        metricLabel: 'Saved Per Week',
        description: 'Estimated reduction in manual cognitive load through agentic workflows.',
        color: 'from-blue-500 to-cyan-400'
      };
    } else if (type === 'cloud') {
      const annualSavings = (value / 100) * 250000;
      return {
        label: 'Estimated Infrastructure Savings',
        value: `$${(annualSavings / 1000).toFixed(0)}k`,
        metric: `${value}%`,
        metricLabel: 'Cost Reduction',
        description: 'Optimized resource allocation through automated cloud scaling.',
        color: 'from-purple-500 to-blue-400'
      };
    } else {
      const efficiencyGain = value * 1.5; // Arbitrary multiplier for modernization impact
      return {
        label: 'Projected Efficiency Boost',
        value: `+${efficiencyGain.toFixed(0)}%`,
        metric: `${value}%`,
        metricLabel: 'Debt Reduction',
        description: 'Decrease in maintenance overhead through legacy modernization.',
        color: 'from-emerald-500 to-teal-400'
      };
    }
  }, [value, type]);

  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${results.color} rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200`}></div>
      
      <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-3">
              <Zap className="w-3 h-3" />
              ROI Impact Simulator
            </div>
            <h3 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">
              {type === 'ai' ? 'AI Productivity' : type === 'cloud' ? 'Cloud Efficiency' : 'Modernization'} Gain
            </h3>
          </div>
          
          <div className="text-right">
            <div className={`text-5xl font-bold bg-gradient-to-r ${results.color} bg-clip-text text-transparent tracking-tighter`}>
              {results.value}
            </div>
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">
              {type === 'transformation' ? 'Strategic Impact' : 'Potential Annual Impact'}
            </div>
          </div>
        </div>

        {/* Slider Section */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {type === 'ai' ? 'Weekly Manual Hours' : type === 'cloud' ? 'Infrastructure Budget Optimization' : 'Technical Debt Elimination'}
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#1D1D1F]">{value}</span>
              <span className="text-gray-400 text-sm font-medium">{type === 'ai' ? 'hrs' : '%'}</span>
            </div>
          </div>
          
          <div className="relative h-12 flex items-center">
            <input
              type="range"
              min={type === 'ai' ? "5" : "10"}
              max={type === 'ai' ? "100" : type === 'cloud' ? "60" : "80"}
              step="1"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-100 dark:bg-[#0a0a0c] rounded-full appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #2564ea 0%, #2564ea ${(value / (type === 'ai' ? 100 : 60)) * 100}%, #f3f4f6 ${(value / (type === 'ai' ? 100 : 60)) * 100}%, #f3f4f6 100%)`
              }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <span>{type === 'ai' ? 'Minimum' : 'Conservative'}</span>
            <span>{type === 'ai' ? 'Enterprise Scale' : 'Aggressive'}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${results.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20 flex-shrink-0`}>
              {type === 'ai' ? <Clock className="w-6 h-6" /> : <DollarSign className="w-6 h-6" />}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{results.metric}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{results.metricLabel}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-snug">
                {results.description}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-10 py-4 px-8 bg-[#1D1D1F] text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn transition-all duration-300 hover:shadow-2xl hover:shadow-black/20`}
        >
          {type === 'ai' ? 'Request an AI Impact Audit' : type === 'cloud' ? 'Analyze My Cloud Efficiency' : 'Request a Modernization Roadmap'}
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>

        {/* Fine Print */}
        <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-medium">
          Calculations based on standard enterprise benchmarks. Results may vary by infrastructure complexity.
        </p>
      </div>
    </div>
  );
};

export default InteractiveROICalculator;
