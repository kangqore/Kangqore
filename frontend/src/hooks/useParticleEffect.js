import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Hook for triggering particle explosion effects
 * Used for milestone completions and success celebrations
 * 
 * @returns {Object} - containerRef and trigger function
 */
export const useParticleEffect = () => {
  const containerRef = useRef(null);

  const triggerParticles = useCallback((options = {}) => {
    const {
      count = 50,
      colors = ['#0D8ABC', '#10B981', '#F59E0B', '#EF4444'],
      duration = 2,
      spread = 100,
    } = options;

    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Create particles
    const particles = [];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      container.appendChild(particle);
      particles.push(particle);

      // Random angle and velocity
      const angle = (Math.PI * 2 * i) / count;
      const velocity = spread * (0.5 + Math.random() * 0.5);
      const targetX = centerX + Math.cos(angle) * velocity;
      const targetY = centerY + Math.sin(angle) * velocity;

      // Animate particle
      gsap.to(particle, {
        x: targetX - centerX,
        y: targetY - centerY,
        opacity: 0,
        scale: 0,
        duration: duration,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        },
      });
    }

    // Cleanup after animation
    setTimeout(() => {
      particles.forEach((p) => p.remove());
    }, duration * 1000 + 100);
  }, []);

  return {
    containerRef,
    triggerParticles,
  };
};

export default useParticleEffect;
