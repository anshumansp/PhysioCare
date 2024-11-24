import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  user: any | null
  setUser: (user: any) => void
}

export const useStore = create<AppState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  user: null,
  setUser: (user) => set({ user }),
}))
