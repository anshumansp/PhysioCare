import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  timeSlot: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  date: undefined,
  timeSlot: '',
  message: ''
};

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM'
];

const Contact = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setFormData(prev => ({
      ...prev,
      timeSlot: slot
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store form data in localStorage
    const submissions = JSON.parse(localStorage.getItem('appointmentSubmissions') || '[]');
    submissions.push({
      ...formData,
      date: formData.date?.toISOString(),
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('appointmentSubmissions', JSON.stringify(submissions));

    // Show success message
    toast.success('Appointment request submitted successfully! We will contact you soon.', {
      duration: 5000,
    });

    // Clear form
    setFormData(initialFormData);
    setSelectedTimeSlot('');
  };

  const css = `
    .rdp {
      --rdp-cell-size: 40px;
      --rdp-accent-color: #4F46E5;
      --rdp-background-color: #E0E7FF;
      margin: 0;
    }
    .rdp-day_selected:not([disabled]) { 
      background-color: var(--rdp-accent-color);
      color: white;
      font-weight: bold;
    }
    .rdp-day_selected:hover:not([disabled]) { 
      background-color: var(--rdp-accent-color);
      opacity: 0.8;
    }
    .dark .rdp-day_selected:not([disabled]) {
      background-color: #6366F1;
    }
    .dark .rdp {
      --rdp-background-color: #4F46E5;
      color: #E5E7EB;
    }
    .dark .rdp-day:hover:not([disabled]) {
      background-color: #4F46E5;
      opacity: 0.8;
    }
  `;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <style>{css}</style>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-dark-card shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">
              Schedule an Appointment
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-dark-hover dark:text-dark-text sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-dark-hover dark:text-dark-text sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-dark-hover dark:text-dark-text sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date
                </label>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-dark-hover">
                  <DayPicker
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    fromDate={new Date()}
                    required
                    className="mx-auto"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        selectedTimeSlot === slot
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-dark-hover dark:text-dark-text sm:text-sm"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Submit Appointment Request
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;