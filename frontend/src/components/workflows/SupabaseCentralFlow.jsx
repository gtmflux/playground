import React from 'react';
import { Database, BarChart3, Zap, Users, TrendingUp, Activity } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, color = 'orange', size = 'md', isCenter = false }) => {
  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-32 h-32 text-sm',
    lg: 'w-40 h-40 text-base',
    xl: 'w-48 h-48 text-lg'
  };

  return (
    <div className="flex flex-col items-center gap-2 animate-fadeIn">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${
        isCenter ? 'from-orange-900/40 to-orange-950/40 border-orange-500/60' : 'from-zinc-800 to-zinc-900 border-zinc-700'
      } border-2 flex flex-col items-center justify-center gap-2 p-3 shadow-lg hover:border-orange-500/70 transition-all duration-300 hover:scale-105 group relative`}>
        {isCenter && (
          <div className="absolute inset-0 bg-orange-500/10 rounded-xl animate-pulse" />
        )}
        <div className={`w-12 h-12 rounded-full ${
          isCenter ? 'bg-orange-500/30' : 'bg-orange-500/20'
        } flex items-center justify-center relative z-10`}>
          <Icon className={`text-orange-400 w-6 h-6`} />
        </div>
        <span className="text-zinc-300 text-center font-medium leading-tight relative z-10">{label}</span>
      </div>
    </div>
  );
};

const BidirectionalArrow = ({ vertical = false, horizontal = false }) => {
  if (vertical) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-0.5 h-16 bg-gradient-to-b from-orange-500/60 via-orange-400/60 to-orange-500/60 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-orange-400/60" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-orange-400/60" />
        </div>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className="flex items-center justify-center px-2">
        <div className="h-0.5 w-20 bg-gradient-to-r from-orange-500/60 via-orange-400/60 to-orange-500/60 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-orange-400/60" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-orange-400/60" />
        </div>
      </div>
    );
  }

  return null;
};

const SupabaseCentralFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 rounded-lg">
      <div className="space-y-8">
        {/* Top Row */}
        <div className="flex items-center justify-center gap-8">
          <FlowNode icon={Database} label="Clay Enrich" size="md" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={Zap} label="n8n Hub" size="md" />
        </div>

        {/* Center - Supabase */}
        <div className="flex items-center justify-center">
          <BidirectionalArrow vertical />
        </div>

        <div className="flex items-center justify-center">
          <FlowNode 
            icon={Database} 
            label="Supabase Central DB" 
            color="orange" 
            size="xl" 
            isCenter={true}
          />
        </div>

        <div className="flex items-center justify-center">
          <BidirectionalArrow vertical />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-center gap-8">
          <FlowNode icon={Users} label="CRM (HubSpot)" size="md" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={TrendingUp} label="Meta Ads" size="md" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={BarChart3} label="Dashboards" size="md" />
        </div>

        {/* Labels */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-xs text-zinc-500">
          <div className="text-center">
            <div className="font-semibold text-orange-400 mb-1">Accounts</div>
            <div>Company data, ICP scores</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-orange-400 mb-1">Contacts</div>
            <div>People, enrichment data</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-orange-400 mb-1">Events</div>
            <div>Interactions, conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseCentralFlow;
