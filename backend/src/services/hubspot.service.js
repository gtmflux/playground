const axios = require('axios');
require('dotenv').config();

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

class HubSpotService {
  constructor() {
    this.baseUrl = HUBSPOT_BASE_URL;
    this.accessToken = ACCESS_TOKEN;
  }

  /**
   * Make authenticated request to HubSpot API
   */
  async makeRequest(endpoint, method = 'GET', data = null) {
    try {
      if (!this.accessToken) {
        throw new Error('HubSpot access token not configured');
      }

      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('HubSpot API Error:', error.response?.data || error.message);
      throw new Error(`HubSpot API request failed: ${error.message}`);
    }
  }

  /**
   * Get deals pipeline summary
   */
  async getDealsOverview() {
    try {
      const deals = await this.makeRequest('/crm/v3/objects/deals?limit=100&properties=amount,dealstage,closedate,pipeline');

      return this.formatDealsOverview(deals);
    } catch (error) {
      console.error('HubSpot Deals Error:', error.message);
      throw new Error(`Failed to fetch HubSpot deals: ${error.message}`);
    }
  }

  /**
   * Get contacts summary
   */
  async getContactsOverview() {
    try {
      const contacts = await this.makeRequest('/crm/v3/objects/contacts?limit=100&properties=lifecyclestage,createdate');

      return this.formatContactsOverview(contacts);
    } catch (error) {
      console.error('HubSpot Contacts Error:', error.message);
      throw new Error(`Failed to fetch HubSpot contacts: ${error.message}`);
    }
  }

  /**
   * Get companies overview
   */
  async getCompaniesOverview() {
    try {
      const companies = await this.makeRequest('/crm/v3/objects/companies?limit=100&properties=name,domain,industry,createdate');

      return this.formatCompaniesOverview(companies);
    } catch (error) {
      console.error('HubSpot Companies Error:', error.message);
      throw new Error(`Failed to fetch HubSpot companies: ${error.message}`);
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities() {
    try {
      const activities = await this.makeRequest('/crm/v3/objects/calls?limit=50');

      return this.formatActivities(activities);
    } catch (error) {
      console.error('HubSpot Activities Error:', error.message);
      throw new Error(`Failed to fetch HubSpot activities: ${error.message}`);
    }
  }

  /**
   * Get analytics overview
   */
  async getAnalyticsOverview() {
    try {
      const [deals, contacts, companies] = await Promise.all([
        this.getDealsOverview(),
        this.getContactsOverview(),
        this.getCompaniesOverview()
      ]);

      return {
        deals,
        contacts,
        companies,
        summary: {
          total_deal_value: deals.total_value,
          total_contacts: contacts.total_contacts,
          total_companies: companies.total_companies,
          conversion_rate: contacts.total_contacts > 0
            ? ((deals.total_deals / contacts.total_contacts) * 100).toFixed(2)
            : 0
        }
      };
    } catch (error) {
      console.error('HubSpot Analytics Error:', error.message);
      throw new Error(`Failed to fetch HubSpot analytics: ${error.message}`);
    }
  }

  /**
   * Format deals overview
   */
  formatDealsOverview(data) {
    if (!data.results) {
      return {
        total_deals: 0,
        total_value: 0,
        by_stage: {},
        won_deals: 0,
        lost_deals: 0,
        open_deals: 0
      };
    }

    const overview = {
      total_deals: data.results.length,
      total_value: 0,
      by_stage: {},
      won_deals: 0,
      lost_deals: 0,
      open_deals: 0,
      deals: []
    };

    data.results.forEach(deal => {
      const amount = parseFloat(deal.properties.amount || 0);
      const stage = deal.properties.dealstage || 'unknown';

      overview.total_value += amount;

      if (!overview.by_stage[stage]) {
        overview.by_stage[stage] = { count: 0, value: 0 };
      }

      overview.by_stage[stage].count += 1;
      overview.by_stage[stage].value += amount;

      // Categorize deals (this is simplified - adjust based on your stage names)
      if (stage.includes('won') || stage.includes('closed')) {
        overview.won_deals += 1;
      } else if (stage.includes('lost')) {
        overview.lost_deals += 1;
      } else {
        overview.open_deals += 1;
      }

      overview.deals.push({
        id: deal.id,
        amount: amount,
        stage: stage,
        close_date: deal.properties.closedate,
        pipeline: deal.properties.pipeline
      });
    });

    return overview;
  }

  /**
   * Format contacts overview
   */
  formatContactsOverview(data) {
    if (!data.results) {
      return {
        total_contacts: 0,
        by_lifecycle_stage: {},
        recent_contacts: []
      };
    }

    const overview = {
      total_contacts: data.results.length,
      by_lifecycle_stage: {},
      recent_contacts: []
    };

    data.results.forEach(contact => {
      const stage = contact.properties.lifecyclestage || 'unknown';

      if (!overview.by_lifecycle_stage[stage]) {
        overview.by_lifecycle_stage[stage] = 0;
      }

      overview.by_lifecycle_stage[stage] += 1;

      overview.recent_contacts.push({
        id: contact.id,
        lifecycle_stage: stage,
        created_date: contact.properties.createdate
      });
    });

    return overview;
  }

  /**
   * Format companies overview
   */
  formatCompaniesOverview(data) {
    if (!data.results) {
      return {
        total_companies: 0,
        by_industry: {},
        companies: []
      };
    }

    const overview = {
      total_companies: data.results.length,
      by_industry: {},
      companies: []
    };

    data.results.forEach(company => {
      const industry = company.properties.industry || 'unknown';

      if (!overview.by_industry[industry]) {
        overview.by_industry[industry] = 0;
      }

      overview.by_industry[industry] += 1;

      overview.companies.push({
        id: company.id,
        name: company.properties.name,
        domain: company.properties.domain,
        industry: industry,
        created_date: company.properties.createdate
      });
    });

    return overview;
  }

  /**
   * Format activities
   */
  formatActivities(data) {
    if (!data.results) {
      return [];
    }

    return data.results.map(activity => ({
      id: activity.id,
      type: 'call',
      created_at: activity.createdAt,
      properties: activity.properties
    }));
  }
}

module.exports = new HubSpotService();
