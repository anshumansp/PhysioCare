import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const navigate = useNavigate();
  const { setShowChat } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen dark:bg-dark-bg">
      {/* Hero Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-dark-text mb-6">
            Your Path to Recovery
            <span className="text-primary-600"> Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience personalized physiotherapy care with our expert team. 
            We're dedicated to helping you achieve optimal physical health and wellness.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-8"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Schedule Your Visit
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Book an appointment with our experienced physiotherapists and start your journey to recovery.
            </p>
            <motion.button
              onClick={() => navigate('/contact')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Appointment
            </motion.button>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-8"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
              AI Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Have questions? Our AI assistant is here to help you 24/7 with instant responses.
            </p>
            <motion.button
              onClick={() => setShowChat(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Talk to Assistant
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
            <p className="text-gray-600 dark:text-gray-400">Experienced physiotherapists dedicated to your recovery</p>
          </motion.div>

          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-gray-600 dark:text-gray-400">Convenient appointment times that work for you</p>
          </motion.div>

          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Recovery</h3>
            <p className="text-gray-600 dark:text-gray-400">Proven techniques for optimal rehabilitation</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Team Section */}
      <Team />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;