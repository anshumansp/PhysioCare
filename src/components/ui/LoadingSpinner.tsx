import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full border-t-primary-600"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
