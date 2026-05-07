import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default animation easings for consistent feel
export const EASINGS = {
  smooth: 'power2.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'back.out(1.7)',
  sharp: 'power4.inOut',
  gentle: 'power1.inOut',
};

// Timing presets
export const TIMINGS = {
  fast: 0.3,
  medium: 0.5,
  slow: 0.8,
  extraSlow: 1.2,
};

// Page transition durations
export const TRANSITION = {
  fadeOut: 0.3,
  fadeIn: 0.4,
  total: 0.7, // fadeOut + fadeIn
};

// Animation defaults
export const DEFAULTS = {
  ease: EASINGS.smooth,
  duration: TIMINGS.medium,
};

// Stagger configurations for card animations
export const STAGGER = {
  cards: {
    amount: 0.1,
    from: 'start',
  },
  list: {
    amount: 0.05,
    from: 'start',
  },
};

// Detect reduced motion preference
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Helper to create safe GSAP context
export const createGSAPContext = () => gsap.context(() => {});

// Common animation presets
export const ANIMATIONS = {
  fadeIn: {
    opacity: 0,
    duration: TIMINGS.medium,
    ease: EASINGS.smooth,
  },
  slideUp: {
    y: 20,
    opacity: 0,
    duration: TIMINGS.medium,
    ease: EASINGS.smooth,
  },
  slideDown: {
    y: -20,
    opacity: 0,
    duration: TIMINGS.medium,
    ease: EASINGS.smooth,
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: TIMINGS.medium,
    ease: EASINGS.bounce,
  },
  notification: {
    y: -100,
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    ease: EASINGS.elastic,
  },
};

export default gsap;
