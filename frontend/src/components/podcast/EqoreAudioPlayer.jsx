import React from 'react';
import { Play, Pause, Volume2, RotateCcw, RotateCw } from 'lucide-react';
import { usePodcast } from '../../context/PodcastContext';

/**
 * Custom Audio Player for The eQORE Show
 * Features an animated 3D-style waveform with central controls.
 */
const EqoreAudioPlayer = () => {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    skip, 
    seek 
  } = usePodcast();

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const pct = x / bounds.width;
    seek(pct * duration);
  };

  return (
    <div className="w-full py-2">
      <div className="relative flex flex-col items-center">
        {/* Animated 3D Waveform Container */}
        <div className="relative w-full h-32 flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
          <div className="flex items-center gap-1.5" style={{ transform: 'rotateX(35deg)' }}>
            {[...Array(48)].map((_, i) => {
              // Create a wave pattern
              const delay = (i * 0.05).toFixed(2);
              const opacity = 0.2 + (Math.abs(24 - i) / 24) * 0.5;
              
              return (
                <div 
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-500 ${
                    isPlaying ? 'bg-blue-600 animate-waveform-bounce' : 'bg-gray-200 h-2'
                  }`}
                  style={{ 
                    animationDelay: `${delay}s`,
                    height: isPlaying ? '100%' : '8px',
                    opacity: isPlaying ? 1 : opacity
                  }}
                />
              );
            })}
          </div>

          {/* Central Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/10 z-20 group"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <div className="transform group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Progress & Controls — Matching User Screenshot */}
        <div className="w-full mt-6 flex flex-col gap-6">
          <div className="flex items-center gap-4 text-[13px] font-bold text-gray-900 tracking-tight">
            <span className="w-12 text-right">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-1.5 bg-gray-100 relative rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-gray-300 transition-all duration-100 rounded-full"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-black opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            <span className="w-12">{formatTime(duration)}</span>
            <button className="text-gray-900 hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Secondary Controls */}
          <div className="flex items-center justify-center gap-10">
             <button 
              onClick={() => skip(-15)} 
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors group"
             >
               <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
               <span className="text-[9px] font-bold uppercase tracking-widest">15s</span>
             </button>
             
             <div className="text-xs font-black text-gray-900 px-4 py-1.5 bg-gray-50 rounded-lg">1.0x</div>

             <button 
              onClick={() => skip(15)} 
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors group"
             >
               <RotateCw className="w-5 h-5 group-hover:rotate-45 transition-transform" />
               <span className="text-[9px] font-bold uppercase tracking-widest">15s</span>
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes waveform-bounce {
          0%, 100% { height: 12px; }
          50% { height: 70px; }
        }
        .animate-waveform-bounce {
          animation: waveform-bounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EqoreAudioPlayer;
