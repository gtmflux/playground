import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, Mail, MousePointer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import dashboardApi from '../services/dashboardApi';
import MetricCard from './dashboard/MetricCard';
import ChartCard from './dashboard/ChartCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    meta_ads: null,
    smartlead: null,
    google_ads: null,
    hubspot: null
  });
  const [error, setError] = useState(null);

  const fetchData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await dashboardApi.getOverview(forceRefresh);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading && !data.meta_ads) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Marketing Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time insights from all your marketing channels
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Meta Ads Section */}
        {data.meta_ads && !data.meta_ads.error && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-blue-600 rounded"></div>
              Facebook Meta Ads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <MetricCard
                title="Total Spend"
                value={`$${data.meta_ads.spend?.toLocaleString() || 0}`}
                icon={<DollarSign className="w-6 h-6 text-blue-600" />}
                trend={data.meta_ads.spend > 0 ? 'up' : 'neutral'}
              />
              <MetricCard
                title="Impressions"
                value={data.meta_ads.impressions?.toLocaleString() || 0}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              />
              <MetricCard
                title="Clicks"
                value={data.meta_ads.clicks?.toLocaleString() || 0}
                icon={<MousePointer className="w-6 h-6 text-purple-600" />}
                subtitle={`CTR: ${data.meta_ads.ctr || 0}%`}
              />
              <MetricCard
                title="ROAS"
                value={data.meta_ads.roas || '0.00'}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                subtitle={`Revenue: $${data.meta_ads.revenue?.toLocaleString() || 0}`}
              />
            </div>
          </section>
        )}

        {/* Smartlead Section */}
        {data.smartlead && !data.smartlead.error && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-purple-600 rounded"></div>
              Email Campaigns (Smartlead)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <MetricCard
                title="Total Sent"
                value={data.smartlead.total_sent?.toLocaleString() || 0}
                icon={<Mail className="w-6 h-6 text-purple-600" />}
              />
              <MetricCard
                title="Open Rate"
                value={`${data.smartlead.open_rate || 0}%`}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                subtitle={`${data.smartlead.total_opened?.toLocaleString() || 0} opens`}
              />
              <MetricCard
                title="Click Rate"
                value={`${data.smartlead.click_rate || 0}%`}
                icon={<MousePointer className="w-6 h-6 text-blue-600" />}
                subtitle={`${data.smartlead.total_clicked?.toLocaleString() || 0} clicks`}
              />
              <MetricCard
                title="Reply Rate"
                value={`${data.smartlead.reply_rate || 0}%`}
                icon={<Mail className="w-6 h-6 text-green-600" />}
                subtitle={`${data.smartlead.total_replied?.toLocaleString() || 0} replies`}
              />
            </div>
          </section>
        )}

        {/* Google Ads Section */}
        {data.google_ads && !data.google_ads.error && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-red-600 rounded"></div>
              Google Ads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <MetricCard
                title="Total Cost"
                value={`$${data.google_ads.cost?.toLocaleString() || 0}`}
                icon={<DollarSign className="w-6 h-6 text-red-600" />}
              />
              <MetricCard
                title="Impressions"
                value={data.google_ads.impressions?.toLocaleString() || 0}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              />
              <MetricCard
                title="Conversions"
                value={data.google_ads.conversions?.toLocaleString() || 0}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                subtitle={`Value: $${data.google_ads.conversion_value?.toLocaleString() || 0}`}
              />
              <MetricCard
                title="ROAS"
                value={data.google_ads.roas || '0.00'}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                subtitle={`CPC: $${data.google_ads.avg_cpc?.toFixed(2) || 0}`}
              />
            </div>
          </section>
        )}

        {/* HubSpot Section */}
        {data.hubspot && !data.hubspot.error && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-orange-600 rounded"></div>
              CRM (HubSpot)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <MetricCard
                title="Total Deals"
                value={data.hubspot.deals?.total_deals?.toLocaleString() || 0}
                icon={<DollarSign className="w-6 h-6 text-orange-600" />}
                subtitle={`Value: $${data.hubspot.deals?.total_value?.toLocaleString() || 0}`}
              />
              <MetricCard
                title="Open Deals"
                value={data.hubspot.deals?.open_deals?.toLocaleString() || 0}
                icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="Total Contacts"
                value={data.hubspot.contacts?.total_contacts?.toLocaleString() || 0}
                icon={<Users className="w-6 h-6 text-purple-600" />}
              />
              <MetricCard
                title="Conversion Rate"
                value={`${data.hubspot.summary?.conversion_rate || 0}%`}
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                subtitle={`Companies: ${data.hubspot.companies?.total_companies?.toLocaleString() || 0}`}
              />
            </div>
          </section>
        )}

        {/* Error States */}
        {Object.entries(data).map(([source, sourceData]) => (
          sourceData?.error && (
            <Card key={source} className="bg-yellow-50 border-yellow-200 mb-4">
              <CardHeader>
                <CardTitle className="text-yellow-800">
                  {source.replace('_', ' ').toUpperCase()} - Configuration Needed
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  {sourceData.error}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
