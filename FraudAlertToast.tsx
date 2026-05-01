import React, { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const fraudTrendData = [
  { month: "Jan", detected: 45, prevented: 42 },
  { month: "Feb", detected: 52, prevented: 48 },
  { month: "Mar", detected: 38, prevented: 35 },
  { month: "Apr", detected: 65, prevented: 61 },
  { month: "May", detected: 58, prevented: 54 },
  { month: "Jun", detected: 72, prevented: 68 },
];

const fraudTypeData = [
  { name: "Card Fraud", value: 35, color: "#ef4444" },
  { name: "Identity Theft", value: 25, color: "#f97316" },
  { name: "Account Takeover", value: 20, color: "#eab308" },
  { name: "Wire Transfer", value: 15, color: "#06b6d4" },
  { name: "Other", value: 5, color: "#8b5cf6" },
];

export default function Dashboard() {

  // 🔥 STATES
  const [result, setResult] = useState("");
  const [prob, setProb] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/history");
      const data = await res.json();
      setHistory(data);
    } catch {
      console.log("Error loading history");
    }
  };

  // 🔥 LOAD HISTORY
  useEffect(() => {
    fetchHistory();
  }, []);

  // 🔥 API CALL (UPDATED)
  const predictFraud = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST"
      });

      const data = await res.json();

      setResult(data.result);
      setProb(data.probability);

      fetchHistory();

    } catch {
      setResult("❌ Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-gray-600">Real-time monitoring</p>
          </div>
        </div>

 

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent>Alerts: 24</CardContent></Card>
          <Card><CardContent>Prevented: $2.4M</CardContent></Card>
          <Card><CardContent>Rate: 94%</CardContent></Card>
          <Card><CardContent>Transactions: 1.2M</CardContent></Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-4">

          <Card>
            <CardHeader><CardTitle>Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fraudTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="detected" stroke="#ef4444" />
                  <Line dataKey="prevented" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Types</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={fraudTypeData} dataKey="value" outerRadius={100}>
                    {fraudTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* 🔥 HISTORY */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
          </CardHeader>
          <CardContent>

            {history.length === 0 ? (
              <p>No data</p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="border-b p-2">
                  <p><b>ID:</b> {item.transaction_id}</p>
                  <p className={item.predicted_class === 1 ? "text-red-600" : "text-green-600"}>
                    <b>Result:</b> {item.predicted_class === 1 ? "⚠️ Fraud" : "✅ Legitimate"}
                  </p>
                  <p><b>Probability:</b> {item.fraud_probability}</p>
                  <p className="text-sm text-gray-500">{item.created_at}</p>
                </div>
              ))
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}