import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiClock, FiCalendar, FiUser, FiPhone, FiFileText, FiAlertCircle, FiCheckCircle, FiXCircle, FiHash, FiUsers, FiActivity, FiArchive } from 'react-icons/fi';
import { getAppointments, deleteAppointment, AppointmentData } from '../services/appointment';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusIcons = {
  pending: <FiAlertCircle className="w-5 h-5" />,
  confirmed: <FiCheckCircle className="w-5 h-5" />,
  cancelled: <FiXCircle className="w-5 h-5" />
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      // Sort appointments by date, most recent first
      const sortedAppointments = data.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAppointments(sortedAppointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await deleteAppointment(id);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const formatAppointmentDate = (date: Date) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">
              My Appointments
            </h1>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Book New Appointment
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white dark:bg-dark-card shadow-lg rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any appointments yet.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Schedule Your First Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-card shadow-lg rounded-lg overflow-hidden"
                >
                  {/* Status Banner */}
                  <div className={`px-6 py-3 flex items-center justify-between ${statusColors[appointment.status || 'pending']}`}>
                    <div className="flex items-center space-x-2">
                      {statusIcons[appointment.status || 'pending']}
                      <span className="font-semibold capitalize">
                        {appointment.status} Appointment
                      </span>
                    </div>
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id!)}
                        className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                            <p className="font-medium dark:text-dark-text">
                              {formatAppointmentDate(appointment.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiClock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                            <p className="font-medium dark:text-dark-text">{appointment.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Patient Name</p>
                            <p className="font-medium dark:text-dark-text">{appointment.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiPhone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                            <p className="font-medium dark:text-dark-text">{appointment.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <FiHash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                            <p className="font-medium dark:text-dark-text">
                              {appointment.notes?.match(/Age: (\d+)/)?.[1] || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiUsers className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                            <p className="font-medium dark:text-dark-text">
                              {appointment.notes?.match(/Gender: ([^\n]+)/)?.[1] || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiActivity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Condition</p>
                            <p className="font-medium dark:text-dark-text">
                              {appointment.notes?.match(/Condition: ([^\n]+)/)?.[1] || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <FiArchive className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Previous History</p>
                            <p className="font-medium dark:text-dark-text">
                              {appointment.notes?.match(/Previous History: ([^\n]+)/)?.[1] || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Appointments;
