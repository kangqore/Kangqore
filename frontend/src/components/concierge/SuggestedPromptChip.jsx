import React from 'react';
import { ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

const SuggestedPromptChip = ({ prompt, onSelect, disabled, inverted = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => {
      triggerHaptic('light');
      onSelect(prompt);
    }}
    className="group inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-2 rounded-full border border-white/20 hover:border-white/45 bg-black/30 hover:bg-black/50 text-white/95 hover:text-white backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.35)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap hover:scale-[1.03] active:scale-95"
  >
    <span>{prompt}</span>
    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white/80 group-hover:text-white" strokeWidth={2.2} />
  </button>
);

export default SuggestedPromptChip;



