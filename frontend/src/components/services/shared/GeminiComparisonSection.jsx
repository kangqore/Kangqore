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

export default function GeminiComparisonSection({ comparisonTable, lede }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  // The column labels used to be hard-coded to "TRADITIONAL AI / RULES-BASED
  // AUTOMATION" vs "AGENTIC AI". That is the right framing for one service and
  // wrong for the rest — on /services/mlops the heading read "Legacy MLOps vs.
  // Governed Enterprise MLOps" while the columns underneath it still argued
  // about agentic autonomy. The defaults are unchanged, so the pages that were
  // correct stay correct.
  const beforeLabel = comparisonTable?.beforeLabel || 'TRADITIONAL AI / RULES-BASED AUTOMATION';
  const afterLabel = comparisonTable?.afterLabel || 'AGENTIC AI';
  const afterBadge = comparisonTable?.afterBadge || 'AUTONOMOUS';
  const beforeShort = comparisonTable?.beforeShort || 'Rules-based';
  const afterShort = comparisonTable?.afterShort || 'Agentic';

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
    <section className="py-24 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{comparisonTable?.eyebrow || 'WHY IT MATTERS'}</span>
          </div>
          <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3.2rem] font-extrabold leading-[1.15] tracking-tight text-white">
            {/* Newlines in the data become line breaks, the same convention
                heroTitle already uses, so a service can control where its
                comparison heading wraps. */}
            {comparisonTable?.heading
              ? comparisonTable.heading.split('\n').map((line, li) => (
                  <React.Fragment key={li}>{li > 0 && <br />}{line}</React.Fragment>
                ))
              : (
                <>
                  The shift from automation<br />
                  to autonomy.
                </>
              )}
          </h2>
          {/* Answer-first lead-in: the section previously went straight from the
              heading into the comparison table, leaving nothing for featured
              snippets or AI answer engines to extract. */}
          <p className="mt-5 text-white/55 text-base font-medium leading-relaxed max-w-3xl">
            {lede || 'The difference is not speed of execution but who decides the next step. Rule-based automation follows a script a human wrote in advance; an agentic system evaluates the current state against a goal and chooses the action itself, escalating when the decision exceeds its remit.'}
          </p>
        </div>

        {/* Real <table> semantics, deliberately.
            This renders as a CSS grid, and `display: grid` on <table>/<tr>
            strips the implicit table roles in Chrome and Firefox. So the
            elements carry the structure for crawlers and LLM readers, which
            parse raw HTML, and the explicit ARIA roles restore that same
            structure for assistive technology, which reads the computed tree.
            Removing either half breaks one of the two audiences. */}
        <div className="rounded-[30px] bg-[#0c0d14]/65 backdrop-blur-[60px] backdrop-saturate-200 shadow-[0_35px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/[0.14] overflow-hidden relative">
          <table role="table" className="w-full text-left border-collapse">
            <caption className="sr-only">
              {`${beforeLabel} compared with ${afterLabel} across ${rows.length} dimensions.`}
            </caption>

            <thead role="rowgroup" className="hidden md:table-header-group">
              <tr role="row" className="md:grid md:grid-cols-12 bg-white/[0.03] text-xs font-black tracking-[0.2em] uppercase border-b border-white/[0.08]">
                <th role="columnheader" scope="col" className="md:col-span-3 p-5 sm:p-6 text-white/50 font-black">
                  {comparisonTable?.dimensionLabel || 'FEATURE'}
                </th>
                <th role="columnheader" scope="col" className="md:col-span-4 p-5 sm:p-6 text-white/60 font-black border-r border-white/[0.06]">
                  {beforeLabel}
                </th>
                <th role="columnheader" scope="col" className="md:col-span-5 p-5 sm:p-6 flex items-center justify-between font-black bg-white/[0.02]">
                  <span style={GRADIENT_STYLE} className="font-black">
                    {afterLabel}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest bg-white/[0.08] border border-white/20 text-white backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  >
                    {afterBadge}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody role="rowgroup">
              {rows.map((row, i) => {
                const isHovered = hoveredRow === i;
                const accentColor = DIMENSION_ACCENTS[i % DIMENSION_ACCENTS.length];

                return (
                  <tr
                    key={i}
                    role="row"
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`grid grid-cols-1 md:grid-cols-12 transition-all duration-300 border-b border-white/[0.05] last:border-b-0 ${
                      isHovered ? 'bg-white/[0.06]' : 'bg-transparent'
                    }`}
                  >
                    <th
                      role="rowheader"
                      scope="row"
                      className="md:col-span-3 px-5 pt-4 pb-2 sm:p-6 flex items-center justify-between font-normal"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0"
                          style={{
                            backgroundColor: accentColor,
                            boxShadow: isHovered ? `0 0 14px ${accentColor}` : `0 0 6px ${accentColor}`
                          }}
                        />
                        <span className={`text-xs font-black tracking-[0.25em] uppercase transition-colors ${
                          isHovered ? 'text-white font-bold' : 'text-white/75'
                        }`}>
                          {row.dimension}
                        </span>
                      </span>
                    </th>

                    <td role="cell" className="md:col-span-4 px-5 pb-3 sm:p-6 border-r border-white/[0.06]">
                      <span className="md:hidden block text-[11px] font-black tracking-[0.2em] uppercase text-white/50 mb-1">
                        {beforeShort}
                      </span>
                      <p className={`text-sm leading-relaxed transition-colors ${
                        isHovered ? 'text-white/85' : 'text-white/55'
                      }`}>
                        {row.before}
                      </p>
                    </td>

                    <td
                      role="cell"
                      className="md:col-span-5 px-5 py-4 sm:p-6 transition-all duration-300 relative"
                      style={{
                        backgroundColor: isHovered ? 'rgba(37, 100, 234, 0.18)' : 'rgba(37, 100, 234, 0.08)'
                      }}
                    >
                      <span className="md:hidden block text-[11px] font-black tracking-[0.2em] uppercase mb-1" style={GRADIENT_STYLE}>
                        {afterShort}
                      </span>
                      <p className={`text-sm leading-relaxed transition-colors ${
                        isHovered ? 'text-white font-bold' : 'text-white/95 font-semibold'
                      }`}>
                        {row.after}
                      </p>
                      {row.link?.href && (
                        <a
                          href={row.link.href}
                          className="mt-3 inline-flex items-center gap-1.5 py-1 min-h-[24px] text-xs font-semibold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:underline underline-offset-4 transition-colors"
                        >
                          {row.link.label}
                          <span aria-hidden="true">&rarr;</span>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
