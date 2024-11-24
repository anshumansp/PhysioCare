import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Service {
  title: string;
  description: string;
  icon: string;
}

const services: Service[] = [
  {
    title: 'Physical Therapy',
    description: 'Personalized treatment plans to help restore movement and reduce pain through therapeutic exercises and manual therapy.',
    icon: '🏃‍♂️'
  },
  {
    title: 'Sports Rehabilitation',
    description: 'Specialized programs for athletes to recover from injuries and improve performance.',
    icon: '⚽'
  },
  {
    title: 'Manual Therapy',
    description: 'Hands-on techniques to reduce pain, decrease muscle tension, and improve mobility.',
    icon: '👐'
  },
  {
    title: 'Chronic Pain Management',
    description: 'Comprehensive approach to managing and reducing chronic pain through various therapeutic techniques.',
    icon: '🎯'
  },
  {
    title: 'Post-Surgery Rehabilitation',
    description: 'Guided recovery programs to help patients regain strength and mobility after surgery.',
    icon: '🏥'
  },
  {
    title: 'Ergonomic Assessment',
    description: 'Workplace evaluations and recommendations to prevent injuries and improve posture.',
    icon: '💺'
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Comprehensive physiotherapy solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-4">
            Ready to Start Your Recovery Journey?
          </h2>
          <motion.button 
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300"
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book an Appointment
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
