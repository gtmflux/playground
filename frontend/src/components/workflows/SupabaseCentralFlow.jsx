import React from 'react';
import { Database, BarChart3, Zap, Users, TrendingUp, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

const FlowNode = ({ icon: Icon, label, subLabel, isCenter = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative group ${
        isCenter 
          ? 'w-48 h-48 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500/60' 
          : 'w-32 h-32 bg-zinc-800/80 border-2 border-zinc-700/50'
      } rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-500/60 shadow-lg`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
          <div className={`${
            isCenter ? 'w-16 h-16 bg-orange-500/30' : 'w-12 h-12 bg-orange-500/20'
          } rounded-full flex items-center justify-center`}>
            <Icon className={`text-orange-400 ${isCenter ? 'w-8 h-8' : 'w-6 h-6'}`} />
          </div>
          <span className={`text-zinc-200 ${
            isCenter ? 'text-base' : 'text-sm'
          } font-semibold text-center leading-tight`}>{label}</span>
          {subLabel && <span className="text-zinc-500 text-xs text-center">{subLabel}</span>}
        </div>
        {isCenter && (
          <div className="absolute inset-0 bg-orange-500/5 rounded-xl animate-pulse" />
        )}
      </div>
    </div>
  );
};

const BidirectionalArrow = ({ vertical = false, horizontal = false }) => {
  if (vertical) {
    return (
      <div className="flex flex-col items-center justify-center py-3">
        <ArrowUpDown className="text-orange-400/60 w-6 h-6" />
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className="flex items-center justify-center px-3">
        <ArrowLeftRight className="text-orange-400/60 w-6 h-6" />
      </div>
    );
  }

  return null;
};

const SupabaseCentralFlow = () => {
  return (
    <div className="w-full p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 rounded-xl border border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        {/* Top Row */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <FlowNode icon={Database} label="Clay Enrich" subLabel="Enrichment" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={Zap} label="n8n Hub" subLabel="Automation" />
        </div>

        {/* Center - Vertical Arrows */}
        <div className="flex justify-center mb-4">
          <BidirectionalArrow vertical />
        </div>

        {/* Center Node */}
        <div className="flex justify-center mb-4">
          <FlowNode 
            icon={Database} 
            label="Supabase" 
            subLabel="Central GTM DB"
            isCenter={true}
          />
        </div>

        {/* Center - Vertical Arrows */}
        <div className="flex justify-center mb-4">
          <BidirectionalArrow vertical />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-center gap-6">
          <FlowNode icon={Users} label="CRM" subLabel="HubSpot" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={TrendingUp} label="Meta Ads" subLabel="Attribution" />
          <BidirectionalArrow horizontal />
          <FlowNode icon={BarChart3} label="Dashboards" subLabel="Analytics" />
        </div>

        {/* Database Tables Info */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800/50">
          <div className="text-center">
            <div className="text-orange-400 font-semibold text-sm mb-1">Accounts</div>
            <div className="text-zinc-500 text-xs">Company data, ICP scores</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-semibold text-sm mb-1">Contacts</div>
            <div className="text-zinc-500 text-xs">People, enrichment data</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-semibold text-sm mb-1">Events</div>
            <div className="text-zinc-500 text-xs">Interactions, conversions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseCentralFlow;
