import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Track if device is touch capable
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice.current) {
      setIsHidden(true);
      return;
    }

    // Add class to body to indicate custom cursor is active
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xSetCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
    const ySetCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });
    
    let firstMove = true;

    const onMouseMove = (e) => {
      if (firstMove) {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
        firstMove = false;
      }
      xSetCursor(e.clientX);
      ySetCursor(e.clientY);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });
    const onMouseEnter = () => {
      if (!firstMove) gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    // Event Delegation for hover states
    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractable = target.closest('a, button, input, textarea, select, [role="button"], .interactive');
      if (isInteractable) setIsHovering(true);
    };

    const onMouseOut = (e) => {
      const target = e.target;
      const isInteractable = target.closest('a, button, input, textarea, select, [role="button"], .interactive');
      if (isInteractable) setIsHovering(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  // GSAP animations for state changes
  useEffect(() => {
    if (isTouchDevice.current || !cursorRef.current) return;

    if (isHovering) {
      gsap.to(cursorRef.current, { 
        scale: 1.25, 
        duration: 0.3, 
        ease: 'power2.out',
        boxShadow: '0 15px 35px rgba(37,100,234,0.6)'
      });
      if (textRef.current) textRef.current.innerText = 'CLICK';
    } else {
      gsap.to(cursorRef.current, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.out',
        boxShadow: '0 10px 25px rgba(37,100,234,0.4)'
      });
      if (textRef.current) textRef.current.innerText = 'MOVE';
    }

    if (isClicking) {
      gsap.to(cursorRef.current, { scale: isHovering ? 1.1 : 0.85, duration: 0.1 });
    }

  }, [isHovering, isClicking]);

  if (isHidden) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[99999] bg-gradient-to-br from-cyan-400 to-brand-blue border border-white/30 backdrop-blur-md"
      style={{ 
        width: '32px', 
        height: '32px',
        transform: 'translate(-50%, -50%)', 
        willChange: 'transform' 
      }}
    >
      <div 
        className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-60"
      />
      <span 
        ref={textRef}
        className="text-white text-[7px] font-bold uppercase tracking-[0.1em] z-10 relative -mr-[0.1em]"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        MOVE
      </span>
    </div>
  );
};

export default CustomCursor;
