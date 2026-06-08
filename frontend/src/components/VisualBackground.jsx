import React, { useEffect, useRef } from 'react';
import orbLogo from '../assets/orb-logo.png';

const VisualBackground = ({ forceDark = false }) => {
  const orbRef = useRef(null);

  useEffect(() => {
    // Logic for particles removed as requested
  }, []);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${!forceDark ? 'bg-white dark:bg-black' : ''}`}
      style={forceDark ? { backgroundColor: '#06090f' } : undefined}
    >
      
      {/* Background Shapes Removed for ultra-clean look */}

       {/* Architectural View - Stats around the Orb (Hidden on mobile) */}
       {/* Added mt-12 (48px / 1.2cm) to push the orb downwards exactly the same amount as the left text block */}
       <div className="hidden md:block absolute top-1/2 right-[5%] lg:right-[12%] -translate-y-1/2 mt-12 opacity-90 lg:opacity-100">
          <div ref={orbRef} className="relative w-[500px] h-[500px] transition-transform duration-300">
            
            {/* Orbital Rings Removed for ultra-clean look */}

            {/* Central Orb */}
            <div 
              className="absolute top-1/2 left-1/2 w-[120px] h-[120px] rounded-full overflow-hidden z-10 bg-[#06090f] border border-white/10"
              style={{
                transform: 'translate(-50%, -50%)',
                boxShadow: forceDark ? '0 0 60px rgba(34, 211, 238, 0.2), inset 0 0 20px rgba(255,255,255,0.05)' : '0 0 50px rgba(37, 100, 234, 0.2)',
              }}
            >
              <img src={orbLogo} alt="Kangqore" className="w-full h-full object-cover opacity-90 mix-blend-screen" />
            </div>

            {/* Ultra-Premium Glassmorphic Cards on Orbital Paths */}
            
            {/* Outer Ring - Top Left */}
            <div className="absolute flex items-center gap-4 bg-[#0a0f1a]/60 backdrop-blur-md border border-cyan-500/30 p-3 pr-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:bg-[#0a0f1a]/80 hover:border-cyan-400/50 transition-all duration-500 z-20 cursor-default group" 
                 style={{ top: '30px', left: '250px', transform: 'translate(-50%, -50%)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 opacity-70"></div>
              <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/10 transition-colors duration-500 relative bg-[#0a0f1a]">
                <div className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              </div>
              <div className="font-mono">
                <div className="text-xl font-bold text-cyan-50 tracking-widest leading-none">16</div>
                <div className="text-[9px] text-cyan-400/70 font-semibold uppercase tracking-[0.2em] mt-1">PILLARS</div>
              </div>
            </div>

            {/* Inner Ring - Top Right */}
            <div className="absolute flex items-center gap-4 bg-[#0a0f1a]/60 backdrop-blur-md border border-blue-500/30 p-3 pr-6 shadow-[0_0_20px_rgba(96,165,250,0.1)] hover:bg-[#0a0f1a]/80 hover:border-blue-400/50 transition-all duration-500 z-20 cursor-default group" 
                 style={{ top: '80px', left: '440px', transform: 'translate(-50%, -50%)', clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-400 opacity-70"></div>
              <div className="w-10 h-10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 transition-colors duration-500 relative bg-[#0a0f1a]">
                <div className="w-1.5 h-1.5 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
              </div>
              <div className="font-mono">
                <div className="text-xl font-bold text-blue-50 tracking-widest leading-none">06</div>
                <div className="text-[9px] text-blue-400/70 font-semibold uppercase tracking-[0.2em] mt-1">ENGINES</div>
              </div>
            </div>

            {/* Inner Ring - Bottom Left */}
            <div className="absolute flex items-center gap-4 bg-[#0a0f1a]/60 backdrop-blur-md border border-blue-500/30 p-3 pr-6 shadow-[0_0_20px_rgba(96,165,250,0.1)] hover:bg-[#0a0f1a]/80 hover:border-blue-400/50 transition-all duration-500 z-20 cursor-default group" 
                 style={{ top: '420px', left: '440px', transform: 'translate(-50%, -50%)', clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-400 opacity-70"></div>
              <div className="w-10 h-10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 transition-colors duration-500 relative bg-[#0a0f1a]">
                <div className="w-1.5 h-1.5 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
              </div>
              <div className="font-mono">
                <div className="text-xl font-bold text-blue-50 tracking-widest leading-none">10</div>
                <div className="text-[9px] text-blue-400/70 font-semibold uppercase tracking-[0.2em] mt-1">DELIVERABLES</div>
              </div>
            </div>

            {/* Right Middle - 61 Services (between Engines and Deliverables) */}
            <div className="absolute flex items-center gap-4 bg-[#0a0f1a]/60 backdrop-blur-md border border-cyan-500/30 p-3 pr-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:bg-[#0a0f1a]/80 hover:border-cyan-400/50 transition-all duration-500 z-20 cursor-default group"
                 style={{ top: '250px', left: '440px', transform: 'translate(-50%, -50%)', clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 opacity-70"></div>
              <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/10 transition-colors duration-500 relative bg-[#0a0f1a]">
                <div className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              </div>
              <div className="font-mono">
                <div className="text-xl font-bold text-cyan-50 tracking-widest leading-none">61</div>
                <div className="text-[9px] text-cyan-400/70 font-semibold uppercase tracking-[0.2em] mt-1">SERVICES</div>
              </div>
            </div>

            {/* Outer Ring - Bottom Right */}
            <div className="absolute flex items-center gap-4 bg-[#0a0f1a]/60 backdrop-blur-md border border-cyan-500/30 p-3 pr-6 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:bg-[#0a0f1a]/80 hover:border-cyan-400/50 transition-all duration-500 z-20 cursor-default group" 
                 style={{ top: '470px', left: '250px', transform: 'translate(-50%, -50%)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 opacity-70"></div>
              <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/10 transition-colors duration-500 relative bg-[#0a0f1a]">
                <div className="w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              </div>
              <div className="font-mono">
                <div className="text-xl font-bold text-cyan-50 tracking-widest leading-none">10</div>
                <div className="text-[9px] text-cyan-400/70 font-semibold uppercase tracking-[0.2em] mt-1">EDITIONS</div>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default VisualBackground;
