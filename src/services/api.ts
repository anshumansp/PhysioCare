import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

// Create axios instance with environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: import.meta.env.VITE_API_TIMEOUT  // Use environment variable for timeout
});

// Types
interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Create a function to get the auth token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('token');
  return token;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
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
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  googleAuth: (token: string) =>
    api.post<AuthResponse>('/auth/google', { token }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/auth/profile', data)
};

// Chat endpoints
export const chatApi = {
  sendMessage: (message: string) =>
    api.post('/chat', { message }),
  
  getChatHistory: () =>
    api.get('/chat/history')
};

// Appointment endpoints
export const appointmentApi = {
  create: (data: AppointmentData) =>
    api.post('/appointments', data),
  
  getMyAppointments: () =>
    api.get('/appointments/me'),
  
  getAvailableSlots: (date: string) =>
    api.get(`/appointments/slots?date=${date}`),
  
  update: (id: string, data: Partial<AppointmentData>) =>
    api.put(`/appointments/${id}`, data),
  
  cancel: (id: string) =>
    api.delete(`/appointments/${id}`)
};

export default api;
