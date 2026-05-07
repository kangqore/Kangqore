import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { TRANSITION, EASINGS, prefersReducedMotion } from '../../utils/animations/gsapConfig';

/**
 * Page Transition Wrapper
 * Automatically animates page transitions on route changes
 * 
 * Usage: Wrap your dashboard routes with this component
 */
const PageTransition = ({ children }) => {
  const pageRef = useRef(null);
  const location = useLocation();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    const element = pageRef.current;
    if (!element || prefersReducedMotion()) return;

    // Only animate if route actually changed
    if (prevLocationRef.current.pathname === location.pathname) {
      return;
    }

    // Page enter animation
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: TRANSITION.fadeIn,
        ease: EASINGS.smooth,
        clearProps: 'all', // Clean up inline styles after animation
      }
    );

    prevLocationRef.current = location;
  }, [location]);

  return (
    <div ref={pageRef} className="page-transition-wrapper">
      {children}
    </div>
  );
};

export default PageTransition;
