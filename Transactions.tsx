import { TrendingUp, TrendingDown, DollarSign, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyFraudData = [
  { month: 'Oct', amount: 145000, cases: 45, prevented: 42 },
  { month: 'Nov', amount: 168000, cases: 52, prevented: 48 },
  { month: 'Dec', amount: 132000, cases: 38, prevented: 35 },
  { month: 'Jan', amount: 195000, cases: 65, prevented: 61 },
  { month: 'Feb', amount: 178000, cases: 58, prevented: 54 },
  { month: 'Mar', amount: 215000, cases: 72, prevented: 68 },
];

const hourlyActivityData = [
  { hour: '00:00', transactions: 120, fraud: 5 },
  { hour: '04:00', transactions: 80, fraud: 3 },
  { hour: '08:00', transactions: 450, fraud: 8 },
  { hour: '12:00', transactions: 780, fraud: 12 },
  { hour: '16:00', transactions: 920, fraud: 15 },
  { hour: '20:00', transactions: 650, fraud: 10 },
];

const topFraudCategories = [
  { category: 'Card-Not-Present', amount: 450000, percentage: 32 },
  { category: 'Account Takeover', amount: 385000, percentage: 27 },
  { category: 'Identity Theft', amount: 320000, percentage: 23 },
  { category: 'Wire Fraud', amount: 180000, percentage: 13 },
  { category: 'Other', amount: 75000, percentage: 5 },
];

const riskScoreDistribution = [
  { range: '0-20', count: 15200 },
  { range: '21-40', count: 8400 },
  { range: '41-60', count: 3800 },
  { range: '61-80', count: 1200 },
  { range: '81-100', count: 340 },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive fraud analytics and reporting</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Fraud Amount
              </CardTitle>
              <DollarSign className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">$1.41M</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">-12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Fraud Cases
              </CardTitle>
              <Shield className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">330</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">+8% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Prevention Rate
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">94.2%</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">+2.1% improvement</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Affected Accounts
              </CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">287</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">-5% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Amount Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyFraudData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#ef4444"
                    fill="#fee2e2"
                    name="Fraud Amount ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detection vs Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyFraudData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar key="cases" dataKey="cases" fill="#ef4444" name="Detected Cases" />
                  <Bar key="prevented" dataKey="prevented" fill="#22c55e" name="Prevented Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Transaction & Fraud Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  key="transactions"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Transactions"
                />
                <Line
                  key="fraud"
                  type="monotone"
                  dataKey="fraud"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Fraud Cases"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Fraud Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Fraud Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFraudCategories.map((cat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                      <span className="text-sm text-gray-600">
                        ${(cat.amount / 1000).toFixed(0)}K ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskScoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
