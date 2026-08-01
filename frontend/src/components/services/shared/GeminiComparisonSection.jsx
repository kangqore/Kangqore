import React, { useState } from 'react';
import { ExternalLink, MessageSquarePlus, ArrowRight, Sparkles } from 'lucide-react';

export default function GeminiComparisonSection({ comparisonTable }) {
  const [activeRow, setActiveRow] = useState(0);

  const rows = comparisonTable.rows || [];

  return (
    <section className="py-24 relative overflow-hidden bg-[#0d1017] text-white">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Top Radial Glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,211,238,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-cyan-400/40" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">WHY IT MATTERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            {comparisonTable.heading || (
              <>
                The shift from automation<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">to autonomy.</span>
              </>
            )}
          </h2>
        </div>

        {/* Studio Blueprint Showcase Stage */}
        <div className="relative rounded-3xl bg-[#11141c]/90 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden min-h-[640px]">
          
          {/* Blueprint Border Line Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/20 rounded-tl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/20 rounded-br-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 items-stretch relative">
            
            {/* Left Column: Team Collaboration Image Frame */}
            <div className="lg:col-span-5 relative flex flex-col justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl group">
                
                {/* Floating Top-Left "AI" Square Badge */}
                <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-xl bg-white/95 text-neutral-950 font-black text-sm flex items-center justify-center shadow-lg border border-white/80">
                  AI
                </div>

                {/* Team Collaboration Photo */}
                <img
                  src="/autonomous_ai_team_collaboration.png"
                  alt="Team Collaborating on Autonomous Agentic AI"
                  className="w-full h-[440px] lg:h-[500px] object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Inner Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Right Column: Main Dark Interactive Terminal Card */}
            <div className="lg:col-span-7 relative flex flex-col justify-between rounded-2xl bg-[#181c26] border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
              
              {/* Top Side Buttons Bar */}
              <div className="absolute top-0 right-0 flex items-center">
                <button className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button className="w-14 h-14 bg-[#232836] hover:bg-[#2d3345] text-white/80 hover:text-white flex items-center justify-center transition-colors border-l border-white/10">
                  <MessageSquarePlus className="w-5 h-5" />
                </button>
              </div>

              {/* Terminal Welcome Header */}
              <div className="pr-32 mb-8">
                <span className="text-xs font-mono text-white/40 block mb-2">12:46 PM</span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                  Hello, welcome to <span className="text-cyan-400">Kangqore</span> Autonomous AI.
                </h3>
                <div className="w-24 h-1 bg-cyan-400/40 rounded-full mt-3" />
              </div>

              {/* 5 Interactive Comparison Dimension Cards */}
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {rows.map((row, i) => {
                  const isActive = activeRow === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveRow(i)}
                      onMouseEnter={() => setActiveRow(i)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-300 relative ${
                        isActive
                          ? 'bg-[#222938] border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                          : 'bg-[#131722] border-white/5 hover:border-white/20 hover:bg-[#1a1f2e]'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block mb-1.5">
                        {row.dimension}
                      </span>
                      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                        {row.after}
                      </p>
                      <div className="flex items-center justify-end mt-2">
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-cyan-400 translate-x-1' : 'text-white/30'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Dimension Direct Side-by-Side Comparison Box */}
              {rows[activeRow] && (
                <div className="mb-6 p-4 sm:p-5 rounded-xl bg-[#11151f] border border-cyan-400/30 grid sm:grid-cols-2 gap-4">
                  <div className="border-r border-white/10 pr-4">
                    <span className="text-[9px] font-mono uppercase text-white/40 tracking-wider block mb-1">
                      Traditional Automation
                    </span>
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      {rows[activeRow].before}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-cyan-400 tracking-wider block mb-1 font-bold">
                      Agentic AI Autonomy
                    </span>
                    <p className="text-xs text-white font-semibold leading-relaxed">
                      {rows[activeRow].after}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Spacer for Prompt Overlay */}
              <div className="h-12" />
            </div>
          </div>

          {/* Floating Prompt Bar (Bottom-Left Overlay) */}
          <div className="absolute bottom-8 left-8 sm:left-12 z-30 max-w-xl w-full">
            <div className="px-6 py-4 rounded-2xl bg-white/95 text-neutral-900 border border-white shadow-2xl flex items-center gap-3 backdrop-blur-xl">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-sm font-semibold tracking-tight text-neutral-800">
                Orchestrate my workflow using <span className="text-blue-600 font-bold">autonomous agents</span>
              </span>
              <span className="w-0.5 h-5 bg-blue-600 animate-pulse ml-auto" />
            </div>
          </div>

          {/* Bottom-Right Featured Product Overlay Card */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-30 max-w-md w-full sm:w-[380px]">
            <div className="relative p-6 rounded-2xl bg-[#e5e7eb] text-neutral-900 shadow-2xl border border-white/60 overflow-hidden group hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300">
              
              {/* Floating 3D Isometric AI Badge Icon */}
              <div className="absolute -top-3 -right-3 z-20 w-20 h-20 pointer-events-none drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <img
                  src="/ai_isometric_3d_chip.png"
                  alt="3D AI Chip Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Featured Product
              </span>
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug mb-4 pr-12">
                Build, deploy and manage AI agents and assistants to automate and accelerate your work
              </h4>
              
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Learn more about Kangqore Agentic AI
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Bottom Corner Floating Badge */}
              <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-lg">
                AI
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
