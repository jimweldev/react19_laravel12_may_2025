import { useEffect, useState } from 'react';

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Define the missing BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPWAButton() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Type assertion to BeforeInstallPromptEvent
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      deferredPrompt = promptEvent;
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    deferredPrompt = null;
    setIsInstallable(false);
  };

  return isInstallable ? (
    <button
      onClick={handleInstallClick}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Install App
    </button>
  ) : (
    <div>not installable</div>
  );
}
