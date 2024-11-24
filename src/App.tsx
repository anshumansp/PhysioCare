import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Toaster } from 'sonner';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Services = React.lazy(() => import('./pages/Services'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <BrowserRouter>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text font-poppins transition-colors duration-200`}>
        <Header />
        <Toaster richColors position="top-center" />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Suspense>
        <Footer />
        <Chatbot />
        <Toaster 
          position="top-right"
          theme="system"
          className="dark:bg-dark-card dark:text-dark-text"
        />
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;