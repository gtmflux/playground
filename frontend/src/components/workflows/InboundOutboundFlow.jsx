import React from 'react';
import { Globe, Database, Filter, Zap, Mail, MessageSquare, Users } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, color = 'orange', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-32 h-32 text-sm',
    lg: 'w-40 h-40 text-base'
  };

  return (
    <div className="flex flex-col items-center gap-2 animate-fadeIn">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-${color}-500/40 flex flex-col items-center justify-center gap-2 p-3 shadow-lg hover:border-${color}-500/70 transition-all duration-300 hover:scale-105 group relative`}>
        <div className={`absolute inset-0 bg-${color}-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center relative z-10`}>
          <Icon className={`text-${color}-400 w-5 h-5`} />
        </div>
        <span className="text-zinc-300 text-center font-medium leading-tight relative z-10">{label}</span>
      </div>
    </div>
  );
};

const FlowArrow = ({ label, vertical = false, bidirectional = false }) => {
  if (vertical) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-0.5 h-12 bg-gradient-to-b from-orange-500/60 to-orange-400/60 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-orange-400/60" />
          {bidirectional && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-orange-400/60" />
          )}
        </div>
        {label && <span className="text-xs text-orange-400/70 mt-1 font-medium">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-3">
      <div className="h-0.5 w-16 bg-gradient-to-r from-orange-500/60 to-orange-400/60 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-orange-400/60" />
        {bidirectional && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-orange-400/60" />
        )}
      </div>
      {label && <span className="text-xs text-orange-400/70 mt-1 font-medium whitespace-nowrap">{label}</span>}
    </div>
  );
};

const InboundOutboundFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-lg">
      <div className="space-y-6">
        {/* Row 1: Website to Clay */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={Globe} label="Website Visitor" />
          <FlowArrow label="track" />
          <FlowNode icon={Zap} label="Deanonymize" />
          <FlowArrow label="domain" />
          <FlowNode icon={Database} label="Clay Enrich" color="orange" size="lg" />
        </div>

        <FlowArrow vertical label="enrich" />

        {/* Row 2: Clay to Scoring */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={Database} label="Firmographics" />
          <FlowArrow />
          <FlowNode icon={Filter} label="ICP Score" color="orange" size="lg" />
          <FlowArrow label="qualified" />
          <FlowNode icon={Database} label="Supabase DB" />
        </div>

        <FlowArrow vertical label="sync" />

        {/* Row 3: CRM to Outbound */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={Users} label="CRM Sync" />
          <FlowArrow />
          <FlowNode icon={Mail} label="Smartlead" color="orange" size="lg" />
          <FlowArrow label="trigger" />
          <FlowNode icon={MessageSquare} label="Slack Alert" />
        </div>

        {/* Process Flow Label */}
        <div className="text-center mt-6 text-zinc-500 text-sm">
          <span className="font-mono">Track → Deanonymize → Enrich → Score → Qualify → Sync → Sequence → Alert</span>
        </div>
      </div>
    </div>
  );
};

export default InboundOutboundFlow;
