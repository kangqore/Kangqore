import React, { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GoogleGeminiEffect } from '../../ui/GoogleGeminiEffect';

export default function GeminiComparisonSection({ comparisonTable }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0.1, 0.8], [0, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0.1, 0.8], [0, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0.1, 0.8], [0, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0.1, 0.8], [0, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0.1, 0.8], [0, 1.2]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-black">
      {/* Background Gemini Effect SVG Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-40 flex items-center justify-center">
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">WHY IT MATTERS</span>
          </div>
          <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
            {comparisonTable.heading || (
              <>
                The shift from automation<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">to autonomy.</span>
              </>
            )}
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_64px_1fr] gap-0 items-stretch relative">
          {/* Before panel */}
          <div className="rounded-2xl lg:rounded-r-none bg-white/[0.025] backdrop-blur-md border border-white/[0.08] lg:border-r-0 p-8 lg:p-10 shadow-2xl relative z-10">
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/60 block mb-8">
              {comparisonTable.colA || 'Traditional Automation'}
            </span>
            <div className="space-y-7">
              {comparisonTable.rows.map((row, i) => (
                <div key={i}>
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/60 block mb-1.5">{row.dimension}</span>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">{row.before}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Centre divider with pulsing button */}
          <div className="hidden lg:flex flex-col items-center justify-center relative z-20">
            <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
            <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_24px_rgba(34,211,238,0.4)] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#040812] flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* After panel */}
          <div className="rounded-2xl lg:rounded-l-none bg-[#040711]/90 backdrop-blur-md border border-cyan-400/20 lg:border-l-0 border-l-2 border-l-cyan-400/30 p-8 lg:p-10 shadow-2xl relative z-10">
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-cyan-400/90 block mb-8">
              {comparisonTable.colB || 'Agentic AI'}
            </span>
            <div className="space-y-7">
              {comparisonTable.rows.map((row, i) => (
                <div key={i}>
                  <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/60 block mb-1.5">{row.dimension}</span>
                  <p className="text-white font-semibold text-sm leading-relaxed">{row.after}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
