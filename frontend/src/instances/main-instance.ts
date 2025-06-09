import axios from 'axios';
import { toast } from 'sonner';
import useAuthUserStore from '@/_stores/auth-user-store';

const mainInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

mainInstance.interceptors.request.use(
  config => {
    const { token } = useAuthUserStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

mainInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const { access_token } = refreshResponse.data;

        useAuthUserStore.getState().setToken(access_token);

        error.config.headers.Authorization = `Bearer ${access_token}`;
        return axios(error.config);
      } catch (refreshError) {
        const { token } = useAuthUserStore.getState();

        if (token) {
          useAuthUserStore.getState().clearAuthUser();
          toast.error('Session expired. Login again to continue.');
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      toast.error('You do not have permission to access this resource.');
    }

    return Promise.reject(error);
  },
);

export { mainInstance };
