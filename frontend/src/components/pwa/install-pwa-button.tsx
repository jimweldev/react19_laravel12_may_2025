import { FaDownload } from 'react-icons/fa';
import { usePWAInstall } from 'react-use-pwa-install';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const InstallPWAButton = () => {
  const installPWA = usePWAInstall();

  const showInstallInfo = () => {
    toast.info(
      'You can install this app from the browser menu: "Add to Home Screen"',
    );
  };

  const onInstall = () => {
    if (installPWA) {
      installPWA();
    } else {
      showInstallInfo();
    }
  };

  return (
    <Button variant="secondary" size="lg" onClick={onInstall}>
      <FaDownload />
      Install App
    </Button>
  );
};

export default InstallPWAButton;
