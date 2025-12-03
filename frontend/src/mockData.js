// Mock data for Vinay Tambe GTM Engineer Portfolio

export const quickFacts = {
  location: 'India (remote)',
  focus: 'GTM Engineering, RevOps, Outbound, Automation',
  strengths: 'Systems thinking, tool integration, data-driven GTM',
  stacks: [
    'Clay', 'Supabase', 'n8n', 'Smartlead', 'Instantly', 
    'HubSpot', 'Salesforce', 'Attio', 'Metabase', 'Tableau', 
    'SerpAPI', 'Firecrawl', 'Apify', 'APIs', 'SQL'
  ]
};

export const coreSkills = [
  {
    id: 'email-infrastructure',
    title: 'Email Infrastructure & Deliverability',
    description: 'Setup of domains, inboxes, warmup, DNS, sender reputation so outbound lands in inbox, not spam.',
    impact: '98.2% deliverability rate across 50K+ daily emails',
    tools: ['Smartlead', 'Instantly', 'ZapMail', 'Premium Inboxes', 'DNS Config'],
    videoPlaceholder: true,
    category: 'outbound'
  },
  {
    id: 'meta-ads',
    title: 'Paid Ads – Meta Campaigns',
    description: 'Running Meta campaigns and connecting them to CRM + automation workflows.',
    impact: '68% ROAS improvement, 42% lower CPA with closed-loop attribution',
    tools: ['Meta Ads Manager', 'Meta CAPI', 'Google Tag Manager', 'n8n', 'HubSpot'],
    videoPlaceholder: true,
    category: 'ads'
  },
  {
    id: 'clay-orchestration',
    title: 'Clay.com – Data Orchestration & Inbound-led Outbound',
    description: 'Expert use of Clay for enrichment, scoring and outbound triggers. Inbound-led outbound: deanonymized website visitors → Clay → qualification → targeted campaigns.',
    impact: '34% conversion rate from identified visitors, 127% higher response rates',
    tools: ['Clay', 'Clearbit Reveal', 'Enrichment APIs', 'Scoring Rules'],
    videoPlaceholder: true,
    category: 'automation'
  },
  {
    id: 'supabase-gtm',
    title: 'Supabase – GTM Database / Source of Truth',
    description: 'Postgres DB in Supabase for accounts, contacts, ICP and events; easily integrated into automated workflows to read/write/update data.',
    impact: 'Eliminated data silos across 12 tools, 99.5% data accuracy',
    tools: ['Supabase', 'PostgreSQL', 'n8n', 'SQL', 'Real-time APIs'],
    videoPlaceholder: true,
    category: 'data'
  },
  {
    id: 'n8n-automation',
    title: 'n8n – Automation OS',
    description: 'Bi-directional CRM enrichment, routing Meta ads to Slack and CRM, connecting Supabase as central GTM DB with real-time updates.',
    impact: '150+ workflows, 200 hours/month saved, 99.5% reliability',
    tools: ['n8n', 'Webhooks', 'APIs', 'Custom Integrations'],
    videoPlaceholder: true,
    category: 'automation'
  },
  {
    id: 'dashboards',
    title: 'Dashboards – Metabase & Tableau',
    description: 'Building GTM and revenue dashboards on top of Supabase / central DB.',
    impact: 'Real-time revenue visibility, executive-ready reporting',
    tools: ['Metabase', 'Tableau', 'SQL', 'Data Visualization'],
    videoPlaceholder: true,
    category: 'analytics'
  },
  {
    id: 'crm-platforms',
    title: 'CRMs – HubSpot, Salesforce, Attio',
    description: 'Hands-on configuration and integration with GTM workflows.',
    impact: 'Seamless CRM integrations with automated data flow',
    tools: ['HubSpot', 'Salesforce', 'Attio', 'Pipedrive', 'APIs'],
    videoPlaceholder: true,
    category: 'crm'
  },
  {
    id: 'data-scraping',
    title: 'Data Scraping & Enrichment',
    description: 'Using SerpAPI, Firecrawl, Apify, Google, Google Maps, LinkedIn Sales Navigator, websites for account/people/qualitative data.',
    impact: 'Enriched 50K+ accounts with custom data points',
    tools: ['SerpAPI', 'Firecrawl', 'Apify', 'LinkedIn Sales Nav', 'Custom Scrapers'],
    videoPlaceholder: true,
    category: 'data'
  },
  {
    id: 'coding-apis',
    title: 'Light Coding & APIs',
    description: 'SQL, good understanding of APIs, webhooks and data flows.',
    impact: 'Built custom integrations and data pipelines',
    tools: ['SQL', 'JavaScript', 'Python', 'REST APIs', 'Webhooks'],
    videoPlaceholder: true,
    category: 'technical'
  }
];

export const workflowDiagrams = [
  {
    id: 'inbound-outbound',
    title: 'Inbound-led Outbound Pipeline',
    description: 'Website visitor → deanonymize → Clay enrich → ICP score → CRM sync → Smartlead sequences → Slack alerts',
    downloadEnabled: true
  },
  {
    id: 'supabase-central',
    title: 'Supabase Central GTM Database',
    description: 'Central hub connecting Clay, n8n, CRM, Meta Ads, and dashboards with bidirectional sync',
    downloadEnabled: true
  },
  {
    id: 'email-deliverability',
    title: 'Email Deliverability Infrastructure',
    description: 'Domain registration → DNS config → warmup → health monitoring → controlled sending',
    downloadEnabled: true
  },
  {
    id: 'meta-attribution',
    title: 'Meta Ads → CRM Attribution Loop',
    description: 'Lead form → webhook → enrich → score → CRM → Slack → nurture → CAPI feedback',
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
