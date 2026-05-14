import React from 'react';
import { ArrowRight } from 'lucide-react';

const SuggestedPromptChip = ({ prompt, onSelect, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onSelect(prompt)}
    className="group inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-brand-cyan/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap"
  >
    {prompt}
    <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
  </button>
);

export default SuggestedPromptChip;
