import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ZoomIn, Download, Maximize2, Mail, Target, Database, GitBranch, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { workflowDiagrams } from '../mockData';

// Simple workflow diagram components (will be enhanced with React Flow later if needed)
const WorkflowNode = ({ label, icon: Icon, color = 'orange' }) => (
  <div className={`flex flex-col items-center gap-2 p-4 rounded-lg bg-zinc-800/50 border-2 border-${color}-500/30 min-w-[120px]`}>
    <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
      <Icon className={`text-${color}-400 w-6 h-6`} />
    </div>
    <span className="text-zinc-300 text-sm font-medium text-center">{label}</span>
  </div>
);

const WorkflowArrow = () => (
  <div className="flex items-center justify-center px-4">
    <div className="h-0.5 w-full bg-gradient-to-r from-orange-500/50 to-orange-400/50 relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-orange-400/50 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
    </div>
  </div>
);

const EmailDeliverabilityDiagram = () => (
  <div className="space-y-8 p-8">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <WorkflowNode label="DNS Setup" icon={Database} />
      <WorkflowArrow />
      <WorkflowNode label="Domain Warmup" icon={Mail} />
      <WorkflowArrow />
      <WorkflowNode label="Health Monitor" icon={BarChart3} />
    </div>
    <div className="flex items-center justify-center flex-wrap gap-4">
      <WorkflowArrow />
      <WorkflowNode label="Smartlead" icon={Target} />
      <WorkflowArrow />
      <WorkflowNode label="Routing Engine" icon={GitBranch} />
    </div>
  </div>
);

const InboundOutboundDiagram = () => (
  <div className="space-y-8 p-8">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <WorkflowNode label="Website Visit" icon={Target} />
      <WorkflowArrow />
      <WorkflowNode label="Deanonymize" icon={Database} />
      <WorkflowArrow />
      <WorkflowNode label="ICP Score" icon={BarChart3} />
    </div>
    <div className="flex items-center justify-center flex-wrap gap-4">
      <WorkflowArrow />
      <WorkflowNode label="Enrich Data" icon={GitBranch} />
      <WorkflowArrow />
      <WorkflowNode label="Outbound Seq" icon={Mail} />
    </div>
  </div>
);

const diagramComponents = {
  'email-deliverability': EmailDeliverabilityDiagram,
  'inbound-outbound': InboundOutboundDiagram,
  'supabase-central': EmailDeliverabilityDiagram, // Placeholder
  'n8n-hub': InboundOutboundDiagram, // Placeholder
  'meta-attribution': EmailDeliverabilityDiagram // Placeholder
};

const diagramIcons = {
  'email-deliverability': Mail,
  'inbound-outbound': Target,
  'supabase-central': Database,
  'n8n-hub': GitBranch,
  'meta-attribution': BarChart3
};

const WorkflowDiagramCard = ({ diagram, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const DiagramComponent = diagramComponents[diagram.id] || EmailDeliverabilityDiagram;
  const Icon = diagramIcons[diagram.id] || GitBranch;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="group bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] backdrop-blur-sm">
        {/* Diagram Preview */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <DiagramComponent />
          <div className="absolute top-4 right-4 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-zinc-800/80 hover:bg-orange-500/20 border border-zinc-700 hover:border-orange-500/50 backdrop-blur-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl bg-zinc-950 border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">{diagram.title}</DialogTitle>
                </DialogHeader>
                <div className="bg-zinc-900 rounded-lg">
                  <DiagramComponent />
                </div>
              </DialogContent>
            </Dialog>
            {diagram.downloadEnabled && (
              <Button
                size="sm"
                className="bg-zinc-800/80 hover:bg-orange-500/20 border border-zinc-700 hover:border-orange-500/50 backdrop-blur-sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="text-orange-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                {diagram.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {diagram.description}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const WorkflowDiagrams = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="workflows" className="py-32 bg-zinc-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            System Architecture
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Workflow Diagrams
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Interactive technical blueprints of automated GTM systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {workflowDiagrams.map((diagram, index) => (
            <WorkflowDiagramCard key={diagram.id} diagram={diagram} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagrams;
