const axios = require('axios');
require('dotenv').config();

const META_ADS_BASE_URL = 'https://graph.facebook.com';
const API_VERSION = process.env.META_ADS_API_VERSION || 'v18.0';
const ACCESS_TOKEN = process.env.META_ADS_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID;

class MetaAdsService {
  constructor() {
    this.baseUrl = `${META_ADS_BASE_URL}/${API_VERSION}`;
    this.accessToken = ACCESS_TOKEN;
    this.accountId = ACCOUNT_ID;
  }

  /**
   * Get account insights (overview metrics)
   */
  async getAccountInsights(datePreset = 'last_30d') {
    try {
      if (!this.accessToken || !this.accountId) {
        throw new Error('Meta Ads credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/${this.accountId}/insights`, {
        params: {
          access_token: this.accessToken,
          date_preset: datePreset,
          fields: 'impressions,clicks,spend,reach,cpc,cpm,ctr,actions,action_values',
          level: 'account'
        }
      });

      return this.formatAccountInsights(response.data);
    } catch (error) {
      console.error('Meta Ads API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Meta Ads account insights: ${error.message}`);
    }
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignPerformance(datePreset = 'last_30d') {
    try {
      if (!this.accessToken || !this.accountId) {
        throw new Error('Meta Ads credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/${this.accountId}/campaigns`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,status,objective,insights{impressions,clicks,spend,reach,cpc,cpm,ctr,actions,action_values}',
          date_preset: datePreset
        }
      });

      return this.formatCampaignData(response.data);
    } catch (error) {
      console.error('Meta Ads API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Meta Ads campaigns: ${error.message}`);
    }
  }

  /**
   * Get ad set performance
   */
  async getAdSetPerformance(datePreset = 'last_30d') {
    try {
      if (!this.accessToken || !this.accountId) {
        throw new Error('Meta Ads credentials not configured');
      }

      const response = await axios.get(`${this.baseUrl}/${this.accountId}/adsets`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,status,campaign_id,insights{impressions,clicks,spend,reach,cpc,cpm,ctr}',
          date_preset: datePreset,
          limit: 100
        }
      });

      return this.formatAdSetData(response.data);
    } catch (error) {
      console.error('Meta Ads API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Meta Ads ad sets: ${error.message}`);
    }
  }

  /**
   * Format account insights data
   */
  formatAccountInsights(data) {
    if (!data.data || data.data.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        spend: 0,
        reach: 0,
        cpc: 0,
        cpm: 0,
        ctr: 0,
        conversions: 0,
        revenue: 0
      };
    }

    const insights = data.data[0];
    const conversions = insights.actions?.find(a => a.action_type === 'purchase')?.value || 0;
    const revenue = insights.action_values?.find(a => a.action_type === 'purchase')?.value || 0;

    return {
      impressions: parseInt(insights.impressions || 0),
      clicks: parseInt(insights.clicks || 0),
      spend: parseFloat(insights.spend || 0),
      reach: parseInt(insights.reach || 0),
      cpc: parseFloat(insights.cpc || 0),
      cpm: parseFloat(insights.cpm || 0),
      ctr: parseFloat(insights.ctr || 0),
      conversions: parseInt(conversions),
      revenue: parseFloat(revenue),
      roas: insights.spend > 0 ? (parseFloat(revenue) / parseFloat(insights.spend)).toFixed(2) : 0
    };
  }

  /**
   * Format campaign data
   */
  formatCampaignData(data) {
    if (!data.data) {
      return [];
    }

    return data.data.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      metrics: campaign.insights?.data?.[0] ? {
        impressions: parseInt(campaign.insights.data[0].impressions || 0),
        clicks: parseInt(campaign.insights.data[0].clicks || 0),
        spend: parseFloat(campaign.insights.data[0].spend || 0),
        reach: parseInt(campaign.insights.data[0].reach || 0),
        cpc: parseFloat(campaign.insights.data[0].cpc || 0),
        cpm: parseFloat(campaign.insights.data[0].cpm || 0),
        ctr: parseFloat(campaign.insights.data[0].ctr || 0)
      } : null
    }));
  }

  /**
   * Format ad set data
   */
  formatAdSetData(data) {
    if (!data.data) {
      return [];
    }

    return data.data.map(adset => ({
      id: adset.id,
      name: adset.name,
      status: adset.status,
      campaign_id: adset.campaign_id,
      metrics: adset.insights?.data?.[0] ? {
        impressions: parseInt(adset.insights.data[0].impressions || 0),
        clicks: parseInt(adset.insights.data[0].clicks || 0),
        spend: parseFloat(adset.insights.data[0].spend || 0),
        reach: parseInt(adset.insights.data[0].reach || 0),
        cpc: parseFloat(adset.insights.data[0].cpc || 0),
        cpm: parseFloat(adset.insights.data[0].cpm || 0),
        ctr: parseFloat(adset.insights.data[0].ctr || 0)
      } : null
    }));
  }
}

module.exports = new MetaAdsService();
