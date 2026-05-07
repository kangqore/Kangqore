import React from 'react';
import { ArrowRight } from 'lucide-react';

const SuggestedPromptChip = ({ prompt, onSelect, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onSelect(prompt)}
    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:border-brand-cyan/40 hover:text-brand-blue dark:hover:text-brand-cyan hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
  >
    {prompt}
    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
  </button>
);

export default SuggestedPromptChip;
