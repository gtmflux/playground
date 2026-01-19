const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

// Apply authentication to all dashboard routes
router.use(authenticate);

/**
 * GET /api/dashboard/overview
 * Get aggregated data from all sources
 * Query params: force_refresh=true (optional)
 */
router.get('/overview', dashboardController.getOverview);

/**
 * GET /api/dashboard/meta-ads
 * Get Facebook Meta Ads data
 * Query params: type=overview|campaigns|adsets, force_refresh=true (optional)
 */
router.get('/meta-ads', dashboardController.getMetaAds);

/**
 * GET /api/dashboard/smartlead
 * Get Smartlead email data
 * Query params: type=overview|campaigns|accounts, force_refresh=true (optional)
 */
router.get('/smartlead', dashboardController.getSmartlead);

/**
 * GET /api/dashboard/google-ads
 * Get Google Ads data
 * Query params: type=overview|campaigns|adgroups, force_refresh=true (optional)
 */
router.get('/google-ads', dashboardController.getGoogleAds);

/**
 * GET /api/dashboard/hubspot
 * Get HubSpot CRM data
 * Query params: type=overview|deals|contacts|companies, force_refresh=true (optional)
 */
router.get('/hubspot', dashboardController.getHubSpot);

/**
 * DELETE /api/dashboard/cache/:source
 * Clear cache for a specific source (meta_ads, smartlead, google_ads, hubspot) or 'all'
 */
router.delete('/cache/:source', dashboardController.clearCache);

/**
 * GET /api/dashboard/cache/status
 * Get cache statistics
 */
router.get('/cache/status', dashboardController.getCacheStatus);

module.exports = router;
