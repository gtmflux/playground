import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Linkedin, MapPin, Calendar } from 'lucide-react';
import { contactInfo } from '../mockData';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="py-32 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact
          </h2>
          <p className="text-lg text-zinc-400">
            {contactInfo.availability}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Email */}
          <a
            href={`mailto:${contactInfo.email}`}
            className="group bg-zinc-800/50 border-2 border-zinc-700 hover:border-orange-500/50 rounded-lg p-6 transition-all duration-300 hover:bg-zinc-800"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Email
                </div>
                <div className="text-white font-medium text-lg break-all">
                  {contactInfo.email}
                </div>
              </div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-zinc-800/50 border-2 border-zinc-700 hover:border-orange-500/50 rounded-lg p-6 transition-all duration-300 hover:bg-zinc-800"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                <Linkedin className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  LinkedIn
                </div>
                <div className="text-white font-medium text-lg">
                  Vinay Tambe
                </div>
              </div>
            </div>
          </a>

          {/* Location */}
          <div className="bg-zinc-800/50 border-2 border-zinc-700 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-white font-medium text-lg">
                  {contactInfo.location}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <a
            href={contactInfo.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-orange-500/10 border-2 border-orange-500/30 hover:border-orange-500 rounded-lg p-6 transition-all duration-300 hover:bg-orange-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-1">
                  Schedule Call
                </div>
                <div className="text-white font-medium text-lg">
                  Book 30-min meeting
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
