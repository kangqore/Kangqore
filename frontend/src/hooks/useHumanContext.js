import { useState, useEffect, useRef } from 'react';
import { behaviorEngine } from '../lib/hcip/BehaviorEngine';
import { getSessionUuid, getVisitorUuid } from './useVisitorIdentity';

const BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function useHumanContext() {
  const [hco, setHco] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  
  // Track raw data for Physics logging
  const lastMoveTime = useRef(Date.now());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const idleTimer = useRef(null);

  const fetchHcipState = async () => {
    try {
      const res = await fetch(`${BASE}/api/hcip/recommendations/${getSessionUuid()}?visitorId=${getVisitorUuid()}`);
      const data = await res.json();
      if (data.hco) setHco(data.hco);
      if (data.recommendation) setRecommendation(data.recommendation);
    } catch(e) {}
  };

  // Update intent on path change
  useEffect(() => {
    const updatePathIntent = () => {
      behaviorEngine.logPhysics('PAGE_VIEW', { path: window.location.pathname });
    };
    
    updatePathIntent();
    window.addEventListener('popstate', updatePathIntent);
    
    return () => window.removeEventListener('popstate', updatePathIntent);
  }, [window.location.pathname]);

  // Listen for HCIP flushes
  useEffect(() => {
    window.addEventListener('kq_hcip_flush_complete', fetchHcipState);
    return () => window.removeEventListener('kq_hcip_flush_complete', fetchHcipState);
  }, []);

  // Behavioral Sensors (Feed raw physics to Behavior Engine)
  useEffect(() => {
    const handleCopy = () => {
      behaviorEngine.logPhysics('COPY', { path: window.location.pathname });
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        behaviorEngine.logPhysics('WAKE', { path: window.location.pathname });
      }
    };

    const handleMouseDown = (e) => {
      behaviorEngine.logPhysics('CLICK', { x: e.clientX, y: e.clientY });
    };

    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        behaviorEngine.logPhysics('IDLE', { path: window.location.pathname });
      }, 15000); // 15 seconds of no movement
    };

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastMoveTime.current;
      
      if (dt > 100) { // Throttle
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const dist = Math.hypot(dx, dy);
        
        // Feed high-velocity moves to Behavior Engine
        if (dist / dt > 5) {
          behaviorEngine.logPhysics('SCROLL', { velocity: dist / dt, path: window.location.pathname });
        }
        
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        lastMoveTime.current = now;
      }
      resetIdle();
    };
    
    const handleScroll = () => {
      const depth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      behaviorEngine.logPhysics('SCROLL', { depth, path: window.location.pathname });
      resetIdle();
    };

    // Attach listeners
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    resetIdle();

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // For backward compatibility while refactoring
  return { 
    vibe: hco ? hco.emotion.toLowerCase() : 'neutral', 
    topIntent: hco ? { intent: hco.persona === 'UNKNOWN' ? 'enterpriseBuyer' : hco.persona, score: hco.confidence.overall } : { intent: 'enterpriseBuyer', score: 0 },
    hco,
    recommendation 
  };
}
