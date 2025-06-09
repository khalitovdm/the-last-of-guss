import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
  role: 'SURVIVOR' | 'NIKITA' | 'ADMIN';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: () => boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => !!get().token,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          delete persistedState.isAuthenticated;
        }
        return persistedState;
      },
    }
  )
); 