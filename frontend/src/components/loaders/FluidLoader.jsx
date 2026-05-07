import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../utils/animations/gsapConfig';

/**
 * Fluid Loading State Component
 * Premium animated loader with morphing blob effect
 * 
 * Usage: Replace standard spinners with this component
 */
const FluidLoader = ({ 
  size = 64, 
  color = '#0D8ABC',
  text,
  className = '' 
}) => {
  const loaderRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    if (!blobRef.current || prefersReducedMotion()) return;

    // Continuous morphing animation
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(blobRef.current, {
      scale: 1.2,
      duration: 0.6,
      ease: 'sine.inOut',
    })
    .to(blobRef.current, {
      scale: 0.8,
      duration: 0.6,
      ease: 'sine.inOut',
    })
    .to(blobRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'sine.inOut',
    });

    // Rotation animation
    gsap.to(loaderRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'linear',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        ref={loaderRef}
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 opacity-20"
          style={{ borderColor: color }}
        />
        
        {/* Morphing blob */}
        <div
          ref={blobRef}
          className="absolute inset-2 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}CC, ${color}66)`,
            filter: 'blur(4px)',
          }}
        />
        
        {/* Inner glow */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}FF, transparent)`,
            opacity: 0.6,
          }}
        />
      </div>
      
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default FluidLoader;
