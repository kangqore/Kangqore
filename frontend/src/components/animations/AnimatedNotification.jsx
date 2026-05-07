import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EASINGS, prefersReducedMotion } from '../../utils/animations/gsapConfig';

/**
 * Animated Notification Toast
 * Premium notification with elastic entrance and smooth exit
 * 
 * Usage: Wrap toast notifications with this component
 */
const AnimatedNotification = ({ 
  children, 
  onClose,
  duration = 5000,
  className = '' 
}) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    const element = notificationRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      // Simple fade for reduced motion
      gsap.fromTo(element,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
    } else {
      // Elastic entrance animation
      gsap.fromTo(
        element,
        {
          y: -100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: EASINGS.elastic,
        }
      );
    }

    // Auto-dismiss
    if (duration && onClose) {
      const timer = setTimeout(() => {
        // Exit animation
        gsap.to(element, {
          x: 400,
          opacity: 0,
          duration: 0.4,
          ease: EASINGS.sharp,
          onComplete: onClose,
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleDismiss = () => {
    if (!onClose) return;

    gsap.to(notificationRef.current, {
      x: 400,
      opacity: 0,
      duration: 0.4,
      ease: EASINGS.sharp,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={notificationRef}
      className={`notification-wrapper ${className}`}
      style={{ opacity: 0 }}
    >
      <div className="relative">
        {children}
        {onClose && (
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Close notification"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedNotification;
