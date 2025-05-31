import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import useAuthUserStore from '@/_stores/auth-user-store';
import useFontSizeStore from '@/_stores/font-size-store';
import useThemeStore from '@/_stores/theme-store';
import useTimezoneStore from '@/_stores/timezone-store';

const PrivateLayout = () => {
  const navigate = useNavigate();

  const { setTheme } = useThemeStore();
  const { setFontSize } = useFontSizeStore();
  const { setTimezone, setDateFormat, setTimeFormat } = useTimezoneStore();

  const { user, token } = useAuthUserStore();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }

    if (token) {
      setTheme(user?.user_setting?.theme || 'light');
      setFontSize(user?.user_setting?.font_size || '1rem');
      setTimezone(user?.user_setting?.timezone || null);
      setDateFormat(user?.user_setting?.date_format || 'YYYY-MM-DD');
      setTimeFormat(user?.user_setting?.time_format || 'HH:mm:ss');
    }
  }, [
    user,
    token,
    navigate,
    setTheme,
    setFontSize,
    setTimezone,
    setDateFormat,
    setTimeFormat,
  ]);

  return <Outlet />;
};

export default PrivateLayout;
