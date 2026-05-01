import { useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  account: string;
  amount?: string;
  timestamp: string;
  category: string;
}

const alerts: Alert[] = [
  {
    id: 'ALT001',
    title: 'Multiple Failed Login Attempts',
    description: '15 failed login attempts detected from unusual IP address',
    severity: 'critical',
    status: 'active',
    account: '****4532',
    timestamp: '2026-04-07 14:32',
    category: 'Account Security'
  },
  {
    id: 'ALT002',
    title: 'Large Wire Transfer',
    description: 'Wire transfer of $45,000 to high-risk country',
    severity: 'critical',
    status: 'investigating',
    account: '****7829',
    amount: '$45,000',
    timestamp: '2026-04-07 14:15',
    category: 'Transaction'
  },
  {
    id: 'ALT003',
    title: 'Unusual Purchase Pattern',
    description: 'Multiple small transactions in different countries within 1 hour',
    severity: 'high',
    status: 'active',
    account: '****2198',
    amount: '$1,250',
    timestamp: '2026-04-07 13:58',
    category: 'Transaction'
  },
  {
    id: 'ALT004',
    title: 'Location Anomaly',
    description: 'Transaction from device in different continent from usual location',
    severity: 'high',
    status: 'investigating',
    account: '****5671',
    amount: '$2,340',
    timestamp: '2026-04-07 13:42',
    category: 'Behavioral'
  },
  {
    id: 'ALT005',
    title: 'Suspicious Merchant Category',
    description: 'Transaction at merchant flagged in fraud database',
    severity: 'medium',
    status: 'resolved',
    account: '****9023',
    amount: '$680',
    timestamp: '2026-04-07 12:25',
    category: 'Merchant'
  },
  {
    id: 'ALT006',
    title: 'Velocity Check Failed',
    description: 'Transaction exceeds daily spending limit by 300%',
    severity: 'high',
    status: 'dismissed',
    account: '****3456',
    amount: '$12,000',
    timestamp: '2026-04-07 11:10',
    category: 'Transaction'
  },
];

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.account.includes(searchQuery);
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="h-4 w-4" />;
      case 'investigating': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'dismissed': return <XCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50';
      case 'investigating': return 'text-blue-600 bg-blue-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'dismissed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
            <p className="text-gray-600 mt-1">Monitor and respond to fraud alerts</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Investigating</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {alerts.filter(a => a.status === 'investigating').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {alerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dismissed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {alerts.filter(a => a.status === 'dismissed').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getSeverityColor(alert.severity)} border`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{alert.category}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{alert.timestamp}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Account:</span> {alert.account}
                      </span>
                      {alert.amount && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            <span className="font-medium">Amount:</span> {alert.amount}
                          </span>
                        </>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        <span className="font-medium">ID:</span> {alert.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 ml-6">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                      {getStatusIcon(alert.status)}
                      <span className="text-sm font-medium capitalize">{alert.status}</span>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <>
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Investigate
                          </Button>
                        </>
                      )}
                      {alert.status === 'investigating' && (
                        <>
                          <Button variant="outline" size="sm">
                            Escalate
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Resolve
                          </Button>
                        </>
                      )}
                      {(alert.status === 'resolved' || alert.status === 'dismissed') && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
