import React from 'react';

const BIDSProductVisual = ({ isActive = false }) => {
  return (
    <div 
      className={`relative w-full max-w-[360px] xl:max-w-[400px] transition-all duration-1000 ${
        isActive 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
    >
      {/* Glow effect behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/20 via-cyan-400/10 to-transparent rounded-3xl blur-2xl opacity-60" />
      
      {/* Dashboard image card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
        <img
          src="/images/hero-bids-dashboard.png"
          alt="Kangqore BIDS™ — Business Intelligence Diagnostic System Dashboard"
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        
        {/* Subtle gradient overlay for blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating badge below dashboard */}
      <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
          Live Diagnostic Engine
        </span>
      </div>
    </div>
  );
};

export default BIDSProductVisual;
