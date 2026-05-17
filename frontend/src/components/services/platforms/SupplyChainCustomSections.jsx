import React, { useEffect, useRef } from 'react';
import { ArrowRight, Activity, Shield, Map, Workflow, Box, ShieldAlert } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SUPPLY CHAIN MAGNET — Mid-Page Execution CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const SupplyChainReadinessMagnet = () => {
  return (
    <section className="py-24 bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          {/* Background Image with parallax effect inherited by template styles */}
          <div 
            className="absolute -inset-20 z-0" 
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
          
          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
               <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Is Your Supply Chain Exposed?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Don't guess. Deploy the <strong className="text-white">Zero-Latency Network Diagnostic</strong> to instantly identify third-party vendor risk, structural data silos, and trapped working capital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Execute Network Stress Test
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SUPPLY CHAIN CONTROL TOWER — Visual Node Network Simulation
// ═══════════════════════════════════════════════════════════════════════════════
export const SupplyChainControlTower = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Data packet animation tracing pathways
      gsap.fromTo('.sc-packet', 
        { strokeDashoffset: 1000 }, 
        { strokeDashoffset: 0, duration: 4, ease: 'linear', repeat: -1 }
      );
      
      // Node pulse
      gsap.to('.sc-node', {
        scale: 1.25,
        opacity: 1,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.2, from: 'random' }
      });
      
      // Control panel scroll float
      gsap.fromTo('.sc-panel',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden" ref={containerRef}>
      {/* Radial depth background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      
      {/* Background SVG Grid / Map lines */}
      <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 1000 600" className="w-full h-full max-w-[1200px]" fill="none">
           {/* Static network lines */}
           <path d="M100,300 L300,150 L500,250 L800,100 L950,300 L700,500 L400,450 Z" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
           <path d="M300,150 L400,450 M500,250 L700,500" stroke="#3b82f6" strokeWidth="0.5" />
           
           {/* Animated Data Packets (Thick paths tracking the network) */}
           <path className="sc-packet" d="M100,300 L300,150 L500,250 L800,100" stroke="#4ab6d4" strokeWidth="3" strokeDasharray="20 980" />
           <path className="sc-packet" d="M950,300 L700,500 L400,450 L100,300" stroke="#2564ea" strokeWidth="3" strokeDasharray="30 970" style={{ animationDelay: '2s' }} />
           
           {/* Glowing Nodes */}
           {[[100,300], [300,150], [500,250], [800,100], [950,300], [700,500], [400,450]].map((pos, i) => (
             <circle key={i} className="sc-node" cx={pos[0]} cy={pos[1]} r="6" fill="#4ab6d4" filter="drop-shadow(0 0 8px #2564ea)" />
           ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 sc-panel">

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display tracking-tight">
            See the Network. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Control the Execution.</span>
          </h2>
          <p className="text-lg text-gray-400 font-light max-w-3xl mx-auto">
            Our autonomous routing architecture instantly identifies and bypasses critical node failures—ensuring zero downtime in your global supply flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Global Node Mapping', metric: '100%', label: 'Visibility', icon: Map, color: 'text-cyan-400' },
             { title: 'Failure Bypass', metric: '0.0ms', label: 'Latency', icon: Workflow, color: 'text-brand-blue' },
             { title: 'Asset Telemetry', metric: 'Real-Time', label: 'Tracking', icon: Box, color: 'text-blue-400' }
           ].map((item, idx) => (
             <div key={idx} className="sc-panel bg-white dark:bg-gray-900 dark:border-gray-800/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-colors duration-300">
                <div className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 flex items-center justify-center mb-6 border border-white/10 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-mono font-bold text-white mb-1">{item.metric}</div>
                <div className={`text-xs font-bold tracking-widest uppercase mb-4 ${item.color}`}>{item.label}</div>
                <h3 className="text-xl font-bold text-gray-200">{item.title}</h3>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
