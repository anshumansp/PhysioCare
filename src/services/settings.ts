import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/settings`;

export interface NotificationSettings {
  email: {
    appointments: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  push: {
    appointments: boolean;
    reminders: boolean;
    marketing: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showPhone: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'blue' | 'green' | 'purple';
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
}

export interface LanguageSettings {
  preferred: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

export interface UserSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  accessibility: AccessibilitySettings;
  language: LanguageSettings;
  security: SecuritySettings;
}

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    const response = await axios.put(API_URL, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const resetSettings = async (): Promise<UserSettings> => {
  try {
    const response = await axios.post(`${API_URL}/reset`);
    return response.data;
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
};
