import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Target, Sparkles, Code } from 'lucide-react';
import { Badge } from './ui/badge';
import { quickFacts } from '../mockData';

const QuickFacts = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-zinc-900 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
              At a Glance
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Quick Facts
            </h2>
          </div>

          {/* Facts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Location</h3>
              </div>
              <p className="text-lg font-medium text-white">{quickFacts.location}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Focus</h3>
              </div>
              <p className="text-lg font-medium text-white leading-tight">{quickFacts.focus}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Strengths</h3>
              </div>
              <p className="text-lg font-medium text-white leading-tight">{quickFacts.strengths}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Stack Count</h3>
              </div>
              <p className="text-lg font-medium text-white">{quickFacts.stacks.length}+ Tools</p>
            </motion.div>
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-orange-400" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickFacts.stacks.map((stack, index) => (
                <Badge
                  key={stack}
                  variant="secondary"
                  className="bg-zinc-700/50 text-zinc-200 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 border border-zinc-600 text-sm py-1.5 px-3"
                >
                  {stack}
                </Badge>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickFacts;
