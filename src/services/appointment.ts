import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/appointments`;

export interface AppointmentData {
  _id?: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  appointmentDate: Date;
  appointmentTime: string;
  condition: string;
  previousHistory?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Create appointment
export const createAppointment = async (appointmentData: Omit<AppointmentData, '_id'>) => {
  const response = await axios.post(API_URL, appointmentData);
  return response.data;
};

// Get user's appointments
export const getUserAppointments = async () => {
  const response = await axios.get(`${API_URL}/my-appointments`);
  return response.data;
};

// Get specific appointment
export const getAppointment = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update appointment
export const updateAppointment = async (id: string, appointmentData: Partial<AppointmentData>) => {
  const response = await axios.patch(`${API_URL}/${id}`, appointmentData);
  return response.data;
};

// Cancel appointment
export const cancelAppointment = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
