import React, { useState, useEffect } from 'react';

const NetworkBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{ background: '#FF9800', color: '#fff', textAlign: 'center', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, zIndex: 9999, position: 'relative' }}>
      You're offline. Some wardrobe features may be unavailable until you're back online.
    </div>
  );
};
export default NetworkBanner;
