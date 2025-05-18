import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa6';
import { toast } from 'sonner';
import useAuthUserStore from '@/_stores/auth-user-store';
import { Button } from '@/components/ui/button';
import { mainInstance } from '@/instances/main-instance';

const GoogleLogin = () => {
  // STORES
  // store - auth user
  const { setAuthUser } = useAuthUserStore();

  // FORM
  // form - state
  const [isLoading, setIsLoading] = useState(false);

  // form - submit
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      setIsLoading(true);

      toast.promise(
        mainInstance.post('/api/auth/google-login', tokenResponse),
        {
          loading: 'Loading...',
          success: response => {
            setAuthUser(response.data.user, response.data.access_token);
            return `Logged in successfully!`;
          },
          error: error => {
            return (
              error.response?.data?.message ||
              error.message ||
              'An error occurred'
            );
          },
          finally: () => {
            setIsLoading(false);
          },
        },
      );
    },
  });

  return (
    <>
      {/* google login button */}
      <Button
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={() => login()}
      >
        <FaGoogle />
        Continue with Google
      </Button>
    </>
  );
};

export default GoogleLogin;
