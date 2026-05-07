import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../utils/animations/gsapConfig';

/**
 * Custom hook for GSAP animations with automatic cleanup
 * Respects user's reduced motion preferences
 * 
 * @param {Function} animationCallback - Function containing GSAP animations
 * @param {Array} dependencies - Dependencies array (like useEffect)
 * @returns {Object} - Ref object for animated element and context
 */
export const useGSAP = (animationCallback, dependencies = []) => {
  const elementRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    // Create GSAP context for proper cleanup
    contextRef.current = gsap.context(() => {
      if (elementRef.current && animationCallback) {
        animationCallback(elementRef.current);
      }
    }, elementRef);

    // Cleanup on unmount
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies);

  return { ref: elementRef, context: contextRef };
};

/**
 * Hook for animating number counters
 * 
 * @param {number} targetValue - Final value to count to
 * @param {number} duration - Animation duration in seconds
 * @param {Function} onUpdate - Callback with current value
 */
export const useCountAnimation = (targetValue, duration = 1.5, onUpdate) => {
  useEffect(() => {
    if (prefersReducedMotion()) {
      onUpdate(targetValue);
      return;
    }

    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (onUpdate) {
          onUpdate(Math.round(counter.value));
        }
      },
    });
  }, [targetValue, duration, onUpdate]);
};

/**
 * Hook for staggered list animations
 * 
 * @param {Array} items - Array of items to animate
 * @param {Object} options - Stagger options
 */
export const useStaggerAnimation = (items, options = {}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) {
      return;
    }

    const children = containerRef.current.children;
    
    gsap.fromTo(
      children,
      { 
        opacity: 0, 
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: options.stagger || 0.1,
        ease: 'power2.out',
        ...options,
      }
    );
  }, [items, options]);

  return containerRef;
};

export default useGSAP;
