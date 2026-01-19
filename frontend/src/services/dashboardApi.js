const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_KEY = process.env.REACT_APP_API_KEY || 'dev-api-key-change-in-production';

class DashboardApiClient {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/dashboard`;
    this.apiKey = API_KEY;
  }

  /**
   * Make authenticated request to backend API
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          ...options.headers
        }
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  /**
   * Get aggregated overview from all sources
   */
  async getOverview(forceRefresh = false) {
    const query = forceRefresh ? '?force_refresh=true' : '';
    return await this.makeRequest(`/overview${query}`);
  }

  /**
   * Get Meta Ads data
   * @param {string} type - overview|campaigns|adsets
   * @param {boolean} forceRefresh
   */
  async getMetaAds(type = 'overview', forceRefresh = false) {
    const params = new URLSearchParams({ type });
    if (forceRefresh) params.append('force_refresh', 'true');
    return await this.makeRequest(`/meta-ads?${params}`);
  }

  /**
   * Get Smartlead data
   * @param {string} type - overview|campaigns|accounts
   * @param {boolean} forceRefresh
   */
  async getSmartlead(type = 'overview', forceRefresh = false) {
    const params = new URLSearchParams({ type });
    if (forceRefresh) params.append('force_refresh', 'true');
    return await this.makeRequest(`/smartlead?${params}`);
  }

  /**
   * Get Google Ads data
   * @param {string} type - overview|campaigns|adgroups
   * @param {boolean} forceRefresh
   */
  async getGoogleAds(type = 'overview', forceRefresh = false) {
    const params = new URLSearchParams({ type });
    if (forceRefresh) params.append('force_refresh', 'true');
    return await this.makeRequest(`/google-ads?${params}`);
  }

  /**
   * Get HubSpot data
   * @param {string} type - overview|deals|contacts|companies
   * @param {boolean} forceRefresh
   */
  async getHubSpot(type = 'overview', forceRefresh = false) {
    const params = new URLSearchParams({ type });
    if (forceRefresh) params.append('force_refresh', 'true');
    return await this.makeRequest(`/hubspot?${params}`);
  }

  /**
   * Clear cache for a specific source
   * @param {string} source - meta_ads|smartlead|google_ads|hubspot|all
   */
  async clearCache(source = 'all') {
    return await this.makeRequest(`/cache/${source}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get cache status
   */
  async getCacheStatus() {
    return await this.makeRequest('/cache/status');
  }
}

export default new DashboardApiClient();
