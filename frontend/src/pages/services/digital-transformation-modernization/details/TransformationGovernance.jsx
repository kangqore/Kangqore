import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, BarChart3, Target, Settings, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TransformationGovernance = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/services/digital-transformation-modernization/technology-transformation" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-blue transition-colors group mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Technology Transformation
        </Link>
        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 font-display">Transformation Governance & Value Management</h1>
        <p className="text-xl text-slate-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          Premium high-fidelity content for this pillar is being engineered. 
          Kangqore establishes execution discipline through KPI-driven governance and value realization frameworks.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-xl">
           Under Construction <Settings className="w-5 h-5 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default TransformationGovernance;
