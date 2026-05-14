import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { usePodcast } from '../context/PodcastContext';

const PodcastMiniPlayer = () => {
  const { 
    isPlayerVisible, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    closePlayer, 
    seek 
  } = usePodcast();

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isPlayerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed z-[90] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-[220px] sm:w-[260px]"
        >
          <div className="rounded-full overflow-hidden bg-[#0b101a]/95 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(34,211,238,0.15)]">
            
            <div className="flex items-center gap-2.5 p-1.5 pr-2.5">
              {/* Left: Thumbnail & Waveform */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-inner">
                <img 
                  src="/images/Ep-01.png" 
                  alt="The eQORE Show" 
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-[1.5px]">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["20%", "80%", "20%"] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="w-[1.5px] bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Middle: Text & Tiny Progress Line */}
              <div className="flex-1 min-w-0 flex flex-col justify-center translate-y-[-1px]">
                <div className="flex items-center gap-1.5 truncate mb-0.5">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-cyan-400 shrink-0">Playing:</span>
                  <span className="text-[10px] font-semibold text-white truncate">The eQORE Show</span>
                </div>
                {/* Micro Progress Bar */}
                <div 
                  className="relative h-[3px] w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleSeek}
                >
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 bg-cyan-400 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div className="absolute top-0 bottom-0 left-0 bg-white/20 w-0 group-hover:w-full transition-all duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-1 shrink-0 pl-1.5">
                <button
                  onClick={togglePlay}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  onClick={closePlayer}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PodcastMiniPlayer;
