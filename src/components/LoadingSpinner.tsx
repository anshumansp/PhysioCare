import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm">
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        role="status"
        aria-label="Loading"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
