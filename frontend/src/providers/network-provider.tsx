import { useEffect, useRef, useState } from 'react';
import { useNetwork } from '@mantine/hooks';

type NetworkProviderProps = {
  children: React.ReactNode;
};

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const networkStatus = useNetwork();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!networkStatus.online) {
      wasOffline.current = true;
    }

    if (networkStatus.online && wasOffline.current) {
      setShowBackOnline(true);
      wasOffline.current = false;

      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 5000); // Show for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [networkStatus.online]);

  return (
    <>
      {children}

      {/* Offline Banner */}
      <div
        className={`fixed bottom-0 left-0 z-50 w-full transform bg-black py-1 text-center text-xs text-white shadow-md transition-all duration-500 ${
          !networkStatus.online
            ? 'translate-y-0 opacity-70'
            : 'translate-y-full opacity-0'
        }`}
      >
        You are currently offline
      </div>

      {/* Back Online Banner */}
      <div
        className={`fixed bottom-0 left-0 z-50 w-full transform bg-green-600 py-1 text-center text-xs text-white shadow-md transition-all duration-500 ${
          showBackOnline
            ? 'translate-y-0 opacity-90'
            : 'translate-y-full opacity-0'
        }`}
      >
        Your internet connection was restored
      </div>
    </>
  );
};

export default NetworkProvider;
