import { useState, useEffect, useCallback } from 'react';

/**
 * usePsychologicalProgress - A hook to manage perceived progress.
 * 
 * Humans tolerate waiting better when:
 * 1. Progress starts fast (0-40% instantly)
 * 2. Progress is non-linear
 * 3. Progress accelerates at the end
 */
export const usePsychologicalProgress = (isProcessing) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isProcessing) {
      // 1. Initial burst: 0 to 40% in 300ms
      setProgress(40);

      // 2. Slow middle: Incremental crawl from 40% to 90%
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          // The closer we get to 90, the slower it gets
          const remaining = 90 - prev;
          const jump = Math.max(0.1, remaining * 0.05); 
          return prev + jump;
        });
      }, 500);
    } else {
      // 3. Fast finish: If processing is done, snap to 100%
      if (progress > 0) {
        setProgress(100);
        // Reset after a short delay for next time
        const timeout = setTimeout(() => setProgress(0), 1000);
        return () => clearTimeout(timeout);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  return progress;
};
