import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createAppointment } from '../services/appointment';
import { getCurrentUser } from '../services/auth';

interface FormData {
  patientName: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  appointmentDate: Date | undefined;
  appointmentTime: string;
  condition: string;
  previousHistory: string;
}

const initialFormData: FormData = {
  patientName: '',
  age: '',
  gender: 'male',
  contactNumber: '',
  appointmentDate: undefined,
  appointmentTime: '',
  condition: '',
  previousHistory: ''
};

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM'
];

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error('Please login to schedule an appointment');
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setFormData(prev => ({
      ...prev,
      appointmentTime: slot
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointmentDate) {
      toast.error('Please select an appointment date');
      return;
    }

    try {
      await createAppointment({
        ...formData,
        age: parseInt(formData.age),
        appointmentDate: formData.appointmentDate
      });

      toast.success('Appointment scheduled successfully!');
      setFormData(initialFormData);
      setSelectedTimeSlot('');
    } catch (error) {
      toast.error('Failed to schedule appointment. Please try again.');
    }
  };

  const css = `
    .rdp {
      --rdp-cell-size: 45px;
      --rdp-accent-color: #4F46E5;
      --rdp-background-color: #E0E7FF;
      margin: 0;
      width: 100%;
    }
    .rdp-months {
      width: 100%;
      justify-content: space-around;
    }
    .rdp-month {
      width: 100%;
    }
    .rdp-table {
      width: 100%;
      max-width: none;
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
              <div className="mt-6">
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mt-6">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="mt-2 block w-full h-12 px-4 rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Date
                </label>
                <div className="border-2 rounded-lg p-4 bg-gray-50 dark:bg-dark-hover w-full flex justify-center border-gray-300 dark:border-gray-600">
                  <DayPicker
                    mode="single"
                    selected={formData.appointmentDate}
                    onSelect={handleDateSelect}
                    fromDate={new Date()}
                    required
                    className="w-full max-w-full"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Appointment Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-3 h-12 text-sm rounded-md transition-colors ${
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
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Condition
                </label>
                <textarea
                  id="condition"
                  name="condition"
                  rows={4}
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm p-4"
                  placeholder="Please provide any additional information about your condition..."
                />
              </div>

              <div>
                <label htmlFor="previousHistory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Previous History
                </label>
                <textarea
                  id="previousHistory"
                  name="previousHistory"
                  rows={4}
                  value={formData.previousHistory}
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-hover dark:border-gray-600 dark:text-dark-text dark:focus:border-primary-400 sm:text-sm p-4"
                  placeholder="Please provide any previous medical history..."
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