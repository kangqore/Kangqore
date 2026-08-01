import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const DIMENSION_ACCENTS = [
  "#FFB7C5", // Row 0: Autonomy (Rose)
  "#FFDDB7", // Row 1: Workflow (Gold)
  "#B1C5FF", // Row 2: Learning (Soft Blue)
  "#4FABFF", // Row 3: Integration (Cyan)
  "#076EFF", // Row 4: Outcomes (Electric Blue)
];

export default function GeminiComparisonSection({ comparisonTable }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <section className="py-28 relative overflow-hidden bg-[#02050b]">
      {/* Sleek ambient background gradient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,211,238,0.12),rgba(255,255,255,0))]" />

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

        {/* Clean, High-End Card Comparison Grid */}
        <div className="grid lg:grid-cols-[1fr_64px_1fr] gap-0 items-stretch relative">
          {/* Before Panel (Traditional Automation) */}
          <div className="rounded-2xl lg:rounded-r-none bg-white/[0.025] backdrop-blur-md border border-white/[0.08] lg:border-r-0 p-8 lg:p-10 shadow-2xl relative z-10 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/50 block mb-8">
                {comparisonTable.colA || 'Traditional Automation'}
              </span>
              <div className="space-y-6">
                {comparisonTable.rows.map((row, i) => {
                  const isHovered = hoveredRow === i;
                  const accentColor = DIMENSION_ACCENTS[i % DIMENSION_ACCENTS.length];
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer relative group ${
                        isHovered
                          ? 'bg-white/[0.06] border border-white/15 shadow-xl translate-x-1'
                          : 'bg-transparent border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-black tracking-[0.3em] uppercase transition-colors ${
                          isHovered ? 'text-white font-bold' : 'text-white/50'
                        }`}>
                          {row.dimension}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100"
                          style={{
                            backgroundColor: isHovered ? accentColor : 'rgba(255,255,255,0.2)',
                            boxShadow: isHovered ? `0 0 10px ${accentColor}` : 'none'
                          }}
                        />
                      </div>
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

          {/* Centre Divider with Pulsing Transition Junction */}
          <div className="hidden lg:flex flex-col items-center justify-center relative z-20">
            <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
            <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 p-[1px] shadow-[0_0_28px_rgba(34,211,238,0.5)] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#040812] flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* After Panel (Agentic AI - Hero Autonomous Card) */}
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
                  const accentColor = DIMENSION_ACCENTS[i % DIMENSION_ACCENTS.length];
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`p-4 rounded-xl transition-all duration-300 cursor-pointer relative group ${
                        isHovered
                          ? 'bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_24px_rgba(34,211,238,0.25)] -translate-x-1'
                          : 'bg-cyan-950/20 border border-cyan-400/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-black tracking-[0.3em] uppercase transition-colors ${
                          isHovered ? 'text-cyan-300 font-extrabold' : 'text-cyan-400/80'
                        }`}>
                          {row.dimension}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: accentColor,
                            boxShadow: isHovered ? `0 0 14px ${accentColor}, 0 0 4px #ffffff` : `0 0 6px ${accentColor}`
                          }}
                        />
                      </div>
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
