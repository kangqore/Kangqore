import React, { useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GoogleGeminiEffect } from '../../ui/GoogleGeminiEffect';

const ROW_COLORS = [
  '#38BDF8', // 0: Autonomy (Cyan)
  '#818CF8', // 1: Workflow (Indigo)
  '#A855F7', // 2: Learning (Purple)
  '#F472B6', // 3: Integration (Pink)
  '#FB923C', // 4: Outcomes (Amber)
];

export default function GeminiComparisonSection({ comparisonTable }) {
  const containerRef = useRef(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0.05, 0.75], [0, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0.05, 0.75], [0, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0.05, 0.75], [0, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0.05, 0.75], [0, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0.05, 0.75], [0, 1.2]);

  return (
    <section ref={containerRef} className="py-28 relative overflow-hidden bg-[#02050b]">
      {/* Background Gemini Effect SVG Animation — Synced with Row Ecosystem */}
      <GoogleGeminiEffect
        hoveredRow={hoveredRow}
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />

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
          {/* Before panel (Traditional Automation) */}
          <div className="rounded-2xl lg:rounded-r-none bg-[#080d1a]/85 backdrop-blur-md border border-white/[0.08] lg:border-r-0 p-8 lg:p-10 shadow-2xl relative z-10 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/50 block mb-8">
                {comparisonTable.colA || 'Traditional Automation'}
              </span>
              <div className="space-y-6">
                {comparisonTable.rows.map((row, i) => {
                  const isHovered = hoveredRow === i;
                  const color = ROW_COLORS[i % ROW_COLORS.length];
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`relative p-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                        isHovered
                          ? 'bg-white/[0.07] border border-white/20 shadow-xl translate-x-1'
                          : 'bg-transparent border border-transparent'
                      }`}
                    >
                      {/* Synaptic Terminal Node Dot (Right edge anchor) */}
                      <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                          isHovered ? 'scale-150 shadow-[0_0_12px_currentColor]' : 'opacity-40'
                        }`}
                        style={{ backgroundColor: color, color: color }}
                      />

                      <span className={`text-[8px] font-black tracking-[0.3em] uppercase block mb-1.5 transition-colors ${
                        isHovered ? 'text-white' : 'text-white/50'
                      }`}>
                        {row.dimension}
                      </span>
                      <p className={`text-sm font-medium leading-relaxed transition-colors ${
                        isHovered ? 'text-white/80' : 'text-white/40'
                      }`}>
                        {row.before}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Centre divider with pulsing transition node */}
          <div className="hidden lg:flex flex-col items-center justify-center relative z-20">
            <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
            <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-[0_0_28px_rgba(34,211,238,0.6)] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#040812] flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* After panel (Agentic AI - Glowing Hero Card) */}
          <div className="rounded-2xl lg:rounded-l-none bg-gradient-to-br from-[#06142a]/95 via-[#030a18]/95 to-[#020712]/95 backdrop-blur-md border border-cyan-400/30 lg:border-l-0 border-l-2 border-l-cyan-400/40 p-8 lg:p-10 shadow-[0_0_50px_rgba(34,211,238,0.12)] relative z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-cyan-400 block">
                  {comparisonTable.colB || 'Agentic AI'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                  Autonomous
                </span>
              </div>
              <div className="space-y-6">
                {comparisonTable.rows.map((row, i) => {
                  const isHovered = hoveredRow === i;
                  const color = ROW_COLORS[i % ROW_COLORS.length];
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`relative p-3.5 rounded-xl transition-all duration-300 cursor-pointer ${
                        isHovered
                          ? 'bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_24px_rgba(34,211,238,0.25)] -translate-x-1'
                          : 'bg-cyan-950/20 border border-cyan-400/10'
                      }`}
                    >
                      {/* Synaptic Terminal Node Dot (Left edge anchor) */}
                      <div
                        className={`absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                          isHovered ? 'scale-150 shadow-[0_0_12px_currentColor]' : 'opacity-40'
                        }`}
                        style={{ backgroundColor: color, color: color }}
                      />

                      <span className={`text-[8px] font-black tracking-[0.3em] uppercase block mb-1.5 transition-colors ${
                        isHovered ? 'text-cyan-300' : 'text-cyan-400/80'
                      }`}>
                        {row.dimension}
                      </span>
                      <p className={`text-sm leading-relaxed transition-colors ${
                        isHovered ? 'text-white font-bold' : 'text-white/95 font-semibold'
                      }`}>
                        {row.after}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
