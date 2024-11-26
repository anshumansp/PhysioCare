import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserSettings, getSettings, updateSettings, resetSettings } from '../services/settings';
import { FiBell, FiLock, FiEye, FiMonitor, FiGlobe, FiHelpCircle, FiRefreshCw } from 'react-icons/fi';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

const defaultSettings: UserSettings = {
  notifications: {
    email: {
      appointments: false,
      reminders: false,
      marketing: false
    },
    push: {
      appointments: false,
      reminders: false,
      marketing: false
    }
  },
  privacy: {
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'blue'
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    screenReader: false
  },
  language: {
    preferred: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  },
  security: {
    twoFactorEnabled: false,
    loginNotifications: false,
    sessionTimeout: 30
  }
};

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings({ ...defaultSettings, ...data });
    } catch (error) {
      toast.error('Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (section: keyof UserSettings, value: any) => {
    try {
      const updatedSettings = await updateSettings({
        [section]: { ...settings[section], ...value }
      });
      setSettings({ ...settings, ...updatedSettings });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleResetSettings = async () => {
    try {
      const defaultSettingsFromServer = await resetSettings();
      setSettings({ ...defaultSettings, ...defaultSettingsFromServer });
      toast.success('Settings reset to default');
    } catch (error) {
      toast.error('Failed to reset settings');
      setSettings(defaultSettings);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-card shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
                Settings
              </h2>
              <button
                onClick={handleResetSettings}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300"
              >
                <FiRefreshCw className="mr-2" />
                Reset to Default
              </button>
            </div>

            <div className="space-y-8">
              {/* Notifications Section */}
              <section>
                <h3 className="flex items-center text-xl font-semibold mb-4">
                  <FiBell className="mr-2" /> Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                    <Switch
                      checked={settings.notifications.email.appointments}
                      onChange={(checked) => handleUpdateSettings('notifications', { email: { ...settings.notifications.email, appointments: checked } })}
                      className={`${
                        settings.notifications.email.appointments 
                          ? 'bg-primary dark:bg-primary-dark' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    >
                      <span className="sr-only">Enable email notifications</span>
                      <span
                        className={`${
                          settings.notifications.email.appointments ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  {/* Add more notification settings */}
                </div>
              </section>

              {/* Privacy Section */}
              <section>
                <h3 className="flex items-center text-xl font-semibold mb-4">
                  <FiEye className="mr-2" /> Privacy
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Profile Visibility</span>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleUpdateSettings('privacy', { profileVisibility: e.target.value })}
                      className="form-select rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary-dark dark:focus:ring-primary-dark text-sm transition-colors duration-200"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  {/* Add more privacy settings */}
                </div>
              </section>

              {/* Appearance Section */}
              <section>
                <h3 className="flex items-center text-xl font-semibold mb-4">
                  <FiMonitor className="mr-2" /> Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Theme</span>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => handleUpdateSettings('appearance', { theme: e.target.value })}
                      className="form-select rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary-dark dark:focus:ring-primary-dark text-sm transition-colors duration-200"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  {/* Add more appearance settings */}
                </div>
              </section>

              {/* Language Section */}
              <section>
                <h3 className="flex items-center text-xl font-semibold mb-4">
                  <FiGlobe className="mr-2" /> Language & Region
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Language</span>
                    <select
                      value={settings.language.preferred}
                      onChange={(e) => handleUpdateSettings('language', { preferred: e.target.value })}
                      className="form-select rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:border-primary-dark dark:focus:ring-primary-dark text-sm transition-colors duration-200"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  {/* Add more language settings */}
                </div>
              </section>

              {/* Security Section */}
              <section>
                <h3 className="flex items-center text-xl font-semibold mb-4">
                  <FiLock className="mr-2" /> Security
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onChange={(checked) => handleUpdateSettings('security', { twoFactorEnabled: checked })}
                      className={`${
                        settings.security.twoFactorEnabled 
                          ? 'bg-primary dark:bg-primary-dark' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    >
                      <span className="sr-only">Enable two-factor authentication</span>
                      <span
                        className={`${
                          settings.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  {/* Add more security settings */}
                </div>
              </section>

              {/* Accessibility Section */}
              <section className="dark:text-gray-300">
                <h3 className="flex items-center text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  <FiHelpCircle className="mr-2" /> Accessibility
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Reduce Motion</span>
                    <Switch
                      checked={settings.accessibility.reduceMotion}
                      onChange={(checked) => handleUpdateSettings('accessibility', { reduceMotion: checked })}
                      className={`${
                        settings.accessibility.reduceMotion 
                          ? 'bg-primary dark:bg-primary-dark' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    >
                      <span className="sr-only">Enable reduce motion</span>
                      <span
                        className={`${
                          settings.accessibility.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  {/* Add more accessibility settings */}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
