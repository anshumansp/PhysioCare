import axiosInstance from './axiosConfig';

const API_PATH = '/appointments';

export interface AppointmentData {
  _id?: string;
  name: string;
  phone: string;
  date: Date;
  timeSlot: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  userId?: string;
  createdAt?: Date;
}

interface AppointmentFormData {
  patientName: string;
  age: number;
  gender: string;
  contactNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  condition: string;
  previousHistory?: string;
}

// Create appointment
export const createAppointment = async (formData: AppointmentFormData): Promise<AppointmentData> => {
  try {
    console.log('=== Appointment Service Debug Info ===');
    console.log('API Endpoint:', `${API_PATH}`);
    console.log('Request Headers:', {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });

    // Log the incoming form data
    console.log('Incoming form data:', formData);

    // Transform data to match backend exactly
    const appointmentData = {
      name: formData.patientName,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.contactNumber,
      date: formData.appointmentDate,
      timeSlot: formData.appointmentTime,
      condition: formData.condition,
      previousHistory: formData.previousHistory || ''
    };

    // Log the transformed data
    console.log('Sending to backend:', appointmentData);

    // Make the request
    const response = await axiosInstance.post(API_PATH, appointmentData);
    console.log('Backend Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    return response.data;
  } catch (error: any) {
    console.error('Appointment creation error:', {
      error: error.message,
      response: error.response?.data
    });
    console.error('=== Appointment Service Error ===');
    console.error('Error making appointment request:', {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      },
      request: {
        method: 'POST',
        url: API_PATH,
        headers: error.config?.headers
      }
    });
    throw error;
  }
};

// Get user's appointments
export const getAppointments = async (): Promise<AppointmentData[]> => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/my-appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get specific appointment
export const getAppointment = async (id: string): Promise<AppointmentData> => {
  try {
    const response = await axiosInstance.get(`${API_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (id: string, appointmentData: Partial<Omit<AppointmentData, '_id' | 'userId' | 'createdAt'>>): Promise<AppointmentData> => {
  try {
    const formattedData = appointmentData.date
      ? { ...appointmentData, date: new Date(appointmentData.date) }
      : appointmentData;
    const response = await axiosInstance.patch(`${API_PATH}/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Cancel appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_PATH}/${id}`);
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error;
  }
};
