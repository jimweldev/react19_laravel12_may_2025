import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '@/_types/user';

interface AuthUserStoreProps {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setAuthUser: (user: User, token: string) => void;
  clearAuthUser: () => void;
}

const useAuthUserStore = create<AuthUserStoreProps>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setAuthUser: (user, token) => set({ user, token }),
      clearAuthUser: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-user',
    },
  ),
);

export default useAuthUserStore;
