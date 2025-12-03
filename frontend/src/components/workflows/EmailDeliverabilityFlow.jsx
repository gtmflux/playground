import React from 'react';
import { Globe, Shield, Mail, Zap, Activity, BarChart3, ArrowRight, ArrowDown } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, subLabel, status, highlight = false }) => {
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
      {status && (
        <span className="text-xs text-orange-400/70 font-medium">{status}</span>
      )}
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

const EmailDeliverabilityFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-xl border border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        {/* Row 1: Domain Setup */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <FlowNode icon={Globe} label="Register" subLabel="Domains" status="15 domains" />
          <HorizontalArrow label="configure" />
          <FlowNode icon={Shield} label="DNS Setup" subLabel="SPF/DKIM/DMARC" highlight={true} />
          <HorizontalArrow label="create" />
          <FlowNode icon={Mail} label="Mailboxes" subLabel="Configured" />
        </div>

        {/* Vertical Arrow */}
        <div className="flex justify-center mb-6">
          <VerticalArrow label="warmup" />
        </div>

        {/* Row 2: Warmup Phase */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <FlowNode icon={Activity} label="Warmup" subLabel="Tools" status="21-day cycle" />
          <HorizontalArrow label="monitor" />
          <FlowNode icon={BarChart3} label="Health Check" subLabel="Score" status="98.2%" highlight={true} />
        </div>

        {/* Vertical Arrow */}
        <div className="flex justify-center mb-6">
          <VerticalArrow label="ready" />
        </div>

        {/* Row 3: Sending */}
        <div className="flex items-center justify-center gap-4">
          <FlowNode icon={Zap} label="Smartlead" subLabel="Platform" />
          <HorizontalArrow label="route" />
          <FlowNode icon={Mail} label="Send" subLabel="Sequences" status="50K/day" highlight={true} />
          <HorizontalArrow label="report" />
          <FlowNode icon={Activity} label="Monitor" subLabel="Real-time" />
        </div>

        {/* Process Flow Summary */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50">
          <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
            <span className="font-mono">Register</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Configure</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Warmup</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Monitor</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Send</span>
            <ArrowRight className="w-4 h-4 text-orange-500/50" />
            <span className="font-mono">Optimize</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDeliverabilityFlow;
