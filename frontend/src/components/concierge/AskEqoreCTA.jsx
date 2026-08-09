import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Mid-page CTA that opens the floating eQORE chatbot pre-seeded with
 * service- or department-specific context.
 *
 * Used on:
 *   - ServicePageTemplate (replacing the old GenericMidPageCTA)
 *   - DepartmentPage (inserted before the final dark CTA)
 *
 * On click, dispatches CustomEvent('toggle-eqore-chatbot') with detail:
 *   { surface, name, slug, departmentName?, openOnly: true }
 *
 * EQoreChatbot listens for this and seeds the conversation greeting + chips.
 */
const AskEqoreCTA = ({ kind = 'service', name, slug, departmentName }) => {
  const displayName = (name || '').replace(/\.$/, '').trim();
  const subjectKind = kind === 'department' ? 'practice area' : 'service';

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('toggle-eqore-chatbot', {
        detail: {
          surface: kind,
          name: displayName,
          slug,
          departmentName,
          openOnly: true,
        },
      })
    );
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-brand-cyan">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white dark:bg-black/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white dark:bg-black/10 rounded-full blur-3xl" />
          </div>

          <div className="relative p-10 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 backdrop-blur-sm overflow-hidden shrink-0 flex items-center justify-center p-1">
              <img
                src="/images/eqore-avatar.png"
                alt="eQORE"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/15 border border-white/20 text-[11px] font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" /> eQORE AI<sup className="text-[11px] ml-0.5 opacity-70">™</sup> Assistant
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {displayName
                  ? `Have a question about ${displayName}?`
                  : 'Ask Kangqore AI'}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-white/85 max-w-2xl">
                {displayName
                  ? `Ask eQORE — our AI Assistant — about ${displayName}: what it does, how we approach it, and whether it fits your situation.`
                  : `Ask eQORE about Kangqore's services, departments, and how we engage.`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClick}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all whitespace-nowrap"
              aria-label={
                displayName
                  ? `Ask eQORE about ${displayName}`
                  : 'Ask eQORE'
              }
            >
              {displayName
                ? `Ask eQORE about ${displayName}`
                : 'Ask eQORE'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="relative px-10 sm:px-14 lg:px-16 pb-6 -mt-2 text-[11px] text-white/60 text-center lg:text-left">
            eQORE is trained on Kangqore's {subjectKind} content. For commitments and pricing, confirm with a Kangqore consultant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AskEqoreCTA;
