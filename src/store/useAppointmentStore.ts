import { create } from 'zustand';
import { appointmentApi } from '../services/api';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentState {
  appointments: Appointment[];
  availableSlots: string[];
  isLoading: boolean;
  error: string | null;
  createAppointment: (data: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  fetchMyAppointments: () => Promise<void>;
  fetchAvailableSlots: (date: string) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
}

const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  availableSlots: [],
  isLoading: false,
  error: null,

  createAppointment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentApi.create(data);
      await get().fetchMyAppointments();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create appointment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentApi.getMyAppointments();
      set({ appointments: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch appointments' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAvailableSlots: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentApi.getAvailableSlots(date);
      set({ availableSlots: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch available slots' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointment: async (id: string, data: Partial<Appointment>) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentApi.update(id, data);
      await get().fetchMyAppointments();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update appointment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentApi.cancel(id);
      await get().fetchMyAppointments();
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to cancel appointment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAppointmentStore;
