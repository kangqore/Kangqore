import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AdaptiveContext = createContext();

export const useAdaptiveContext = () => useContext(AdaptiveContext);

export const AdaptiveProvider = ({ children }) => {
  const [layoutState, setLayoutState] = useState('STANDARD'); // 'STANDARD' | 'WAR_ROOM'
  const [warRoomContext, setWarRoomContext] = useState(null);

  useEffect(() => {
    // War Room is a dashboard feature, but this provider wraps the whole app,
    // so every public marketing page was opening a socket it can never use.
    // Only signed-in users need it.
    const token = localStorage.getItem('token');
    if (!token) return undefined;

    // `VITE_API_URL` is defined nowhere, so this fell back to :5001 — a port
    // with no server — and retried forever on every page load. Same-origin,
    // matching lib/socket.js, is the resolution that actually works.
    const socket = io(import.meta.env.VITE_BACKEND_URL || '', {
      withCredentials: true,
      auth: { token },
      // Bounded: a dead endpoint should give up, not fill the console.
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Listen for Visual Intelligence (VIS) shifts
    socket.on('vis:layout_shift', (data) => {
      if (data.layoutState === 'WAR_ROOM') {
        setWarRoomContext(data);
        setLayoutState('WAR_ROOM');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const resetToStandard = () => {
    setLayoutState('STANDARD');
    setWarRoomContext(null);
  };

  // For Demo/Testing purposes
  const triggerDemoWarRoom = () => {
    setWarRoomContext({
      origin: 'KIMMP',
      timestamp: new Date().toISOString(),
      context: {
        anomalyType: 'SLA_BREACH_CRITICAL',
        client: 'Acme Corp',
        project: 'Q3 Enterprise Migration',
        predictiveImpact: '94% probability of churn if not resolved in 4 hours.',
        recommendedAction: 'Reallocate 3 Senior Engineers from Delta project immediately.'
      }
    });
    setLayoutState('WAR_ROOM');
  };

  return (
    <AdaptiveContext.Provider value={{ 
      layoutState, 
      warRoomContext, 
      resetToStandard,
      triggerDemoWarRoom 
    }}>
      {children}
    </AdaptiveContext.Provider>
  );
};
