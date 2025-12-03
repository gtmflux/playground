import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ZoomIn, Download, Maximize2, Mail, Target, Database, GitBranch, BarChart3 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { workflowDiagrams } from '../mockData';
import InboundOutboundFlow from './workflows/InboundOutboundFlow';
import SupabaseCentralFlow from './workflows/SupabaseCentralFlow';
import EmailDeliverabilityFlow from './workflows/EmailDeliverabilityFlow';
import MetaAdsFlow from './workflows/MetaAdsFlow';

const diagramComponents = {
  'email-deliverability': EmailDeliverabilityFlow,
  'inbound-outbound': InboundOutboundFlow,
  'supabase-central': SupabaseCentralFlow,
  'n8n-hub': InboundOutboundFlow, // Using Inbound as placeholder for n8n
  'meta-attribution': MetaAdsFlow
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
