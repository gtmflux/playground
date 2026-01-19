# Marketing Reporting Dashboard

A comprehensive reporting dashboard that aggregates data from multiple marketing and CRM platforms including Facebook Meta Ads, Smartlead email engine, Google Ads, and HubSpot CRM.

## Features

- **Multi-Platform Integration**: Connects to Facebook Meta Ads, Smartlead, Google Ads, and HubSpot
- **Real-time Data**: Fetches and displays up-to-date metrics from all platforms
- **Data Caching**: PostgreSQL-based caching system with configurable TTL to reduce API calls
- **RESTful API**: Clean backend API for data aggregation and management
- **Modern UI**: React-based dashboard with Tailwind CSS and Radix UI components
- **Data Visualization**: Interactive charts using Recharts library
- **API Key Authentication**: Simple but effective API key-based security

## Architecture

```
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Sequelize database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # External API integrations
│   │   └── server.js       # Main server file
│   └── package.json
│
└── frontend/                # React application
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/  # Dashboard-specific components
    │   │   └── ui/         # Reusable UI components
    │   ├── services/       # API client
    │   └── App.js
    └── package.json
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **API Clients**: Axios
- **Scheduler**: node-cron (for cache cleanup)
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Routing**: React Router
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Yarn or npm
- API credentials for:
  - Facebook Meta Ads
  - Smartlead
  - Google Ads
  - HubSpot

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd playground
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your API credentials
# - Database connection details
# - API keys for Meta Ads, Smartlead, Google Ads, HubSpot
# - API authentication key
nano .env
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb reporting_dashboard

# Or using psql
psql -U postgres
CREATE DATABASE reporting_dashboard;
\q

# The database schema will be created automatically when you start the server
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Edit .env with your backend API URL and key
nano .env
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
# Application will open on http://localhost:3000
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reporting_dashboard
DB_USER=postgres
DB_PASSWORD=your_password

# API Authentication
API_KEY=your-secure-api-key

# Facebook Meta Ads
META_ADS_ACCESS_TOKEN=your_token
META_ADS_ACCOUNT_ID=act_your_account_id
META_ADS_API_VERSION=v18.0

# Smartlead
SMARTLEAD_API_KEY=your_api_key

# Google Ads
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id

# HubSpot
HUBSPOT_ACCESS_TOKEN=your_access_token

# Cache
CACHE_TTL_MINUTES=30
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_KEY=your-secure-api-key
```

## API Documentation

### Base URL
```
http://localhost:5000/api/dashboard
```

### Authentication
All requests require an API key in the header:
```
x-api-key: your-api-key
```

### Endpoints

#### GET /api/dashboard/overview
Get aggregated data from all sources
```bash
curl -H "x-api-key: your-api-key" \
  http://localhost:5000/api/dashboard/overview
```

#### GET /api/dashboard/meta-ads
Get Meta Ads data
```bash
# Overview
curl -H "x-api-key: your-api-key" \
  "http://localhost:5000/api/dashboard/meta-ads?type=overview"

# Campaigns
curl -H "x-api-key: your-api-key" \
  "http://localhost:5000/api/dashboard/meta-ads?type=campaigns"
```

#### GET /api/dashboard/smartlead
Get Smartlead email data
```bash
curl -H "x-api-key: your-api-key" \
  "http://localhost:5000/api/dashboard/smartlead?type=overview"
```

#### GET /api/dashboard/google-ads
Get Google Ads data
```bash
curl -H "x-api-key: your-api-key" \
  "http://localhost:5000/api/dashboard/google-ads?type=overview"
```

#### GET /api/dashboard/hubspot
Get HubSpot CRM data
```bash
curl -H "x-api-key: your-api-key" \
  "http://localhost:5000/api/dashboard/hubspot?type=overview"
```

#### DELETE /api/dashboard/cache/:source
Clear cache for a specific source
```bash
curl -X DELETE -H "x-api-key: your-api-key" \
  http://localhost:5000/api/dashboard/cache/meta_ads
```

#### GET /api/dashboard/cache/status
Get cache statistics
```bash
curl -H "x-api-key: your-api-key" \
  http://localhost:5000/api/dashboard/cache/status
```

## Getting API Credentials

### Facebook Meta Ads
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app and get access to Marketing API
3. Get your Access Token from the Graph API Explorer
4. Find your Ad Account ID in Ads Manager

### Smartlead
1. Log in to your Smartlead account
2. Go to Settings > API
3. Generate an API key

### Google Ads
1. Follow the [Google Ads API quickstart](https://developers.google.com/google-ads/api/docs/first-call/overview)
2. Set up OAuth2 credentials
3. Generate a developer token
4. Get your customer ID from Google Ads

### HubSpot
1. Go to HubSpot Settings
2. Navigate to Integrations > API Key or Private Apps
3. Create a private app with required scopes
4. Copy the access token

## Features Breakdown

### Data Sources

**Facebook Meta Ads**
- Campaign performance
- Ad set metrics
- Spend, impressions, clicks
- ROAS and conversions

**Smartlead**
- Email campaign metrics
- Open, click, and reply rates
- Email account health
- Deliverability stats

**Google Ads**
- Campaign performance
- Ad group metrics
- Cost, conversions, and ROAS
- Keyword performance

**HubSpot CRM**
- Deal pipeline overview
- Contact management
- Company tracking
- Conversion rates

### Caching System
- Automatic cache with configurable TTL
- Reduces API calls to external services
- PostgreSQL-based storage
- Scheduled cleanup of expired cache

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify database credentials in `.env`
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Ensure API_KEY matches between frontend and backend

### API returns authentication errors
- Check x-api-key header is being sent
- Verify API_KEY in backend/.env matches frontend

### No data showing in dashboard
- Verify API credentials are correct in backend/.env
- Check backend logs for API errors
- Try force refresh in the dashboard

## Development

### Running Tests
```bash
# Backend (when tests are added)
cd backend
npm test

# Frontend (when tests are added)
cd frontend
yarn test
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
yarn build
# Serve the build folder with a static server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub or contact the maintainer.
