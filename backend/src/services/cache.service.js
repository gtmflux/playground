const MetricCache = require('../models/MetricCache');
const { Op } = require('sequelize');
require('dotenv').config();

const CACHE_TTL_MINUTES = parseInt(process.env.CACHE_TTL_MINUTES || '30');

class CacheService {
  /**
   * Get cached data if available and not expired
   */
  async get(source, metricType) {
    try {
      const cached = await MetricCache.findOne({
        where: {
          source,
          metric_type: metricType,
          expires_at: {
            [Op.gt]: new Date()
          }
        },
        order: [['cached_at', 'DESC']]
      });

      if (cached && !cached.error) {
        return cached.data;
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  }

  /**
   * Set cached data with expiration
   */
  async set(source, metricType, data, dateRangeStart = null, dateRangeEnd = null) {
    try {
      const expiresAt = new Date(Date.now() + CACHE_TTL_MINUTES * 60 * 1000);

      await MetricCache.create({
        source,
        metric_type: metricType,
        data,
        date_range_start: dateRangeStart,
        date_range_end: dateRangeEnd,
        cached_at: new Date(),
        expires_at: expiresAt,
        error: null
      });

      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  }

  /**
   * Set error in cache
   */
  async setError(source, metricType, errorMessage) {
    try {
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes for errors

      await MetricCache.create({
        source,
        metric_type: metricType,
        data: {},
        cached_at: new Date(),
        expires_at: expiresAt,
        error: errorMessage
      });

      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpired() {
    try {
      const deleted = await MetricCache.destroy({
        where: {
          expires_at: {
            [Op.lt]: new Date()
          }
        }
      });

      console.log(`Cleared ${deleted} expired cache entries`);
      return deleted;
    } catch (error) {
      console.error('Cache clear error:', error.message);
      return 0;
    }
  }

  /**
   * Clear all cache for a specific source
   */
  async clearSource(source) {
    try {
      const deleted = await MetricCache.destroy({
        where: { source }
      });

      console.log(`Cleared ${deleted} cache entries for source: ${source}`);
      return deleted;
    } catch (error) {
      console.error('Cache clear source error:', error.message);
      return 0;
    }
  }

  /**
   * Get or fetch data with caching
   */
  async getOrFetch(source, metricType, fetchFunction) {
    try {
      // Try to get from cache first
      const cached = await this.get(source, metricType);
      if (cached) {
        console.log(`Cache hit for ${source}:${metricType}`);
        return { data: cached, from_cache: true };
      }

      console.log(`Cache miss for ${source}:${metricType}, fetching fresh data...`);

      // Fetch fresh data
      const data = await fetchFunction();

      // Store in cache
      await this.set(source, metricType, data);

      return { data, from_cache: false };
    } catch (error) {
      console.error(`Error in getOrFetch for ${source}:${metricType}:`, error.message);

      // Store error in cache to avoid repeated failed requests
      await this.setError(source, metricType, error.message);

      throw error;
    }
  }
}

module.exports = new CacheService();
