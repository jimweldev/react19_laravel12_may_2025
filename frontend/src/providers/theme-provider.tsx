import { useEffect } from 'react';
import useThemeStore from '@/_stores/theme-store';

const ThemeProvider = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      setTheme(systemTheme);
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, setTheme]);

  return null;
};

export default ThemeProvider;
