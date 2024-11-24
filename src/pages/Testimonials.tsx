import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "John Smith",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    text: "The AI-powered diagnosis was spot on, and Dr. Johnson's treatment plan helped me recover from my sports injury faster than expected.",
    rating: 5
  },
  {
    name: "Emily Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    text: "The chatbot made scheduling appointments so easy, and the personalized exercises have really helped with my chronic back pain.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    text: "Outstanding service! The combination of AI technology and expert care is revolutionary. My recovery has been remarkable.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
        What Our Patients Say
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;