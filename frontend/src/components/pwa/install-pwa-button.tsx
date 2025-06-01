import { usePWAInstall } from 'react-use-pwa-install';

const InstallPWAButton = () => {
  const install = usePWAInstall();

  return (
    <header>
      <h1>My app</h1>
      {install && <button onClick={install}>Install</button>}
    </header>
  );
};

export default InstallPWAButton;
