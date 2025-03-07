import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
// import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      console.log("I am trying to register");
      console.log(formData);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      console.log(formData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error during registration');
      }

      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error during Google sign-in');
      }

      localStorage.setItem('token', data.token);
      toast.success('Google sign-in successful!');
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed');
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
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Choose a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Sign Up
            </motion.button>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google sign-in failed')}
              />
            </div>
          </div> */}

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
