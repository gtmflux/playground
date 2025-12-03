// Mock data for Vinay Tambe GTM Engineer Portfolio

export const caseStudies = [
  {
    id: 'cs1',
    title: 'Email Deliverability + Outbound Engine',
    shortDescription: 'Enterprise-grade email infrastructure with multi-domain warmup and intelligent routing',
    description: 'Built a comprehensive email deliverability system handling 50K+ daily emails across multiple domains with automated DNS configuration, domain warmup orchestration, and smart routing based on engagement scores.',
    videoUrl: '/videos/email-deliverability.mp4',
    videoPlaceholder: true,
    metrics: {
      deliverability: '98.2%',
      dailyVolume: '50,000+',
      domains: '15',
      improvement: '+45%'
    },
    tools: ['Smartlead', 'Instantly', 'Cloudflare DNS', 'n8n', 'Python'],
    systemDiagram: 'email-deliverability',
    results: [
      'Increased email deliverability from 53% to 98.2%',
      'Automated DNS setup reducing configuration time by 90%',
      'Built domain health monitoring system',
      'Implemented automated warmup schedules'
    ]
  },
  {
    id: 'cs2',
    title: 'Inbound-led Outbound via Clay',
    shortDescription: 'Intelligent lead scoring and automated outbound sequences triggered by website behavior',
    description: 'Created a sophisticated pipeline that deanonymizes website visitors, scores them based on ICP fit, enriches with intent signals, and automatically triggers personalized outbound sequences.',
    videoUrl: '/videos/clay-outbound.mp4',
    videoPlaceholder: true,
    metrics: {
      conversion: '34%',
      leadsScored: '12,000+',
      automationRate: '95%',
      responseRate: '+127%'
    },
    tools: ['Clay', 'Clearbit Reveal', 'HubSpot', 'Smartlead', 'n8n'],
    systemDiagram: 'inbound-outbound',
    results: [
      'Converted 34% of identified visitors to qualified leads',
      'Automated 95% of lead scoring and routing',
      '127% increase in cold email response rates',
      'Reduced time-to-outreach from 3 days to 15 minutes'
    ]
  },
  {
    id: 'cs3',
    title: 'Supabase Central GTM Database',
    shortDescription: 'Unified source of truth for all GTM data with real-time sync across tools',
    description: 'Architected a centralized PostgreSQL database on Supabase as the single source of truth for all GTM operations, syncing data bidirectionally across CRM, marketing automation, ads platforms, and analytics tools.',
    videoUrl: '/videos/supabase-gtm.mp4',
    videoPlaceholder: true,
    metrics: {
      dataSources: '12',
      syncFrequency: 'Real-time',
      dataQuality: '99.5%',
      costSavings: '$48K/year'
    },
    tools: ['Supabase', 'PostgreSQL', 'n8n', 'HubSpot', 'Salesforce', 'Metabase'],
    systemDiagram: 'supabase-central',
    results: [
      'Eliminated data silos across 12 GTM tools',
      'Achieved 99.5% data accuracy and consistency',
      'Saved $48K annually on expensive middleware',
      'Enabled real-time reporting and dashboards'
    ]
  },
  {
    id: 'cs4',
    title: 'n8n RevOps Automation Hub',
    shortDescription: '150+ workflows automating CRM hygiene, lead routing, and cross-platform sync',
    description: 'Built a comprehensive automation layer using n8n to orchestrate 150+ workflows handling CRM data enrichment, lead assignment, Slack notifications, and cross-platform event syncing.',
    videoUrl: '/videos/n8n-automations.mp4',
    videoPlaceholder: true,
    metrics: {
      workflows: '150+',
      timeSaved: '200 hrs/mo',
      errorRate: '<0.5%',
      processedEvents: '1M+'
    },
    tools: ['n8n', 'HubSpot', 'Attio', 'Slack', 'PostgreSQL', 'APIs'],
    systemDiagram: 'n8n-hub',
    results: [
      'Saved 200+ hours monthly on manual data entry',
      'Automated lead routing with <2min latency',
      'Processed 1M+ events with 99.5% reliability',
      'Built custom API integrations for 15+ tools'
    ]
  },
  {
    id: 'cs5',
    title: 'Meta Ads → CRM Attribution System',
    shortDescription: 'Closed-loop attribution connecting ad spend to revenue with real-time feedback',
    description: 'Engineered a complete attribution pipeline that tracks users from Meta ad click through conversion, pipes data back to CRM, and feeds conversion events to Meta CAPI for optimization.',
    videoUrl: '/videos/meta-attribution.mp4',
    videoPlaceholder: true,
    metrics: {
      trackingAccuracy: '97%',
      roas: '+68%',
      cpa: '-42%',
      conversionRate: '+31%'
    },
    tools: ['Meta CAPI', 'HubSpot', 'Google Tag Manager', 'n8n', 'PostgreSQL'],
    systemDiagram: 'meta-attribution',
    results: [
      '68% improvement in ROAS',
      '42% reduction in cost per acquisition',
      '97% tracking accuracy post-iOS14',
      'Real-time conversion feedback to Meta'
    ]
  }
];

export const workflowDiagrams = [
  {
    id: 'email-deliverability',
    title: 'Email Deliverability Infrastructure',
    description: 'Multi-domain email infrastructure with automated DNS setup, warmup orchestration, and intelligent sending routing',
    downloadEnabled: true
  },
  {
    id: 'inbound-outbound',
    title: 'Inbound-led Outbound Pipeline',
    description: 'Visitor deanonymization → ICP scoring → enrichment → automated outbound sequences',
    downloadEnabled: true
  },
  {
    id: 'supabase-central',
    title: 'Supabase Central Database Architecture',
    description: 'Bidirectional sync between Supabase and 12 GTM tools with real-time event streaming',
    downloadEnabled: true
  },
  {
    id: 'n8n-hub',
    title: 'n8n Automation Hub',
    description: 'CRM hygiene, lead routing, enrichment, and cross-platform sync workflows',
    downloadEnabled: true
  },
  {
    id: 'meta-attribution',
    title: 'Meta Ads Attribution Feedback Loop',
    description: 'Ad click → Landing → CRM → Conversion → CAPI event feedback to Meta',
    downloadEnabled: true
  }
];

export const skills = {
  automation: ['n8n', 'Zapier', 'Make', 'Python', 'APIs'],
  dataEngineering: ['Supabase', 'PostgreSQL', 'SQL', 'Metabase', 'Tableau'],
  outbound: ['Smartlead', 'Instantly', 'Lemlist', 'Apollo', 'Clay'],
  crm: ['HubSpot', 'Salesforce', 'Attio', 'Pipedrive'],
  adsPlatforms: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'Meta CAPI'],
  enrichment: ['Clay', 'Clearbit', 'SerpAPI', 'Firecrawl', 'Apify'],
  technical: ['JavaScript', 'Python', 'SQL', 'REST APIs', 'Webhooks']
};
