import React from 'react';

export const BackgroundNoiseGrid = ({
  className = "",
  columnWidth = "120px",
  noiseOpacity = 0.18,
  baseFrequency = "0.7",
  speed = "8s"
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full bg-[#050505] overflow-hidden ${className}`}>
      <style>
        {`
          @keyframes grid-drift {
            from { background-position: 0 0; }
            to { background-position: ${columnWidth} 0; }
          }
        `}
      </style>
      
      {/* The grid pattern (3D columns) */}
      <div 
        className="absolute inset-0 w-[200%] h-full"
        style={{
          backgroundImage: `linear-gradient(to right, #050505 0%, #151515 50%, #050505 100%)`,
          backgroundSize: `${columnWidth} 100%`,
          animation: `grid-drift ${speed} linear infinite`
        }}
      />
      
      {/* The noise overlay */}
      <svg 
        className="pointer-events-none absolute inset-0 w-full h-full mix-blend-overlay" 
        style={{ opacity: noiseOpacity }}
      >
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency={baseFrequency} 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
