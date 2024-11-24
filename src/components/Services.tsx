import React from 'react';
import { Stethoscope, ClipboardList, Brain, Activity } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Stethoscope className="w-12 h-12 text-primary-600" />,
      title: 'Expert Diagnosis',
      description: 'Get accurate assessments using our AI-powered diagnostic system combined with professional expertise.'
    },
    {
      icon: <ClipboardList className="w-12 h-12 text-primary-600" />,
      title: 'Treatment Plans',
      description: 'Receive personalized treatment plans tailored to your specific condition and recovery goals.'
    },
    {
      icon: <Brain className="w-12 h-12 text-primary-600" />,
      title: 'AI Consultation',
      description: '24/7 access to our AI assistant for instant guidance and support throughout your recovery journey.'
    },
    {
      icon: <Activity className="w-12 h-12 text-primary-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your recovery progress with detailed analytics and professional feedback.'
    }
  ];

  return (
    <section className="py-16 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive physiotherapy services enhanced by cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;