import { FaMoon, FaSun } from 'react-icons/fa6';
import useThemeStore from '@/_stores/theme.store';
import PageHeader from '@/components/texts/page-header';
import { cn } from '@/lib/utils';

const ThemePage = () => {
  // STORES
  // store - theme
  const { theme, setTheme } = useThemeStore();

  return (
    <>
      {/* header */}
      <div className="mb-3">
        <PageHeader>Theme</PageHeader>
      </div>

      {/* theme toggle */}
      <div
        className={cn(
          'relative flex h-12 w-24 cursor-pointer items-center rounded-full border-2 transition-all',
          theme === 'light'
            ? 'border-yellow-400 bg-yellow-200'
            : 'border-purple-500 bg-purple-900',
        )}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {/* toggle circle */}
        <div
          className={cn(
            'absolute left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all',
            theme === 'dark' ? 'translate-x-12' : '',
          )}
        >
          {/* theme icon */}
          {theme === 'light' ? (
            <FaSun className="text-yellow-500" />
          ) : (
            <FaMoon className="text-purple-500" />
          )}
        </div>
      </div>
    </>
  );
};

export default ThemePage;
