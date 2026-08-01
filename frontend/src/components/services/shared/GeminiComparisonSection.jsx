import React, { useState } from 'react';
import { ExternalLink, MessageSquarePlus, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function GeminiComparisonSection({ comparisonTable }) {
  const [activeTab, setActiveTab] = useState('agentic'); // 'agentic' | 'traditional' | 'side-by-side'
  const [selectedDimension, setSelectedDimension] = useState(0);

  const rows = comparisonTable?.rows || [
    {
      dimension: 'AUTONOMY',
      before: 'Rule-dependent, semi-autonomous — requires human instruction at every branch.',
      after: 'Fully autonomous — perceives context, reasons over goals, and acts without prompting.'
    },
    {
      dimension: 'WORKFLOW',
      before: 'Linear and predefined — breaks on edge cases outside the script.',
      after: 'Multi-step, non-linear, adaptive — self-corrects when conditions change.'
    },
    {
      dimension: 'LEARNING',
      before: 'Static logic — must be manually reprogrammed to handle new scenarios.',
      after: 'Continuous — learns from feedback loops and improves with every execution cycle.'
    },
    {
      dimension: 'INTEGRATION',
      before: 'Siloed or manually stitched — one system, one connector, one team.',
      after: 'Seamless across ERP, CRM, APIs, and legacy systems — agents coordinate across all of them.'
    },
    {
      dimension: 'OUTCOMES',
      before: 'Reactive and incremental — reduces effort on known tasks.',
      after: 'Goal-driven and measurable — delivers business outcomes at enterprise scale.'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#05070d] text-white">
      {/* Technical Grid Paper Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Radial Glow Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-cyan-400/40" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">WHY IT MATTERS</span>
          </div>
          <h2 className="text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem] font-extrabold leading-[1.15] tracking-tight text-white">
            The shift from automation <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              to autonomy.
            </span>
          </h2>
        </div>

        {/* Main Enterprise Visual & Interactive Console Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch relative">
          
          {/* Left Column: Enterprise Hero Photo Frame with Floating Badges */}
          <div className="lg:col-span-5 relative flex flex-col justify-between rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 p-4 sm:p-6 shadow-2xl min-h-[480px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/agentic_autonomy_shift_hero.png"
                alt="Enterprise Autonomous AI Collaboration"
                className="w-full h-full object-cover object-top opacity-90 transition-scale duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/40" />
            </div>

            {/* Top Floating AI Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-white/95 text-slate-950 font-black text-xs flex items-center justify-center shadow-2xl border border-white/50 backdrop-blur-md">
                AI
              </div>
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-bold tracking-widest text-cyan-300 backdrop-blur-md uppercase">
                Enterprise Autonomy
              </span>
            </div>

            {/* Bottom Floating Interactive Command Prompt Pill */}
            <div className="relative z-10 mt-auto pt-8">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl border border-white text-slate-900 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-900">
                    Orchestrate my enterprise workflow using <span className="text-cyan-600 font-extrabold">Autonomous Agents</span>
                  </span>
                </div>
                <span className="w-2.5 h-5 bg-cyan-600 inline-block animate-pulse shrink-0 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Console Panel (IBM Watsonx Style Composition) */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-3xl bg-[#0c1017]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[540px]">
              
              {/* Header Bar & Quick Mode Switcher */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-1">
                      KANGQORE AUTONOMY ENGINE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Hello, welcome to Autonomous Agent Execution.
                    </h3>
                  </div>

                  {/* Top Right Action Icon Stack */}
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <button className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-md">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors">
                      <MessageSquarePlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Perspective Mode Toggle Pills */}
                <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <button
                    onClick={() => setActiveTab('agentic')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === 'agentic'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Agentic AI (Autonomy)
                  </button>
                  <button
                    onClick={() => setActiveTab('traditional')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === 'traditional'
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Traditional Automation
                  </button>
                  <button
                    onClick={() => setActiveTab('side-by-side')}
                    className={`hidden sm:flex flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 items-center justify-center gap-2 ${
                      activeTab === 'side-by-side'
                        ? 'bg-white/10 text-cyan-300 border border-cyan-400/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Side-by-Side Comparison
                  </button>
                </div>

                {/* Main Content Area Based on Mode */}
                {activeTab === 'side-by-side' ? (
                  /* Side by Side Grid View */
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                        TRADITIONAL AUTOMATION
                      </span>
                      {rows.map((r, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                            {r.dimension}
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed">{r.before}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-2">
                        AGENTIC AI (AUTONOMOUS)
                      </span>
                      {rows.map((r, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-400/20">
                          <span className="text-[9px] font-black uppercase text-cyan-400 block mb-1">
                            {r.dimension}
                          </span>
                          <p className="text-xs text-white font-medium leading-relaxed">{r.after}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Tabbed Dynamic Interactive Cards View */
                  <div>
                    {/* Dimension Selection Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                      {rows.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedDimension(idx)}
                          className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            selectedDimension === idx
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {r.dimension}
                        </button>
                      ))}
                    </div>

                    {/* Active Dimension Details Comparison Cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Traditional Card */}
                      <div className={`p-5 rounded-2xl transition-all duration-300 ${
                        activeTab === 'traditional'
                          ? 'bg-slate-800/80 border border-white/20 shadow-xl scale-[1.02]'
                          : 'bg-white/[0.02] border border-white/5 opacity-70'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            TRADITIONAL AUTOMATION
                          </span>
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 mb-2">
                          {rows[selectedDimension].dimension}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {rows[selectedDimension].before}
                        </p>
                      </div>

                      {/* Agentic AI Card */}
                      <div className={`p-5 rounded-2xl transition-all duration-300 ${
                        activeTab === 'agentic' || activeTab === 'side-by-side'
                          ? 'bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-400/40 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                          : 'bg-white/[0.02] border border-white/5 opacity-70'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                            AGENTIC AI
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        </div>
                        <h4 className="text-sm font-bold text-cyan-300 mb-2">
                          {rows[selectedDimension].dimension}
                        </h4>
                        <p className="text-xs text-white font-semibold leading-relaxed">
                          {rows[selectedDimension].after}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Featured Paradigm Shift Banner Card (Watsonx Reference Aesthetic) */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-white/[0.03] to-cyan-500/[0.05] p-5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase block mb-1">
                    FEATURED PARADIGM SHIFT
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Build, deploy and manage autonomous AI agents to automate and accelerate your enterprise work.
                  </h4>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg shadow-purple-600/40">
                    AI
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
