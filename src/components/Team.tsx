import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
  qualifications: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Lead Physiotherapist',
    bio: 'Dr. Johnson has over 15 years of experience in sports medicine and rehabilitation. She specializes in treating complex musculoskeletal conditions and sports injuries.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Sports Rehabilitation', 'Manual Therapy', 'Spinal Conditions'],
    qualifications: [
      'Doctor of Physical Therapy - Stanford University',
      'Sports Rehabilitation Certification - American Physical Therapy Association',
      'Manual Therapy Specialist Certification',
      'Certified in Dry Needling and Acupuncture'
    ]
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Senior Physiotherapist',
    bio: 'With a focus on neurological rehabilitation, Dr. Chen brings innovative approaches to treating patients with stroke and spinal cord injuries.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Neurological Rehabilitation', 'Balance Training', 'Geriatric Care'],
    qualifications: [
      'Doctor of Physical Therapy - UCLA',
      'Neurological Rehabilitation Specialist',
      'Certified in Vestibular Rehabilitation',
      'Advanced Certification in Geriatric Care'
    ]
  }
];

const Team = () => {
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
    <section className="py-16 bg-white dark:bg-dark-bg">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Dedicated professionals committed to your recovery and well-being
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="bg-white dark:bg-dark-card rounded-xl shadow-xl overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-48 w-full object-cover md:h-full md:w-48"
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-primary-600 dark:text-primary-400 font-semibold">
                    {member.role}
                  </div>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-text">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {member.bio}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-2">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 text-sm px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-2">
                      Qualifications
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                      {member.qualifications.map((qualification) => (
                        <li key={qualification}>{qualification}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Team;
