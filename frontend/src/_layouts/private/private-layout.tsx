import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import useAuthUserStore from '@/_stores/auth-user-store';

const PrivateLayout = () => {
  const navigate = useNavigate();

  const { token } = useAuthUserStore();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return <Outlet />;
};

export default PrivateLayout;
