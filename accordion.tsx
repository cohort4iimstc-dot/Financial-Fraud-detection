import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Download, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

// =============================================
// Types matching your PostgreSQL schema
// =============================================
interface Transaction {
  transaction_id: number;
  created_at: string;
  amount: number;
  actual_class: number;
  split_set: string;
  predicted_class?: number;
  fraud_probability?: number;
}

interface PredictionResult {
  result: string;
  probability: number;
}

const API_BASE = 'http://localhost:8000';

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [predictionResults, setPredictionResults] = useState<Record<number, PredictionResult>>({});

  // =============================================
  // Fetch transactions from FastAPI → PostgreSQL
  // =============================================
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/transactions`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(`Could not connect to backend: ${err.message}. Make sure FastAPI is running on ${API_BASE}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // =============================================
  // Verify button → navigate to InvestigatePage
  // =============================================
  const handleVerify = (txnId: number) => {
    navigate(`/investigate/${txnId}`);
  };

  // =============================================
  // Filter logic
  // =============================================
  const filtered = transactions.filter(txn => {
    const matchesSearch =
      String(txn.transaction_id).includes(searchQuery) ||
      String(txn.amount).includes(searchQuery);
    const matchesClass =
      filterClass === 'all' ||
      (filterClass === 'fraud' && txn.actual_class === 1) ||
      (filterClass === 'legit' && txn.actual_class === 0);
    return matchesSearch && matchesClass;
  });

  const getRiskBadge = (actualClass: number, predicted?: number) => {
    const isFraud = predicted !== undefined ? predicted === 1 : actualClass === 1;
    return isFraud
      ? <Badge className="bg-red-100 text-red-800 border border-red-200">FRAUD</Badge>
      : <Badge className="bg-green-100 text-green-800 border border-green-200">LEGIT</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Monitoring</h1>
            <p className="text-gray-600 mt-1">Real-time transaction analysis and fraud detection</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchTransactions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <strong>⚠️ Connection Error:</strong> {error}
            <div className="mt-2 text-sm">
              Make sure your FastAPI server is running: <code className="bg-red-100 px-1 rounded">uvicorn main:app --reload</code>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by transaction ID or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="fraud">Fraud Only</SelectItem>
                  <SelectItem value="legit">Legitimate Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {loading ? 'Loading transactions...' : `Transactions (${filtered.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actual Class</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ML Prediction</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fraud Probability</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((txn) => {
                      const result = predictionResults[txn.transaction_id];
                      return (
                        <tr key={txn.transaction_id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-sm text-blue-700">#{txn.transaction_id}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(txn.created_at).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            ${Number(txn.amount).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {txn.actual_class === 1
                              ? <div className="flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> Fraud</div>
                              : <div className="flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /> Legitimate</div>
                            }
                          </td>
                          <td className="py-3 px-4">
                            {result ? (
                              getRiskBadge(txn.actual_class, result.result.includes('Fraud') ? 1 : 0)
                            ) : txn.predicted_class !== undefined ? (
                              getRiskBadge(txn.actual_class, txn.predicted_class)
                            ) : (
                              <span className="text-gray-400 text-sm italic">Not verified</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {result ? (
                              <span className={result.probability > 0.5 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                                {(result.probability * 100).toFixed(1)}%
                              </span>
                            ) : txn.fraud_probability !== undefined ? (
                              <span>{(txn.fraud_probability * 100).toFixed(1)}%</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(txn.transaction_id)}
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              Verify
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
