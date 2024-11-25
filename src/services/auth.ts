import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

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
  console.log(API_URL)
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    const { token, user } = response.data;
    const userData = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }
  return response.data;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<UserData> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data) {
    const { token, user } = response.data;
    const userData = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
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

// Add axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
