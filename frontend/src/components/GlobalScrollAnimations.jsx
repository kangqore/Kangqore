import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GlobalScrollAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    // Use a small timeout to wait for React to finish painting the DOM
    // and for specific custom animations to mount
    const timeout = setTimeout(() => {
      // Refresh ScrollTrigger to clear layout shifts
      ScrollTrigger.refresh();

      // Select generic elements that need a "cheese-smooth" reveal.
      // We explicitly ignore elements that declare they shouldn't be revealed
      // or already have a data-gsap marker.
      const revealElements = document.querySelectorAll(`
        h1:not([data-gsap], .no-reveal),
        h2:not([data-gsap], .no-reveal),
        h3:not([data-gsap], .no-reveal),
        h4:not([data-gsap], .no-reveal),
        p:not([data-gsap], .no-reveal),
        li:not([data-gsap], .no-reveal, nav li),
        .card:not([data-gsap], .no-reveal),
        .reveal-on-scroll:not([data-gsap], .no-reveal)
      `);

      let indexOffset = 0;

      revealElements.forEach((el) => {
        // Exclude elements inside highly customized GSAP sections to avoid double-animating
        if (
          el.closest('.custom-gsap-section') || 
          el.closest('.salesforce-page-override') || 
          el.closest('.api-microservices-page-override') || 
          el.closest('.pimcore-page-override') ||
          el.closest('.no-global-gsap') ||
          el.closest('header') || 
          el.closest('footer') ||
          el.closest('.group\\/carousel') // Ignore items inside horizontal GSAP/native carousels
        ) {
           return;
        }

        // Apply GSAP marker to prevent double-binding
        el.setAttribute('data-gsap', 'true');

        // Initial state for the cheese-smooth glide
        gsap.set(el, { opacity: 0, y: 30 });

        // Create the scroll trigger
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%', // Trigger when the top of the element hits 85% down the viewport
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              // Use a tiny dynamic stagger based on position but kept very small for "organic" feel
              delay: 0.02 * (indexOffset % 5)
            });
            indexOffset++;
          }
        });
      });
      
      // Secondary pass for high-fidelity images if any
      const images = document.querySelectorAll('img:not([data-gsap], .no-reveal, .hero-bg, .logo)');
      images.forEach((img) => {
        if (img.closest('header') || img.closest('footer') || img.closest('.custom-gsap-section') || img.closest('.salesforce-page-override') || img.closest('.api-microservices-page-override') || img.closest('.pimcore-page-override')) return;
        
        img.setAttribute('data-gsap', 'true');
        gsap.set(img, { opacity: 0, y: 40, scale: 0.98 });
        
        ScrollTrigger.create({
          trigger: img,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(img, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' });
          }
        });
      });

      ScrollTrigger.refresh();

    }, 400); // 400ms delay to ensure heavy components have mounted

    return () => {
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  // This is a headless component, it merely orchestrates DOM mutations
  return null;
};

export default GlobalScrollAnimations;
