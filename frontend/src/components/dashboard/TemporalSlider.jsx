import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, BrainCircuit, Activity, RotateCcw } from 'lucide-react';
import { useTemporalContext } from '../../context/TemporalContextManager';

export const TemporalSlider = () => {
  const { temporalCoordinate, setTemporalCoordinate, temporalMode, setIsScrubbing, snapToPresent } = useTemporalContext();
  
  // Internal state for fluid dragging
  const [dragX, setDragX] = useState(0);
  const sliderRef = useRef(null);

  // Constants for time mapping (e.g. +/- 30 days)
  const maxDays = 30;
  
  // Sync dragX with temporalCoordinate when not scrubbing
  useEffect(() => {
    const now = new Date();
    const diffTime = temporalCoordinate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Convert diffDays to percentage (-100 to 100)
    const percentage = Math.max(-100, Math.min(100, (diffDays / maxDays) * 100));
    setDragX(percentage);
  }, [temporalCoordinate]);

  const handleDragStart = () => {
    setIsScrubbing(true);
  };

  const handleDrag = (event, info) => {
    if (!sliderRef.current) return;
    
    const sliderWidth = sliderRef.current.offsetWidth / 2; // half width
    const percentage = Math.max(-100, Math.min(100, (info.offset.x / sliderWidth) * 100));
    
    // Map percentage back to date
    const now = new Date();
    const daysOffset = (percentage / 100) * maxDays;
    const newDate = new Date(now.getTime() + (daysOffset * 24 * 60 * 60 * 1000));
    
    setTemporalCoordinate(newDate);
  };

  const handleDragEnd = () => {
    setIsScrubbing(false);
  };

  const modeConfig = {
    RETROSPECTIVE: { color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: <History className="w-4 h-4" />, label: 'Historical Ledger' },
    PRESENT: { color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: <Activity className="w-4 h-4" />, label: 'Real-time Reality' },
    PREDICTIVE: { color: 'text-purple-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: <BrainCircuit className="w-4 h-4" />, label: 'Krisnam Simulation' }
  };

  const activeMode = modeConfig[temporalMode];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center p-6 pb-8 pointer-events-none">
      
      {/* Temporal Status Badge */}
      <motion.div 
        layout
        className={`pointer-events-auto flex items-center gap-3 px-4 py-2 mb-4 text-sm font-medium border rounded-full shadow-lg backdrop-blur-md ${activeMode.color} ${activeMode.bg} ${activeMode.border}`}
      >
        {activeMode.icon}
        {activeMode.label}
        <span className="pl-3 ml-3 text-neutral-300 border-l border-white/10">
          {temporalCoordinate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        {temporalMode !== 'PRESENT' && (
          <button 
            onClick={snapToPresent}
            className="p-1 ml-2 text-white rounded-full hover:bg-white/20 transition-colors"
            title="Snap to Present"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </motion.div>

      {/* Scrubbable Timeline Track */}
      <div 
        ref={sliderRef}
        className="pointer-events-auto relative w-full max-w-4xl h-2 bg-neutral-800/80 backdrop-blur-md rounded-full border border-white/5 flex items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]"
      >
        {/* Past Gradient */}
        <div className="absolute left-0 h-full w-1/2 bg-gradient-to-r from-amber-500/20 to-transparent rounded-l-full" />
        {/* Future Gradient */}
        <div className="absolute right-0 h-full w-1/2 bg-gradient-to-l from-purple-500/20 to-transparent rounded-r-full" />
        
        {/* Center Marker (Now) */}
        <div className="absolute left-1/2 w-0.5 h-4 bg-blue-500/50 -translate-x-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

        {/* The Scrubber Handle */}
        <motion.div
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="absolute left-1/2 w-6 h-6 bg-white rounded-full shadow-xl cursor-grab active:cursor-grabbing border-2 border-neutral-900 z-10 flex items-center justify-center"
          style={{ x: `${dragX}%` }} // Simplified translation for the demo
        >
          <div className="w-2 h-2 rounded-full bg-neutral-900" />
        </motion.div>
      </div>
      
    </div>
  );
};

export default TemporalSlider;
