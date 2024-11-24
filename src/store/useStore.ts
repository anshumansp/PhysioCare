import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  user: any | null
  setUser: (user: any) => void
  showAppointmentModal: boolean
  setShowAppointmentModal: (show: boolean) => void
  showChat: boolean
  setShowChat: (show: boolean) => void
}

const useStore = create<AppState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  user: null,
  setUser: (user) => set({ user }),
  showAppointmentModal: false,
  setShowAppointmentModal: (show) => set({ showAppointmentModal: show }),
  showChat: false,
  setShowChat: (show) => set({ showChat: show })
}))

export default useStore;
