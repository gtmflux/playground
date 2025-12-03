import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Mail, TrendingUp, Database, Zap, BarChart3, Users, Search, Code } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { coreSkills } from '../mockData';

const iconMap = {
  'email-infrastructure': Mail,
  'meta-ads': TrendingUp,
  'clay-orchestration': Database,
  'supabase-gtm': Database,
  'n8n-automation': Zap,
  'dashboards': BarChart3,
  'crm-platforms': Users,
  'data-scraping': Search,
  'coding-apis': Code
};

const categoryColors = {
  outbound: 'orange',
  ads: 'orange',
  automation: 'orange',
  data: 'orange',
  analytics: 'orange',
  crm: 'orange',
  technical: 'orange'
};

const SkillCard = ({ skill, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const Icon = iconMap[skill.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="group bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] backdrop-blur-sm h-full flex flex-col">
        {/* Video Placeholder */}
        {skill.videoPlaceholder && (
          <div className="relative aspect-video bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 overflow-hidden border-b border-zinc-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-orange-500/20 backdrop-blur-sm border-2 border-orange-500 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
              >
                <Play className="text-orange-500 w-7 h-7 ml-1" fill="currentColor" />
              </motion.div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 flex items-center justify-center">
                <Icon className="text-orange-500 w-6 h-6" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-zinc-900/80 border-zinc-700 text-zinc-300 text-xs">
                30-90s demo
              </Badge>
            </div>
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            {!skill.videoPlaceholder && (
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Icon className="text-orange-500 w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                {skill.title}
              </h3>
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            {skill.description}
          </p>

          {/* Impact */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3 mb-4">
            <div className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Impact
            </div>
            <div className="text-zinc-300 text-sm">{skill.impact}</div>
          </div>

          {/* Tools */}
          <div className="mt-auto">
            <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Tools
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300 border border-zinc-700 text-xs"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const CoreSkills = () => {
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
            Expertise
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Core Skills
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Deep expertise in GTM automation, data engineering, and revenue systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreSkills;
