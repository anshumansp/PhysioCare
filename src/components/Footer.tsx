import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">PhysioAI</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Revolutionizing physiotherapy with AI-powered solutions for better healthcare.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Home</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Services</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">AI Consultation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Treatment Plans</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Progress Tracking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">Expert Diagnosis</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-gray-600 dark:text-gray-400">contact@physioai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-gray-600 dark:text-gray-400">123 Health Street, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {new Date().getFullYear()} PhysioAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;