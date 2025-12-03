import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { experience } from '../mockData';

const ExperienceCard = ({ exp, index, isLast }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/50 to-zinc-700/30" />
      )}

      <div className="flex gap-6">
        {/* Timeline dot */}
        <div className="flex-shrink-0 relative z-10">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-12">
          <div className="bg-zinc-800/50 border border-zinc-700 hover:border-orange-500/50 rounded-lg p-6 transition-all duration-300 hover:bg-zinc-800">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                {exp.role}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-white">{exp.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>{exp.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{exp.location}</span>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <ul className="space-y-3 mb-6">
              {exp.responsibilities.map((responsibility, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{responsibility}</span>
                </li>
              ))}
            </ul>

            {/* Tools */}
            <div>
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Tools & Technologies
              </div>
              <div className="flex flex-wrap gap-2">
                {exp.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    className="bg-zinc-700/50 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 border border-zinc-600 text-xs"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="experience" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            Career Timeline
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Experience
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Building automated GTM systems and revenue engines
          </p>
        </motion.div>

        <div>
          {experience.map((exp, index) => (
            <ExperienceCard 
              key={exp.id} 
              exp={exp} 
              index={index}
              isLast={index === experience.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
