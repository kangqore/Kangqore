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
      {/* Dashboard image card */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <img
          src="/images/capabilities/data-analytics.png"
          alt="Kangqore BIDS™ — Data Analytics Intelligence"
          className="w-full h-auto object-cover relative z-0"
          loading="lazy"
        />
        
        {/* Subtle gradient overlay for blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
      </div>

    </div>
  );
};

export default BIDSProductVisual;
