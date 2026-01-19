const axios = require('axios');
require('dotenv').config();

const GOOGLE_ADS_API_VERSION = 'v15';
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

class GoogleAdsService {
  constructor() {
    this.baseUrl = GOOGLE_ADS_BASE_URL;
    this.clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    this.refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    this.developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    this.customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token using refresh token
   */
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      if (!this.clientId || !this.clientSecret || !this.refreshToken) {
        throw new Error('Google Ads OAuth credentials not configured');
      }

      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Google OAuth Error:', error.response?.data || error.message);
      throw new Error(`Failed to get Google Ads access token: ${error.message}`);
    }
  }

  /**
   * Make authenticated request to Google Ads API
   */
  async makeRequest(query) {
    try {
      const accessToken = await this.getAccessToken();

      if (!this.developerToken || !this.customerId) {
        throw new Error('Google Ads developer token or customer ID not configured');
      }

      const response = await axios.post(
        `${this.baseUrl}/customers/${this.customerId}/googleAds:searchStream`,
        { query },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': this.developerToken,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Google Ads API Error:', error.response?.data || error.message);
      throw new Error(`Google Ads API request failed: ${error.message}`);
    }
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignPerformance(dateRange = 'LAST_30_DAYS') {
    try {
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.ctr
        FROM campaign
        WHERE segments.date DURING ${dateRange}
        ORDER BY metrics.impressions DESC
      `;

      const result = await this.makeRequest(query);
      return this.formatCampaignData(result);
    } catch (error) {
      console.error('Google Ads Campaign Error:', error.message);
      throw new Error(`Failed to fetch Google Ads campaigns: ${error.message}`);
    }
  }

  /**
   * Get account overview metrics
   */
  async getAccountOverview(dateRange = 'LAST_30_DAYS') {
    try {
      const query = `
        SELECT
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.ctr,
          metrics.average_cpm
        FROM customer
        WHERE segments.date DURING ${dateRange}
      `;

      const result = await this.makeRequest(query);
      return this.formatAccountOverview(result);
    } catch (error) {
      console.error('Google Ads Account Error:', error.message);
      throw new Error(`Failed to fetch Google Ads account overview: ${error.message}`);
    }
  }

  /**
   * Get ad group performance
   */
  async getAdGroupPerformance(dateRange = 'LAST_30_DAYS') {
    try {
      const query = `
        SELECT
          ad_group.id,
          ad_group.name,
          ad_group.status,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr
        FROM ad_group
        WHERE segments.date DURING ${dateRange}
        ORDER BY metrics.clicks DESC
        LIMIT 100
      `;

      const result = await this.makeRequest(query);
      return this.formatAdGroupData(result);
    } catch (error) {
      console.error('Google Ads Ad Group Error:', error.message);
      throw new Error(`Failed to fetch Google Ads ad groups: ${error.message}`);
    }
  }

  /**
   * Format campaign data
   */
  formatCampaignData(data) {
    if (!data || !data.results) {
      return [];
    }

    return data.results.map(result => ({
      id: result.campaign.id,
      name: result.campaign.name,
      status: result.campaign.status,
      impressions: parseInt(result.metrics.impressions || 0),
      clicks: parseInt(result.metrics.clicks || 0),
      cost: parseFloat((result.metrics.cost_micros || 0) / 1000000),
      conversions: parseFloat(result.metrics.conversions || 0),
      conversion_value: parseFloat(result.metrics.conversions_value || 0),
      avg_cpc: parseFloat((result.metrics.average_cpc || 0) / 1000000),
      ctr: parseFloat(result.metrics.ctr || 0)
    }));
  }

  /**
   * Format account overview data
   */
  formatAccountOverview(data) {
    if (!data || !data.results || data.results.length === 0) {
      return {
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
        conversion_value: 0,
        avg_cpc: 0,
        ctr: 0,
        avg_cpm: 0,
        roas: 0
      };
    }

    const metrics = data.results[0].metrics;
    const cost = parseFloat((metrics.cost_micros || 0) / 1000000);
    const conversionValue = parseFloat(metrics.conversions_value || 0);

    return {
      impressions: parseInt(metrics.impressions || 0),
      clicks: parseInt(metrics.clicks || 0),
      cost: cost,
      conversions: parseFloat(metrics.conversions || 0),
      conversion_value: conversionValue,
      avg_cpc: parseFloat((metrics.average_cpc || 0) / 1000000),
      ctr: parseFloat(metrics.ctr || 0),
      avg_cpm: parseFloat((metrics.average_cpm || 0) / 1000000),
      roas: cost > 0 ? (conversionValue / cost).toFixed(2) : 0
    };
  }

  /**
   * Format ad group data
   */
  formatAdGroupData(data) {
    if (!data || !data.results) {
      return [];
    }

    return data.results.map(result => ({
      id: result.ad_group.id,
      name: result.ad_group.name,
      status: result.ad_group.status,
      campaign_name: result.campaign.name,
      impressions: parseInt(result.metrics.impressions || 0),
      clicks: parseInt(result.metrics.clicks || 0),
      cost: parseFloat((result.metrics.cost_micros || 0) / 1000000),
      conversions: parseFloat(result.metrics.conversions || 0),
      ctr: parseFloat(result.metrics.ctr || 0)
    }));
  }
}

module.exports = new GoogleAdsService();
