import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const symptoms = [
  'Slower growth',
  'Rising operational costs',
  'Reduced productivity',
  'Customer friction',
  'Technology complexity',
  'Security concerns',
  'Inconsistent execution',
  'Poor return on investment',
  'Transformation initiatives that fail to deliver',
];

const costItems = [
  { text: 'Operational inefficiencies compound over time',     color: '#FB923C' },
  { text: 'Technology debt accumulates undetected',            color: '#F472B6' },
  { text: 'Security exposure increases without visibility',    color: '#E8614A' },
  { text: 'Growth opportunities remain undiscovered',          color: '#FDE047' },
  { text: 'Transformation budgets produce lower returns',      color: '#A78BFA' },
  { text: 'Capital is allocated to symptoms, not root causes', color: '#22D3EE' },
];

const constraints = [
  { constraint: 'Poor Processes',           impact: 'Increased operational costs' },
  { constraint: 'Technology Debt',          impact: 'Slower innovation velocity' },
  { constraint: 'Weak Cybersecurity',       impact: 'Higher breach exposure' },
  { constraint: 'Low AI Readiness',         impact: 'Lost competitive advantage' },
  { constraint: 'Data Silos',               impact: 'Poor decision quality' },
  { constraint: 'Workforce Inefficiencies', impact: 'Reduced productivity' },
  { constraint: 'Fragmented Systems',       impact: 'Lower ROI on technology' },
  { constraint: 'Governance Gaps',          impact: 'Compliance and regulatory risk' },
];

export default function ProblemTrilogy() {
  const outerRef = useRef(null);
  const p1Ref    = useRef(null);
  const p2Ref    = useRef(null);
  const p3Ref    = useRef(null);
  const seg1Ref  = useRef(null);
  const seg2Ref  = useRef(null);
  const seg3Ref  = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      gsap.set([p2Ref.current, p3Ref.current], { opacity: 0, y: 56 });
      gsap.set(seg2Ref.current, { opacity: 0.2 });
      gsap.set(seg3Ref.current, { opacity: 0.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          pin: true,
          anticipatePin: 1,
          start: 'top top',
          end: '+=120%',
          scrub: 0.8,
        },
      });

      // Panel 1 → Panel 2
      tl.to(p1Ref.current,  { opacity: 0, y: -56, ease: 'none', duration: 0.32 }, 0)
        .to(p2Ref.current,  { opacity: 1, y: 0,   ease: 'none', duration: 0.32 }, 0.18)
        .to(seg1Ref.current, { opacity: 0.2,       ease: 'none', duration: 0.12 }, 0.1)
        .to(seg2Ref.current, { opacity: 1,         ease: 'none', duration: 0.14 }, 0.18);

      // Panel 2 → Panel 3
      tl.to(p2Ref.current,  { opacity: 0, y: -56, ease: 'none', duration: 0.32 }, 0.5)
        .to(p3Ref.current,  { opacity: 1, y: 0,   ease: 'none', duration: 0.32 }, 0.68)
        .to(seg2Ref.current, { opacity: 0.2,       ease: 'none', duration: 0.12 }, 0.6)
        .to(seg3Ref.current, { opacity: 1,         ease: 'none', duration: 0.14 }, 0.68);
    });

    return () => mm.revert();
  }, []);

  // ─── Shared panel content (used in both desktop/mobile) ──────────────────

  const Panel1Content = () => (
    <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
      <div>
        <p className="text-xs font-bold tracking-[0.3em] text-red-400 uppercase mb-8">The Problem</p>
        <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black leading-[1.35] tracking-[-0.03em] text-white mb-10">
          Organizations rarely fail<br />
          because they lack{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 filter drop-shadow-[0_0_20px_rgba(225,29,72,0.3)]">
            ambition.
          </span>
        </h2>
        <div className="space-y-7 text-white/60 leading-relaxed text-base sm:text-lg font-medium">
          <p>
            They struggle because critical constraints remain{' '}
            <span className="font-bold text-white">hidden beneath the surface</span> of the business.
          </p>
          <p>
            Operational inefficiencies accumulate unnoticed. Technology environments become fragmented.
            Growth engines underperform. Security risks increase. Decision-making slows.
          </p>
          <p>
            Without a comprehensive diagnosis, organizations risk investing in solutions that address{' '}
            <em className="text-white/80">symptoms</em> rather than <em className="text-white/80">causes</em>.
          </p>
          <div className="p-6 mt-8 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-black text-white text-lg tracking-wide">
              This is why we engineered Kangqore BIDS™.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:pt-8">
        <p className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-8">FAMILIAR SYMPTOMS</p>
        <div className="space-y-5">
          {symptoms.map((s) => (
            <div key={s} className="flex items-center gap-5">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-white/70 text-sm font-semibold">{s}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-white/35 font-medium leading-relaxed">
          These symptoms are rarely the root problem. The underlying causes exist across interconnected
          systems, functions, teams, and decision-making structures.
        </p>
      </div>
    </div>
  );

  const Panel2Content = () => (
    <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
      <div>
        <p className="text-[10px] font-black tracking-[0.45em] text-red-400 uppercase mb-8">THE ECONOMIC REALITY</p>
        <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-10">
          The cost of<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">
            not knowing.
          </span>
        </h2>
        <div className="space-y-7 text-white/50 text-base sm:text-lg leading-relaxed font-medium">
          <p>
            Organizations rarely fail because they lack investment. They fail because investments
            are directed toward the wrong priorities.
          </p>
          <p>
            Without diagnostic intelligence, operational inefficiencies compound, technology debt
            accumulates, security exposure increases, and growth opportunities remain
            undiscovered — while transformation budgets produce diminishing returns.
          </p>
          <p className="text-white/75 font-semibold">
            The cost of misdiagnosis is often significantly greater than the cost of
            transformation itself.
          </p>
        </div>
      </div>
      <div className="lg:pt-16">
        <p className="text-[10px] font-black tracking-[0.45em] text-white/60 uppercase mb-8">
          WITHOUT DIAGNOSTIC INTELLIGENCE
        </p>
        <div className="space-y-0">
          {costItems.map((item, i, arr) => (
            <div key={item.text}>
              <div className="flex items-center gap-5 py-5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-white/65 text-sm font-semibold leading-snug">{item.text}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-2.5 ml-[2.75px] bg-white/[0.05]" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 border border-white/[0.07] bg-white/[0.02] rounded-2xl">
          <p className="text-white font-black text-base leading-snug">
            Every major investment decision made without a diagnostic baseline carries a hidden
            cost that compounds over time.
          </p>
        </div>
      </div>
    </div>
  );

  const Panel3Content = () => (
    <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
      <div>
        <p className="text-[10px] font-black tracking-[0.45em] text-red-400 uppercase mb-8">THE REAL COST</p>
        <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-10">
          Every hidden constraint<br />
          has a <span className="text-red-400">measurable cost.</span>
        </h2>
        <p className="text-white/40 text-base font-medium leading-relaxed mb-10">
          Every constraint that goes undiagnosed has a compounding business cost. The question is
          not whether these costs exist — but whether your organization has measured them.
        </p>
        <p className="text-lg sm:text-xl font-black text-cyan-400 leading-snug">
          The diagnostic quantifies these costs before they become business failures.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-2 pb-3 mb-1">
          <p className="text-[9px] font-black tracking-[0.4em] text-white/60 uppercase">CONSTRAINT</p>
          <p className="text-[9px] font-black tracking-[0.4em] text-white/60 uppercase">BUSINESS IMPACT</p>
        </div>
        {constraints.map((row) => (
          <div key={row.constraint} className="grid grid-cols-2 py-5 border-t border-white/[0.06]">
            <p className="text-white font-bold text-sm">{row.constraint}</p>
            <p className="text-white/45 font-medium text-sm">{row.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000000' }}>

      {/* ═══════════════════════ DESKTOP: GSAP pinned ═══════════════════════ */}
      <div
        ref={outerRef}
        className="hidden lg:block"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Inner: this is what GSAP pins — must be 100vh tall */}
        <div className="h-screen overflow-hidden relative border-t border-white/[0.05]">

          {/* ── Left accent line ─────────────────────────────────────── */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.15), transparent)' }}
          />

          {/* ── Progress indicator — bottom, aligned to content ──────── */}
          <div className="absolute bottom-8 left-0 right-0 z-30">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center gap-7">
              <div ref={seg1Ref} className="flex items-center gap-3">
                <div className="w-7 h-px bg-white rounded-full" />
                <span className="text-[8px] font-black tracking-[0.35em] text-white uppercase">The Problem</span>
              </div>
              <div ref={seg2Ref} className="flex items-center gap-3">
                <div className="w-7 h-px bg-white rounded-full" />
                <span className="text-[8px] font-black tracking-[0.35em] text-white uppercase">Economic Reality</span>
              </div>
              <div ref={seg3Ref} className="flex items-center gap-3">
                <div className="w-7 h-px bg-white rounded-full" />
                <span className="text-[8px] font-black tracking-[0.35em] text-white uppercase">The Real Cost</span>
              </div>
            </div>
          </div>

          {/* ── Panel 1: The Problem ──────────────────────────────────── */}
          <div ref={p1Ref} className="absolute inset-0 flex items-center pb-12">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <Panel1Content />
            </div>
          </div>

          {/* ── Panel 2: Economic Reality ────────────────────────────── */}
          <div ref={p2Ref} className="absolute inset-0 flex items-center pb-12">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <Panel2Content />
            </div>
          </div>

          {/* ── Panel 3: The Real Cost ───────────────────────────────── */}
          <div ref={p3Ref} className="absolute inset-0 flex items-center pb-12">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <Panel3Content />
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════ MOBILE: stacked ════════════════════════════ */}
      <div className="lg:hidden" style={{ backgroundColor: '#000000' }}>

        {/* Panel 1 */}
        <div className="py-16 px-5 sm:py-24 sm:px-6 border-t border-white/[0.05]">
          <Panel1Content />
        </div>

        {/* Panel 2 */}
        <div className="py-16 px-5 sm:py-24 sm:px-6 border-t border-white/[0.06]">
          <Panel2Content />
        </div>

        {/* Panel 3 */}
        <div className="py-16 px-5 sm:py-24 sm:px-6 border-t border-white/[0.06]">
          <Panel3Content />
        </div>

      </div>
    </div>
  );
}
