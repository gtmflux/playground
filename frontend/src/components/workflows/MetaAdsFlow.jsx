import React from 'react';
import { TrendingUp, Zap, Database, Users, MessageSquare, Mail, Filter } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, color = 'orange', size = 'md', highlight = false }) => {
  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-32 h-32 text-sm',
    lg: 'w-40 h-40 text-base'
  };

  return (
    <div className="flex flex-col items-center gap-2 animate-fadeIn">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${
        highlight ? 'from-orange-900/40 to-orange-950/40 border-orange-500/60' : 'from-zinc-800 to-zinc-900 border-zinc-700'
      } border-2 flex flex-col items-center justify-center gap-2 p-3 shadow-lg hover:border-orange-500/70 transition-all duration-300 hover:scale-105 group relative`}>
        {highlight && (
          <div className="absolute inset-0 bg-orange-500/10 rounded-xl" />
        )}
        <div className={`w-10 h-10 rounded-full ${
          highlight ? 'bg-orange-500/30' : 'bg-orange-500/20'
        } flex items-center justify-center relative z-10`}>
          <Icon className={`text-orange-400 w-5 h-5`} />
        </div>
        <span className="text-zinc-300 text-center font-medium leading-tight relative z-10">{label}</span>
      </div>
    </div>
  );
};

const FlowArrow = ({ label, vertical = false, curved = false }) => {
  if (vertical) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-0.5 h-12 bg-gradient-to-b from-orange-500/60 to-orange-400/60 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-orange-400/60" />
        </div>
        {label && <span className="text-xs text-orange-400/70 mt-1 font-medium">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-3">
      <div className="h-0.5 w-16 bg-gradient-to-r from-orange-500/60 to-orange-400/60 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-orange-400/60" />
      </div>
      {label && <span className="text-xs text-orange-400/70 mt-1 font-medium whitespace-nowrap">{label}</span>}
    </div>
  );
};

const MetaAdsFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-lg">
      <div className="space-y-6">
        {/* Row 1: Lead Capture */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={TrendingUp} label="Meta Lead Form" color="orange" size="lg" highlight={true} />
          <FlowArrow label="webhook" />
          <FlowNode icon={Zap} label="n8n Catch" />
        </div>

        <FlowArrow vertical label="enrich" />

        {/* Row 2: Enrichment */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={Database} label="Clay API" />
          <FlowArrow label="data" />
          <FlowNode icon={Filter} label="Score Lead" color="orange" size="lg" />
          <FlowArrow label="save" />
          <FlowNode icon={Database} label="Supabase" />
        </div>

        <FlowArrow vertical label="sync" />

        {/* Row 3: Distribution */}
        <div className="flex items-center justify-center flex-wrap gap-4">
          <FlowNode icon={Users} label="CRM Update" />
          <FlowArrow />
          <FlowNode icon={MessageSquare} label="Slack Alert" />
          <FlowArrow />
          <FlowNode icon={Mail} label="Nurture Seq" />
        </div>

        {/* Feedback Loop */}
        <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-zinc-400">Conversion Event</span>
            <FlowArrow />
            <span className="text-orange-400 font-semibold">Meta CAPI Feedback</span>
            <FlowArrow />
            <span className="text-zinc-400">Optimize Campaigns</span>
          </div>
        </div>

        {/* Process Flow Label */}
        <div className="text-center mt-4 text-zinc-500 text-sm">
          <span className="font-mono">Capture → Enrich → Score → Sync → Alert → Nurture → Convert → Optimize</span>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsFlow;
