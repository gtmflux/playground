const axios = require('axios');
require('dotenv').config();

const SMARTLEAD_BASE_URL = 'https://server.smartlead.ai/api/v1';
const API_KEY = process.env.SMARTLEAD_API_KEY;

class SmartleadService {
  constructor() {
    this.baseUrl = SMARTLEAD_BASE_URL;
    this.apiKey = API_KEY;
  }

  /**
   * Get all campaigns
   */
  async getCampaigns() {
    try {
      if (!this.apiKey) {
        throw new Error('Smartlead API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/campaigns`, {
        params: {
          api_key: this.apiKey
        }
      });

      return this.formatCampaigns(response.data);
    } catch (error) {
      console.error('Smartlead API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Smartlead campaigns: ${error.message}`);
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId) {
    try {
      if (!this.apiKey) {
        throw new Error('Smartlead API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/campaigns/${campaignId}/analytics`, {
        params: {
          api_key: this.apiKey
        }
      });

      return this.formatCampaignAnalytics(response.data);
    } catch (error) {
      console.error('Smartlead API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Smartlead campaign analytics: ${error.message}`);
    }
  }

  /**
   * Get overall email statistics
   */
  async getOverallStats() {
    try {
      if (!this.apiKey) {
        throw new Error('Smartlead API key not configured');
      }

      const campaigns = await this.getCampaigns();

      // Aggregate stats from all campaigns
      const stats = {
        total_campaigns: campaigns.length,
        total_sent: 0,
        total_delivered: 0,
        total_opened: 0,
        total_clicked: 0,
        total_replied: 0,
        total_bounced: 0,
        open_rate: 0,
        click_rate: 0,
        reply_rate: 0,
        bounce_rate: 0
      };

      campaigns.forEach(campaign => {
        stats.total_sent += campaign.sent || 0;
        stats.total_delivered += campaign.delivered || 0;
        stats.total_opened += campaign.opened || 0;
        stats.total_clicked += campaign.clicked || 0;
        stats.total_replied += campaign.replied || 0;
        stats.total_bounced += campaign.bounced || 0;
      });

      // Calculate rates
      if (stats.total_sent > 0) {
        stats.open_rate = ((stats.total_opened / stats.total_sent) * 100).toFixed(2);
        stats.click_rate = ((stats.total_clicked / stats.total_sent) * 100).toFixed(2);
        stats.reply_rate = ((stats.total_replied / stats.total_sent) * 100).toFixed(2);
        stats.bounce_rate = ((stats.total_bounced / stats.total_sent) * 100).toFixed(2);
      }

      return stats;
    } catch (error) {
      console.error('Smartlead API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Smartlead overall stats: ${error.message}`);
    }
  }

  /**
   * Get email accounts status
   */
  async getEmailAccounts() {
    try {
      if (!this.apiKey) {
        throw new Error('Smartlead API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/email-accounts`, {
        params: {
          api_key: this.apiKey
        }
      });

      return this.formatEmailAccounts(response.data);
    } catch (error) {
      console.error('Smartlead API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch Smartlead email accounts: ${error.message}`);
    }
  }

  /**
   * Format campaigns data
   */
  formatCampaigns(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      sent: campaign.total_sent || 0,
      delivered: campaign.total_delivered || 0,
      opened: campaign.total_opened || 0,
      clicked: campaign.total_clicked || 0,
      replied: campaign.total_replied || 0,
      bounced: campaign.total_bounced || 0,
      open_rate: campaign.open_rate || 0,
      click_rate: campaign.click_rate || 0,
      reply_rate: campaign.reply_rate || 0,
      created_at: campaign.created_at
    }));
  }

  /**
   * Format campaign analytics
   */
  formatCampaignAnalytics(data) {
    return {
      campaign_id: data.campaign_id,
      total_leads: data.total_leads || 0,
      sent: data.sent || 0,
      delivered: data.delivered || 0,
      opened: data.opened || 0,
      clicked: data.clicked || 0,
      replied: data.replied || 0,
      bounced: data.bounced || 0,
      unsubscribed: data.unsubscribed || 0,
      open_rate: data.open_rate || 0,
      click_rate: data.click_rate || 0,
      reply_rate: data.reply_rate || 0,
      bounce_rate: data.bounce_rate || 0,
      daily_stats: data.daily_stats || []
    };
  }

  /**
   * Format email accounts data
   */
  formatEmailAccounts(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(account => ({
      id: account.id,
      email: account.email,
      status: account.status,
      warmup_status: account.warmup_status,
      daily_limit: account.daily_limit,
      sent_today: account.sent_today || 0,
      reputation_score: account.reputation_score || 0
    }));
  }
}

module.exports = new SmartleadService();
