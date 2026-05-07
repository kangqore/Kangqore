import React, { useEffect, useRef } from 'react';
import orbLogo from '../assets/orb-logo.png';

const NewModernSection = () => {
  const particlesRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    // Particle System Logic
    const initParticles = () => {
      const container = particlesRef.current;
      if (!container) return;
      
      const particles = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        // Equivalent to .particle class in CSS
        particle.style.position = 'absolute';
        particle.style.background = 'rgba(0, 0, 0, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = 'float 6s ease-in-out infinite';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        // Random animation delay for natural feel
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
        particles.push(particle);
      }
    };

    initParticles();
    
    // Cleanup if needed (though standard DOM nodes will be cleared by React unmount usually, 
    // explicitly removing children is safer if the ref persists)
    return () => {
      if (particlesRef.current) {
        particlesRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden bg-white dark:bg-black font-sans">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        
        {/* Particles Container */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none"></div>
        
        {/* Floating Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute rounded-full bg-black/5 backdrop-blur-sm border border-black/10"
            style={{ width: '80px', height: '80px', top: '20%', left: '10%', animation: 'floatShape 8s ease-in-out infinite' }}
          ></div>
          <div 
            className="absolute bg-black/5 backdrop-blur-sm border border-black/10"
            style={{ 
              width: '60px', height: '60px', top: '60%', right: '15%', 
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'floatShape 10s ease-in-out infinite reverse' 
            }}
          ></div>
           <div 
            className="absolute rounded-2xl bg-black/5 backdrop-blur-sm border border-black/10"
            style={{ 
              width: '100px', height: '100px', top: '30%', right: '20%', 
              animation: 'floatShape 12s ease-in-out infinite' 
            }}
          ></div>
        </div>
      </div>

      {/* Hero Content - Visual Only */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 w-full items-center h-[500px]">
        {/* Empty Left Column to maintain layout */}
        <div></div>

        {/* Hero Visual Orb */}
        <div className="flex justify-center items-center h-[400px]">
          <div ref={orbRef} className="relative w-[300px] h-[300px] cursor-pointer hover:scale-105 transition-transform duration-300">
            <div 
              className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full overflow-hidden"
              style={{
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 50px rgba(102, 126, 234, 0.4)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            >
              <img src={orbLogo} alt="Kangqore" className="w-full h-full object-cover" />
            </div>
          
          <div 
            className="absolute top-1/2 left-1/2 border-2 border-black/10 rounded-full"
            style={{ width: '150px', height: '150px', transform: 'translate(-50%, -50%)', animation: 'rotate 10s linear infinite' }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 border-2 border-black/10 rounded-full"
            style={{ width: '200px', height: '200px', transform: 'translate(-50%, -50%)', animation: 'rotate 15s linear infinite reverse' }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 border-2 border-black/10 rounded-full"
            style={{ width: '250px', height: '250px', transform: 'translate(-50%, -50%)', animation: 'rotate 20s linear infinite' }}
          ></div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default NewModernSection;
