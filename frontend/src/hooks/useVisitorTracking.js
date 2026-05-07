import { useEffect } from 'react';
import axios from 'axios';

const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      // Check if already tracked in this session
      if (sessionStorage.getItem('visitTracked')) return;

      try {
        const referrer = document.referrer;
        
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analytics/track`, {
          referrer
        });

        // Mark as tracked for this session (browser tab)
        sessionStorage.setItem('visitTracked', 'true');
      } catch (error) {
        console.error('Visitor tracking failed', error);
        // Do nothing, silent failure is preferred for analytics
      }
    };

    trackVisit();
  }, []);
};

export default useVisitorTracking;
