import React from 'react';
import { ArrowRight } from 'lucide-react';

const SuggestedPromptChip = ({ prompt, onSelect, disabled, inverted = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onSelect(prompt)}
    className="group inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.07] hover:bg-white/[0.16] text-white/90 hover:text-white backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap hover:-translate-y-0.5 active:scale-95"
  >
    <span>{prompt}</span>
    <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white/80 group-hover:text-white" strokeWidth={2.5} />
  </button>
);

export default SuggestedPromptChip;



