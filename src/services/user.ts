import axios from 'axios';
import { getCurrentUser } from './auth';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/users`;

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  picture: string;
  bio?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const response = await axios.put(`${API_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (file: File): Promise<{ picture: string }> => {
  const user = getCurrentUser();
  const formData = new FormData();
  formData.append('picture', file);
  
  const response = await axios.post(`${API_URL}/profile/picture`, formData, {
    headers: { 
      Authorization: `Bearer ${user?.token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
