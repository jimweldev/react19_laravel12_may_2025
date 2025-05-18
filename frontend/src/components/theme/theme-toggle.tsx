import useThemeStore from '@/_stores/theme-store';
import { Button } from '../ui/button';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      size="icon"
    >
      x
    </Button>
  );
};

export default ThemeToggle;
