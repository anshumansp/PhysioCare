import React from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-card shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">
              Settings
            </h2>
            <div className="space-y-6">
              {/* Settings content will go here */}
              <p className="text-gray-600 dark:text-gray-300">
                Settings page is under construction.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
