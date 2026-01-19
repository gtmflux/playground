const metaAdsService = require('../services/metaAds.service');
const smartleadService = require('../services/smartlead.service');
const googleAdsService = require('../services/googleAds.service');
const hubspotService = require('../services/hubspot.service');
const cacheService = require('../services/cache.service');

class DashboardController {
  /**
   * Get aggregated overview from all sources
   */
  async getOverview(req, res, next) {
    try {
      const { force_refresh } = req.query;

      const fetchFunction = async () => {
        const results = await Promise.allSettled([
          metaAdsService.getAccountInsights().catch(err => ({ error: err.message })),
          smartleadService.getOverallStats().catch(err => ({ error: err.message })),
          googleAdsService.getAccountOverview().catch(err => ({ error: err.message })),
          hubspotService.getAnalyticsOverview().catch(err => ({ error: err.message }))
        ]);

        return {
          meta_ads: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason?.message },
          smartlead: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason?.message },
          google_ads: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason?.message },
          hubspot: results[3].status === 'fulfilled' ? results[3].value : { error: results[3].reason?.message },
          timestamp: new Date().toISOString()
        };
      };

      let result;
      if (force_refresh === 'true') {
        await cacheService.clearSource('overview');
        result = { data: await fetchFunction(), from_cache: false };
      } else {
        result = await cacheService.getOrFetch('overview', 'all', fetchFunction);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Meta Ads data
   */
  async getMetaAds(req, res, next) {
    try {
      const { type = 'overview', force_refresh } = req.query;

      const fetchFunction = async () => {
        switch (type) {
          case 'campaigns':
            return await metaAdsService.getCampaignPerformance();
          case 'adsets':
            return await metaAdsService.getAdSetPerformance();
          case 'overview':
          default:
            return await metaAdsService.getAccountInsights();
        }
      };

      let result;
      if (force_refresh === 'true') {
        await cacheService.clearSource('meta_ads');
        result = { data: await fetchFunction(), from_cache: false };
      } else {
        result = await cacheService.getOrFetch('meta_ads', type, fetchFunction);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Smartlead data
   */
  async getSmartlead(req, res, next) {
    try {
      const { type = 'overview', force_refresh } = req.query;

      const fetchFunction = async () => {
        switch (type) {
          case 'campaigns':
            return await smartleadService.getCampaigns();
          case 'accounts':
            return await smartleadService.getEmailAccounts();
          case 'overview':
          default:
            return await smartleadService.getOverallStats();
        }
      };

      let result;
      if (force_refresh === 'true') {
        await cacheService.clearSource('smartlead');
        result = { data: await fetchFunction(), from_cache: false };
      } else {
        result = await cacheService.getOrFetch('smartlead', type, fetchFunction);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Google Ads data
   */
  async getGoogleAds(req, res, next) {
    try {
      const { type = 'overview', force_refresh } = req.query;

      const fetchFunction = async () => {
        switch (type) {
          case 'campaigns':
            return await googleAdsService.getCampaignPerformance();
          case 'adgroups':
            return await googleAdsService.getAdGroupPerformance();
          case 'overview':
          default:
            return await googleAdsService.getAccountOverview();
        }
      };

      let result;
      if (force_refresh === 'true') {
        await cacheService.clearSource('google_ads');
        result = { data: await fetchFunction(), from_cache: false };
      } else {
        result = await cacheService.getOrFetch('google_ads', type, fetchFunction);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get HubSpot data
   */
  async getHubSpot(req, res, next) {
    try {
      const { type = 'overview', force_refresh } = req.query;

      const fetchFunction = async () => {
        switch (type) {
          case 'deals':
            return await hubspotService.getDealsOverview();
          case 'contacts':
            return await hubspotService.getContactsOverview();
          case 'companies':
            return await hubspotService.getCompaniesOverview();
          case 'overview':
          default:
            return await hubspotService.getAnalyticsOverview();
        }
      };

      let result;
      if (force_refresh === 'true') {
        await cacheService.clearSource('hubspot');
        result = { data: await fetchFunction(), from_cache: false };
      } else {
        result = await cacheService.getOrFetch('hubspot', type, fetchFunction);
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear cache for a specific source or all
   */
  async clearCache(req, res, next) {
    try {
      const { source } = req.params;

      if (source && source !== 'all') {
        const deleted = await cacheService.clearSource(source);
        res.json({ message: `Cleared ${deleted} cache entries for ${source}` });
      } else {
        const deleted = await cacheService.clearExpired();
        res.json({ message: `Cleared ${deleted} expired cache entries` });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get cache status
   */
  async getCacheStatus(req, res, next) {
    try {
      const MetricCache = require('../models/MetricCache');
      const { Op } = require('sequelize');

      const [total, expired, active] = await Promise.all([
        MetricCache.count(),
        MetricCache.count({
          where: {
            expires_at: { [Op.lt]: new Date() }
          }
        }),
        MetricCache.count({
          where: {
            expires_at: { [Op.gt]: new Date() }
          }
        })
      ]);

      const bySource = await MetricCache.findAll({
        attributes: [
          'source',
          [MetricCache.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['source']
      });

      res.json({
        total,
        expired,
        active,
        by_source: bySource.reduce((acc, item) => {
          acc[item.source] = parseInt(item.get('count'));
          return acc;
        }, {})
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
