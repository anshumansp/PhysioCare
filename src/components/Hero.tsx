import React from 'react';
import { Activity, Calendar, MessageSquare } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Personal
          <span className="text-primary-600"> Physiotherapy </span>
          Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience personalized care with our AI-powered physiotherapy platform. Get instant support, schedule appointments, and receive tailored treatment plans.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            <MessageSquare size={20} />
            Talk to Our AI Assistant
          </button>
          <button className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
            <Calendar size={20} />
            Schedule Appointment
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Activity className="w-8 h-8 text-primary-600" />,
              title: "Smart Diagnosis",
              description: "Get AI-powered initial assessments and personalized treatment recommendations"
            },
            {
              icon: <Calendar className="w-8 h-8 text-primary-600" />,
              title: "Easy Scheduling",
              description: "Book appointments instantly with our intelligent scheduling system"
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-primary-600" />,
              title: "24/7 Support",
              description: "Access our AI assistant anytime for guidance and support"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;