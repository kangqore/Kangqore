import React from 'react';

const BIDSProductVisual = ({ isActive = false }) => {
  return (
    <div 
      className={`relative w-full max-w-[400px] xl:max-w-[480px] transition-all duration-1000 ${
        isActive 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-90'
      }`}
    >
      {/* Intense glow effect behind the card */}
      <div className="absolute -inset-10 bg-gradient-to-br from-brand-blue/30 via-cyan-400/20 to-transparent rounded-full blur-3xl opacity-80 animate-pulse mix-blend-screen" style={{ animationDuration: '4s' }} />
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60" />
      
      {/* Dashboard image card with 3D float */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 ring-1 ring-white/10 animate-float backdrop-blur-sm bg-white/5"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 z-10 pointer-events-none" />
        
        <img
          src="/images/hero-bids-dashboard.png"
          alt="Kangqore BIDS™ — Business Intelligence Diagnostic System Dashboard"
          className="w-full h-auto object-cover relative z-0"
          loading="lazy"
        />
        
        {/* Subtle gradient overlay for blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
      </div>

      {/* Floating badge below dashboard */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">
          Live Diagnostic Engine
        </span>
      </div>
    </div>
  );
};

export default BIDSProductVisual;
