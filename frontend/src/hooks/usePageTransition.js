import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { TRANSITION, EASINGS, prefersReducedMotion } from '../utils/animations/gsapConfig';

/**
 * Hook for smooth page transitions on route changes
 * Animates page exit and entry with configurable transitions
 * 
 * @param {Object} options - Transition configuration
 * @returns {Object} - Ref for page container and transition state
 */
export const usePageTransition = (options = {}) => {
  const pageRef = useRef(null);
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevLocationRef = useRef(location);

  const {
    exitDuration = TRANSITION.fadeOut,
    enterDuration = TRANSITION.fadeIn,
    exitEase = EASINGS.smooth,
    enterEase = EASINGS.smooth,
  } = options;

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    // Only animate if location actually changed
    if (prevLocationRef.current.pathname === location.pathname) {
      return;
    }

    const animatePageTransition = async () => {
      setIsTransitioning(true);
      const element = pageRef.current;

      if (!element) {
        setIsTransitioning(false);
        return;
      }

      // Exit animation
      await gsap.to(element, {
        opacity: 0,
        y: -10,
        duration: exitDuration,
        ease: exitEase,
      });

      // Small delay for route to fully update
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Entry animation
      gsap.fromTo(
        element,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: enterDuration,
          ease: enterEase,
          onComplete: () => {
            setIsTransitioning(false);
          },
        }
      );
    };

    animatePageTransition();
    prevLocationRef.current = location;
  }, [location, exitDuration, enterDuration, exitEase, enterEase]);

  return {
    pageRef,
    isTransitioning,
  };
};

export default usePageTransition;
