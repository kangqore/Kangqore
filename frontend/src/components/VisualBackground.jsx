import React, { useEffect, useRef } from 'react';
import orbLogo from '../assets/orb-logo.png';

const VisualBackground = () => {
  const orbRef = useRef(null);

  useEffect(() => {
    // Logic for particles removed as requested
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-white dark:bg-black">
      
      {/* Floating Shapes */}
      <div className="absolute inset-0">
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

       {/* Hero Visual Orb - Hidden on mobile, visible on tablet/desktop */}
       <div className="hidden md:block absolute top-1/2 right-[5%] lg:right-[10%] -translate-y-1/2 opacity-80 lg:opacity-100">
          <div ref={orbRef} className="relative w-[300px] h-[300px] transition-transform duration-300">
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
  );
};

export default VisualBackground;
