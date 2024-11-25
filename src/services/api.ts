import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000  // 60 seconds
});

// Create a function to get the auth token
const getAuthToken = async () => {
  const clerk = useClerk();
  const session = await clerk.session;
  return session?.getToken();
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getCurrentUser = () =>
  api.get('/auth/me');

// Chat endpoints
export const sendMessage = (message: string) =>
  api.post('/chat', { message });

export const getChatHistory = () =>
  api.get('/chat/history');

// Appointment endpoints
export const createAppointment = (data: {
  name: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}) => api.post('/appointments', data);

export const getMyAppointments = () =>
  api.get('/appointments/my-appointments');

export const getAvailableSlots = (date: string) =>
  api.get(`/appointments/available-slots/${date}`);

export const updateAppointment = (id: string, status: string) =>
  api.patch(`/appointments/${id}`, { status });

export const cancelAppointment = (id: string) =>
  api.delete(`/appointments/${id}`);

export default api;
