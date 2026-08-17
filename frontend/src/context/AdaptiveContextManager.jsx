import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AdaptiveContext = createContext();

export const useAdaptiveContext = () => useContext(AdaptiveContext);

export const AdaptiveProvider = ({ children }) => {
  const [layoutState, setLayoutState] = useState('STANDARD'); // 'STANDARD' | 'WAR_ROOM'
  const [warRoomContext, setWarRoomContext] = useState(null);

  useEffect(() => {
    // Connect to the backend socket
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('[AdaptiveContext] Connected to Synapse Mesh');
    });

    // Listen for Visual Intelligence (VIS) shifts
    socket.on('vis:layout_shift', (data) => {
      console.log('[AdaptiveContext] Received VIS Layout Shift:', data);
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
