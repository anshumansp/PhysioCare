import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export interface UserData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Register user
export const register = async (userData: RegisterCredentials): Promise<UserData> => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<UserData> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): UserData | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get user profile
export const getProfile = async (): Promise<UserData> => {
  const user = getCurrentUser();
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
  return response.data;
};

// Axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
