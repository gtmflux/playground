import React from 'react';
import { TrendingUp, Zap, Database, Users, MessageSquare, Mail, Filter, ArrowRight, ArrowDown, RefreshCw } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, subLabel, highlight = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative group ${
        highlight 
          ? 'w-36 h-36 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500/60' 
          : 'w-32 h-32 bg-zinc-800/80 border-2 border-zinc-700/50'
      } rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-500/60 shadow-lg`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
          <div className={`${
            highlight ? 'w-14 h-14 bg-orange-500/30' : 'w-12 h-12 bg-orange-500/20'
          } rounded-full flex items-center justify-center`}>
            <Icon className="text-orange-400 w-6 h-6" />
          </div>
          <span className="text-zinc-200 text-sm font-semibold text-center leading-tight">{label}</span>
          {subLabel && <span className="text-zinc-500 text-xs text-center">{subLabel}</span>}
        </div>
        {highlight && (
          <div className="absolute inset-0 bg-orange-500/5 rounded-xl animate-pulse" />
        )}
      </div>
    </div>
  );
};

const HorizontalArrow = ({ label }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="flex items-center gap-1">
      <div className="h-0.5 w-12 bg-gradient-to-r from-orange-500/40 to-orange-400/60" />
      <ArrowRight className="text-orange-400/60 w-5 h-5" />
    </div>
    {label && (
      <span className="text-xs text-orange-400/70 font-medium mt-1 whitespace-nowrap">{label}</span>
    )}
  </div>
);

const VerticalArrow = ({ label }) => (
  <div className="flex items-center justify-center gap-2">
    {label && (
      <span className="text-xs text-orange-400/70 font-medium whitespace-nowrap">{label}</span>
    )}
    <div className="flex flex-col items-center gap-1">
      <div className="w-0.5 h-12 bg-gradient-to-b from-orange-500/40 to-orange-400/60" />
      <ArrowDown className="text-orange-400/60 w-5 h-5" />
    </div>
  </div>
);

const MetaAdsFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-xl border border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        {/* Row 1: Lead Capture */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <FlowNode icon={TrendingUp} label="Meta Ads" subLabel="Lead Form" highlight={true} />
          <HorizontalArrow label="webhook" />
          <FlowNode icon={Zap} label="n8n Catch" subLabel="Trigger" />
        </div>

        {/* Vertical Arrow */}
        <div className="flex justify-center mb-6">
          <VerticalArrow label="enrich" />
        </div>

        {/* Row 2: Enrichment */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <FlowNode icon={Database} label="Clay API" subLabel="Enrich" />
          <HorizontalArrow label="data" />
          <FlowNode icon={Filter} label="Score Lead" subLabel="ICP Fit" highlight={true} />
          <HorizontalArrow label="save" />
          <FlowNode icon={Database} label="Supabase" subLabel="Store" />
        </div>

        {/* Vertical Arrow */}
        <div className="flex justify-center mb-6">
          <VerticalArrow label="sync" />
        </div>

        {/* Row 3: Distribution */}
        <div className="flex items-center justify-center gap-4">
          <FlowNode icon={Users} label="CRM" subLabel="Update" />
          <HorizontalArrow />
          <FlowNode icon={MessageSquare} label="Slack" subLabel="Alert" />
          <HorizontalArrow />
          <FlowNode icon={Mail} label="Nurture" subLabel="Sequence" />
        </div>

        {/* Feedback Loop */}
        <div className="mt-8 p-5 bg-orange-500/5 rounded-lg border border-orange-500/20">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-zinc-300 font-medium">Conversion Event</span>
            <RefreshCw className="text-orange-400 w-5 h-5" />
            <span className="text-orange-400 font-semibold">Meta CAPI Feedback</span>
            <RefreshCw className="text-orange-400 w-5 h-5" />
            <span className="text-zinc-300 font-medium">Optimize Campaigns</span>
          </div>
        </div>

        {/* Process Flow Summary */}
        <div className="mt-6 pt-6 border-t border-zinc-800/50">
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
            <span className="font-mono">Capture</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Enrich</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Score</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Sync</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Alert</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Nurture</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Optimize</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsFlow;
