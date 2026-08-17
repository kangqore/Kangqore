import React, { createContext, useContext, useState, useEffect } from 'react';

const TemporalContext = createContext();

export const useTemporalContext = () => useContext(TemporalContext);

export const TemporalProvider = ({ children }) => {
  const [temporalCoordinate, setTemporalCoordinate] = useState(new Date());
  const [temporalMode, setTemporalMode] = useState('PRESENT'); // 'RETROSPECTIVE' | 'PRESENT' | 'PREDICTIVE'
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Derive mode dynamically based on the coordinate vs now
  useEffect(() => {
    if (isScrubbing) return; // Don't snap mode while actively dragging

    const now = new Date();
    const diffHours = (temporalCoordinate - now) / (1000 * 60 * 60);

    if (Math.abs(diffHours) < 1) {
      setTemporalMode('PRESENT');
    } else if (diffHours < 0) {
      setTemporalMode('RETROSPECTIVE');
    } else {
      setTemporalMode('PREDICTIVE');
    }
  }, [temporalCoordinate, isScrubbing]);

  const snapToPresent = () => {
    setTemporalCoordinate(new Date());
    setTemporalMode('PRESENT');
  };

  return (
    <TemporalContext.Provider value={{ 
      temporalCoordinate, 
      setTemporalCoordinate,
      temporalMode,
      isScrubbing,
      setIsScrubbing,
      snapToPresent
    }}>
      {children}
    </TemporalContext.Provider>
  );
};
