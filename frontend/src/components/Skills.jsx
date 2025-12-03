import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Database, Mail, Users, BarChart3, Code, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { skills } from '../mockData';

const skillCategories = [
  {
    title: 'Automation & Integration',
    icon: Zap,
    skills: skills.automation,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Data Engineering',
    icon: Database,
    skills: skills.dataEngineering,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Outbound Tools',
    icon: Mail,
    skills: skills.outbound,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'CRM Platforms',
    icon: Users,
    skills: skills.crm,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Ads & Attribution',
    icon: TrendingUp,
    skills: skills.adsPlatforms,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Enrichment & APIs',
    icon: BarChart3,
    skills: skills.enrichment,
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Technical Stack',
    icon: Code,
    skills: skills.technical,
    color: 'from-orange-500 to-orange-600'
  }
];

const SkillCard = ({ category, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const Icon = category.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="group bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-all duration-500 p-6 h-full hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity`}>
            <Icon className="text-orange-500 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
            {category.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 border border-zinc-700 text-sm py-1"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="skills" className="py-32 bg-zinc-950 relative overflow-hidden">
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
            Tech Stack
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tools & Technologies
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Full-stack GTM engineering with modern automation tools
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
