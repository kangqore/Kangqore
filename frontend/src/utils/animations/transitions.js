import gsap from 'gsap';
import { TRANSITION, EASINGS } from './gsapConfig';

/**
 * Page transition animations
 * Used for smooth transitions between dashboard views
 */

export const fadeOutPage = (element) => {
  return gsap.to(element, {
    opacity: 0,
    duration: TRANSITION.fadeOut,
    ease: EASINGS.smooth,
  });
};

export const fadeInPage = (element) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: TRANSITION.fadeIn,
      ease: EASINGS.smooth,
    }
  );
};

export const slideOutLeft = (element) => {
  return gsap.to(element, {
    x: -50,
    opacity: 0,
    duration: TRANSITION.fadeOut,
    ease: EASINGS.sharp,
  });
};

export const slideInRight = (element) => {
  return gsap.fromTo(
    element,
    { x: 50, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: TRANSITION.fadeIn,
      ease: EASINGS.smooth,
    }
  );
};

/**
 * Complete page transition sequence
 * @param {HTMLElement} outElement - Element to transition out
 * @param {HTMLElement} inElement - Element to transition in
 * @param {Function} callback - Callback to run between transitions
 */
export const pageTransition = async (outElement, inElement, callback) => {
  const tl = gsap.timeline();
  
  // Fade out current page
  tl.to(outElement, {
    opacity: 0,
    y: -20,
    duration: TRANSITION.fadeOut,
    ease: EASINGS.smooth,
  });

  // Run callback (route change, etc.)
  if (callback) {
    tl.call(callback);
  }

  // Fade in new page
  tl.fromTo(
    inElement,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: TRANSITION.fadeIn,
      ease: EASINGS.smooth,
    }
  );

  return tl;
};

export default {
  fadeOutPage,
  fadeInPage,
  slideOutLeft,
  slideInRight,
  pageTransition,
};
