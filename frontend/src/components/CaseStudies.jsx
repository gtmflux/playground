import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, TrendingUp, Zap, Database, GitBranch, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { caseStudies } from '../mockData';

const iconMap = {
  cs1: Zap,
  cs2: Target,
  cs3: Database,
  cs4: GitBranch,
  cs5: TrendingUp
};

const CaseStudyCard = ({ study, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const Icon = iconMap[study.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="group bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] backdrop-blur-sm">
        {/* Video Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-orange-500/20 backdrop-blur-sm border-2 border-orange-500 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              <Play className="text-orange-500 w-8 h-8 ml-1" fill="currentColor" />
            </motion.div>
          </div>
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 flex items-center justify-center">
              <Icon className="text-orange-500 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
              {study.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {study.shortDescription}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 py-4">
            {Object.entries(study.metrics).map(([key, value]) => (
              <div key={key} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                <div className="text-orange-400 text-xl font-bold">{value}</div>
                <div className="text-zinc-500 text-xs uppercase tracking-wider mt-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2">
            {study.tools.map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 border border-zinc-700"
              >
                {tool}
              </Badge>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-2 pt-2">
            {study.results.slice(0, 2).map((result, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <span>{result}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 px-4 bg-zinc-800/50 hover:bg-orange-500/10 border border-zinc-700 hover:border-orange-500/50 rounded-lg text-zinc-300 hover:text-orange-400 font-medium transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            View Full Case Study →
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

const CaseStudies = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="case-studies" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Case Studies
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Real automated GTM systems and revenue engines I've architected
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
