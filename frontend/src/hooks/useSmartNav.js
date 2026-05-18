import { useState, useEffect, useRef } from 'react';

export const useSmartNav = (options = {}) => {
  const { 
    timeout = 2500, 
    disabled = false 
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    let activityTimer;

    const resetTimer = () => {
      setIsVisible(true);
      clearTimeout(activityTimer);
      
      if (!isHovering) {
        activityTimer = setTimeout(() => {
          setIsVisible(false);
        }, timeout);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down significantly, hide immediately (unless hovering)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        if (!isHovering) {
          setIsVisible(false);
          clearTimeout(activityTimer);
        }
      } else if (currentScrollY < lastScrollY.current) {
        // If scrolling up, show and reset timer
        resetTimer();
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Initial trigger
    resetTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    return () => {
      clearTimeout(activityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [timeout, isHovering, disabled]);

  return {
    isSmartNavVisible: isVisible,
    setNavHovered: setIsHovering
  };
};
