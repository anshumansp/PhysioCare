import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Lead Physiotherapist',
    bio: 'Dr. Johnson has over 15 years of experience in sports medicine and rehabilitation. She specializes in treating complex musculoskeletal conditions and sports injuries.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Sports Rehabilitation', 'Manual Therapy', 'Spinal Conditions']
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Senior Physiotherapist',
    bio: 'With a focus on neurological rehabilitation, Dr. Chen brings innovative approaches to treating patients with stroke and spinal cord injuries.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Neurological Rehabilitation', 'Balance Training', 'Geriatric Care']
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Rehabilitation Specialist',
    bio: 'Dr. Rodriguez specializes in pediatric physiotherapy and has developed numerous successful treatment programs for children with developmental disorders.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Pediatric Therapy', 'Developmental Disorders', 'Orthopedic Rehabilitation']
  }
];

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 dark:bg-dark-bg">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Meet Our Expert Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our team of highly qualified physiotherapists is dedicated to providing 
            exceptional care and helping you achieve optimal physical health.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-white dark:bg-dark-card rounded-xl shadow-xl overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {member.bio}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                    Specialties:
                  </h4>
                  <ul className="space-y-1">
                    {member.specialties.map((specialty) => (
                      <li 
                        key={specialty}
                        className="text-gray-600 dark:text-gray-400 flex items-center"
                      >
                        <span className="mr-2">•</span>
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We are committed to providing exceptional physiotherapy care through 
              evidence-based practices, personalized treatment plans, and a 
              patient-centered approach. Our goal is to help you recover, improve, 
              and maintain optimal physical function and wellness.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-dark-card rounded-xl shadow-xl p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
              Our Approach
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We believe in a holistic approach to physiotherapy, combining traditional 
              techniques with modern technology and innovation. Our team stays 
              up-to-date with the latest research and treatment methods to ensure 
              you receive the best possible care.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;