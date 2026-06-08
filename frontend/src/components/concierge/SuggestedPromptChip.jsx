import React from 'react';
import { ArrowRight } from 'lucide-react';

const SuggestedPromptChip = ({ prompt, onSelect, disabled, inverted = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onSelect(prompt)}
    className={`group inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap shadow-sm ${
      inverted
        ? 'border-white/40 bg-white/25 text-white hover:bg-white/40 hover:border-white/60'
        : 'border-white/15 bg-white/[0.08] text-gray-200 hover:text-white hover:bg-white/[0.12] hover:border-brand-cyan/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
    }`}
  >
    {prompt}
    <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
  </button>
);

export default SuggestedPromptChip;
