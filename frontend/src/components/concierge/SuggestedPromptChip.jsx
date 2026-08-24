import React from 'react';
import { ArrowRight } from 'lucide-react';

const SuggestedPromptChip = ({ prompt, onSelect, disabled, inverted = false }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onSelect(prompt)}
    className="group inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border border-white/15 hover:border-white/40 bg-white/[0.06] hover:bg-white/[0.14] text-white/85 hover:text-white backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_16px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.22)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap hover:-translate-y-0.5 active:scale-95"
  >
    <span>{prompt}</span>
    <ArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-white/70 group-hover:text-white" strokeWidth={2.2} />
  </button>
);

export default SuggestedPromptChip;



