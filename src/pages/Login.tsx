import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { login } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = await login(formData);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-card shadow-xl rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-dark-text mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Sign In
            </button>

            <div className="text-sm text-center">
              <Link to="/signup" className="text-primary-500 hover:text-primary-600">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
