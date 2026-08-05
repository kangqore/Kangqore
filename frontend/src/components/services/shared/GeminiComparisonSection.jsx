import React, { useState } from 'react';

const DIMENSION_ACCENTS = [
  "#2564ea", // Row 0: Royal Blue
  "#3388ee", // Row 1: Bright Blue
  "#3ea2e4", // Row 2: Sky Blue
  "#44afd9", // Row 3: Aqua Blue
  "#4ab6d4", // Row 4: Bright Cyan-Teal
];

const GRADIENT_STYLE = {
  background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export default function GeminiComparisonSection({ comparisonTable }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const rows = comparisonTable?.rows || [
    {
      dimension: 'AUTONOMY',
      before: 'Rule-dependent, semi-autonomous — requires human instruction at every decision branch.',
      after: 'Fully autonomous — perceives context, reasons over complex goals, and acts without prompting.',
    },
    {
      dimension: 'WORKFLOW',
      before: 'Linear and predefined — breaks or halts on edge cases outside the hardcoded script.',
      after: 'Multi-step, non-linear, adaptive — dynamically plans and self-corrects when conditions change.',
    },
    {
      dimension: 'LEARNING',
      before: 'Static logic — must be manually reprogrammed and redeployed to handle new scenarios.',
      after: 'Continuous feedback loops — learns from environment signals and improves with every execution cycle.',
    },
    {
      dimension: 'INTEGRATION',
      before: 'Siloed or manually stitched — fixed one-to-one API connectors, single pipeline focus.',
      after: 'Universal mesh across ERP, CRM, custom APIs, and legacy systems — agents coordinate cross-functionally.',
    },
    {
      dimension: 'OUTCOMES',
      before: 'Reactive and incremental — reduces effort on narrow known tasks.',
      after: 'Goal-driven and measurable — delivers proactive, autonomous business outcomes at enterprise scale.',
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">WHY IT MATTERS</span>
          </div>
          <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3.2rem] font-extrabold leading-[1.15] tracking-tight text-white">
            {comparisonTable?.heading || (
              <>
                The shift from automation<br />
                to autonomy.
              </>
            )}
          </h2>
        </div>

        {/* 3-Column Comparison Table with Gradient Accents */}
        <div className="rounded-3xl bg-[#030814]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-white/[0.02] text-xs font-black tracking-[0.2em] uppercase">
            <div className="md:col-span-3 p-5 sm:p-6 text-white/50">
              FEATURE
            </div>
            <div className="md:col-span-4 p-5 sm:p-6 text-white/60">
              TRADITIONAL AI / RULES-BASED AUTOMATION
            </div>
            <div className="md:col-span-5 p-5 sm:p-6 flex items-center justify-between">
              <span style={GRADIENT_STYLE} className="font-black">
                AGENTIC AI
              </span>
              <span 
                className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest"
                style={{
                  background: 'rgba(37, 100, 234, 0.2)',
                  border: '1px solid rgba(74, 182, 212, 0.4)',
                  color: '#4ab6d4'
                }}
              >
                AUTONOMOUS
              </span>
            </div>
          </div>

          {/* Table Content Rows */}
          <div className="space-y-0.5">
            {rows.map((row, i) => {
              const isHovered = hoveredRow === i;
              const accentColor = DIMENSION_ACCENTS[i % DIMENSION_ACCENTS.length];

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`grid grid-cols-1 md:grid-cols-12 transition-all duration-300 cursor-pointer ${
                    isHovered ? 'bg-white/[0.04]' : 'bg-transparent'
                  }`}
                >
                  {/* Feature Dimension Column */}
                  <div className="md:col-span-3 p-5 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: isHovered ? `0 0 12px ${accentColor}` : `0 0 4px ${accentColor}`
                        }}
                      />
                      <span className={`text-xs font-black tracking-[0.25em] uppercase transition-colors ${
                        isHovered ? 'text-white font-bold' : 'text-white/70'
                      }`}>
                        {row.dimension}
                      </span>
                    </div>
                  </div>

                  {/* Traditional AI Column */}
                  <div className="md:col-span-4 p-5 sm:p-6">
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isHovered ? 'text-white/80' : 'text-white/40'
                    }`}>
                      {row.before}
                    </p>
                  </div>

                  {/* Agentic AI Column */}
                  <div 
                    className="md:col-span-5 p-5 sm:p-6 transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? 'rgba(37, 100, 234, 0.16)' : 'rgba(37, 100, 234, 0.06)'
                    }}
                  >
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isHovered ? 'text-white font-bold' : 'text-white/95 font-semibold'
                    }`}>
                      {row.after}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
