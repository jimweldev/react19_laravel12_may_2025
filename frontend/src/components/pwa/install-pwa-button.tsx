import { usePWAInstall } from 'react-use-pwa-install';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const InstallPWAButton = () => {
  const install = usePWAInstall();

  return install ? (
    <Button onClick={install}>Install</Button>
  ) : (
    <Button
      onClick={() => {
        toast.info(`You can install this app from the browser menu: "Add to Home
      Screen"`);
      }}
    >
      Install
    </Button>
  );
};

export default InstallPWAButton;
