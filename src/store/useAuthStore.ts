import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleAuth: (token: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const { token, user } = response.data;
          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register({ name, email, password });
          const { token, user } = response.data;
          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      googleAuth: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.googleAuth(token);
          const { token: authToken, user } = response.data;
          set({ user, token: authToken, isAuthenticated: true });
          localStorage.setItem('token', authToken);
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Google authentication failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.updateProfile(data);
          set({ user: response.data });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Profile update failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
