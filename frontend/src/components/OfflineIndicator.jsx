import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Show briefly that we're back online
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show banner on initial load if offline
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        showBanner ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div 
        className={`py-2 px-4 text-center text-sm font-medium ${
          isOffline 
            ? 'bg-amber-500 text-white' 
            : 'bg-green-500 text-white'
        }`}
      >
        {isOffline ? (
          <span className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            You're offline - viewing cached content
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Back online!
          </span>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
