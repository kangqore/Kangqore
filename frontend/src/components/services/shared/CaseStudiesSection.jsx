// ─── Case Studies / Proof Section — shared, template-level ───────────────────
// Renders client proof as challenge → approach → outcome cards. Wired into
// ServicePageTemplate and shown ONLY when a service supplies `caseStudies`
// data — so adding this component ships nothing visible until real proof is
// populated. No fabricated content: every field comes from real engagements.
//
// Service data shape (all consumed by ServicePageTemplate):
//   service.caseStudies = [
//     {
//       client:    'Client name, or "Confidential — Fortune 500 retailer"',
//       industry:  'Logistics',                       // short tag
//       challenge: 'The problem the client faced.',
//       approach:  'What Kangqore did.',
//       outcome:   'The result delivered.',
//       metric:    { value: '60%', label: 'faster release cycle' }, // optional
//     },
//   ]
//   service.caseStudiesTitle  (optional) — section heading override
//   service.caseStudiesIntro  (optional) — section intro paragraph
//
// Brand tokens only: brand-blue #2564ea / brand-cyan #4ab6d4 / brand-gradient.
// ──────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';

const CaseStudiesSection = ({ caseStudies, title, intro, serviceName }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!caseStudies || caseStudies.length === 0) return null;

  const cols = caseStudies.length === 1 ? 'lg:grid-cols-1 max-w-3xl mx-auto'
    : caseStudies.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <section
      ref={ref}
      className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Proof, Not Promises</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            {title || (<>Client{' '}<span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Outcomes.</span></>)}
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8" />
          {intro && <p className="text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">{intro}</p>}
        </div>

        {/* Case-study cards */}
        <div className={`grid grid-cols-1 ${cols} gap-8`}>
          {caseStudies.map((cs, idx) => (
            <article
              key={idx}
              className="group flex flex-col rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s ease ${idx * 0.12}s, transform 0.6s ease ${idx * 0.12}s, box-shadow 0.5s, translate 0.5s`,
              }}
            >
              {/* Client + industry */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{cs.client}</h3>
                  {cs.industry && (
                    <span className="mt-1 inline-block text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase">{cs.industry}</span>
                  )}
                </div>
                <Quote className="w-7 h-7 text-brand-blue/15 flex-shrink-0" />
              </div>

              {/* Headline metric */}
              {cs.metric && (
                <div className="mb-7 pb-7 border-b border-gray-200/70 dark:border-gray-800">
                  <div className="text-5xl font-extrabold font-display text-transparent bg-clip-text bg-brand-gradient leading-none">{cs.metric.value}</div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-light">{cs.metric.label}</div>
                </div>
              )}

              {/* Challenge / Approach / Outcome */}
              <div className="space-y-5 flex-1">
                {[
                  { k: 'Challenge', v: cs.challenge },
                  { k: 'What We Did', v: cs.approach },
                  { k: 'Outcome', v: cs.outcome },
                ].filter(b => b.v).map((b) => (
                  <div key={b.k}>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1.5">{b.k}</div>
                    <p className="text-[15px] text-gray-600 dark:text-gray-300 font-light leading-relaxed">{b.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 h-1 w-0 group-hover:w-16 bg-brand-gradient rounded-full transition-all duration-500" />
            </article>
          ))}
        </div>

        {serviceName && (
          <p className="mt-12 text-sm text-gray-400 dark:text-gray-500 font-light">
            Selected engagements. Client details shared under the terms of each agreement.
          </p>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;
