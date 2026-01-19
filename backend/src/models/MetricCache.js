const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MetricCache = sequelize.define('MetricCache', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  source: {
    type: DataTypes.ENUM('meta_ads', 'smartlead', 'google_ads', 'hubspot'),
    allowNull: false,
    comment: 'API source of the metrics'
  },
  metric_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Type of metric (e.g., campaign_performance, email_stats)'
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Cached metric data in JSON format'
  },
  date_range_start: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Start date for the metrics data'
  },
  date_range_end: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'End date for the metrics data'
  },
  cached_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    comment: 'Timestamp when data was cached'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Timestamp when cache expires'
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Error message if fetch failed'
  }
}, {
  tableName: 'metric_cache',
  timestamps: true,
  indexes: [
    {
      fields: ['source', 'metric_type']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['cached_at']
    }
  ]
});

module.exports = MetricCache;
