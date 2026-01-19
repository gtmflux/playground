const { sequelize } = require('../config/database');
const MetricCache = require('./MetricCache');

const models = {
  MetricCache
};

// Initialize associations if needed
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
