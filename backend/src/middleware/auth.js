require('dotenv').config();

const API_KEY = process.env.API_KEY || 'development-api-key';

/**
 * Middleware to validate API key authentication
 */
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      error: {
        message: 'API key is required. Provide it in x-api-key header or api_key query parameter.',
        status: 401
      }
    });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({
      error: {
        message: 'Invalid API key',
        status: 403
      }
    });
  }

  next();
};

/**
 * Optional authentication - doesn't block request if no key provided
 */
const optionalAuthenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (apiKey && apiKey !== API_KEY) {
    return res.status(403).json({
      error: {
        message: 'Invalid API key',
        status: 403
      }
    });
  }

  req.authenticated = !!apiKey && apiKey === API_KEY;
  next();
};

module.exports = { authenticate, optionalAuthenticate };
