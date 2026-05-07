import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ANIMATIONS, STAGGER, prefersReducedMotion } from '../../utils/animations/gsapConfig';

/**
 * Animated Stat/KPI Card Component
 * Features:
 * - Entrance animation with stagger
 * - Number counter animation
 * - Hover interactions
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {number} props.value - Numeric value to display
 * @param {string} props.suffix - Optional suffix (%, $, etc.)
 * @param {string} props.icon - Icon component
 * @param {string} props.trend - "up" | "down" | "neutral"
 * @param {number} props.delay - Stagger delay multiplier
 * @param {ReactNode} props.children - Optional child content
 */
const AnimatedStatCard = ({
  title,
  value,
  suffix = '',
  prefix = '',
  icon: Icon,
  trend,
  delay = 0,
  className = '',
  children,
}) => {
  const cardRef = useRef(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Card entrance animation
  useEffect(() => {
    if (!cardRef.current || hasAnimated || prefersReducedMotion()) {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    // Entrance animation
    gsap.fromTo(
      cardRef.current,
      {
        ...ANIMATIONS.scaleIn,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: delay * STAGGER.cards.amount,
        ease: 'back.out(1.7)',
        onComplete: () => setHasAnimated(true),
      }
    );
  }, [delay, hasAnimated]);

  // Number counter animation
  useEffect(() => {
    if (prefersReducedMotion() || !hasAnimated) {
      setCount(value);
      return;
    }

    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: value,
      duration: 1.5,
      delay: delay * STAGGER.cards.amount + 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.round(counter.value));
      },
    });
  }, [value, delay, hasAnimated]);

  // Hover animation
  const handleMouseEnter = () => {
    if (prefersReducedMotion()) return;
    
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return;
    
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 transition-all ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <div className="flex items-baseline">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {prefix}{count.toLocaleString()}{suffix}
            </h3>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trendColors[trend]}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-brand-blue" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default AnimatedStatCard;
