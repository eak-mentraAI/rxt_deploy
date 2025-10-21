import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { TrendingUp, Activity, AlertCircle, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Metrics() {
  const [metricsData, setMetricsData] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetch('/mock-data/metrics.json')
      .then(res => res.json())
      .then(data => setMetricsData(data));
  }, []);

  if (!metricsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-rxt-red-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{formatTimestamp(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white font-semibold">
              {entry.name}: {entry.value}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate current values and averages
  const latencyData = metricsData.latency_p95.data;
  const errorData = metricsData.error_rate.data;
  const throughputData = metricsData.throughput.data;

  const currentLatency = latencyData[latencyData.length - 1].value;
  const avgLatency = Math.round(latencyData.reduce((sum, d) => sum + d.value, 0) / latencyData.length);

  const currentErrorRate = errorData[errorData.length - 1].value;
  const avgErrorRate = (errorData.reduce((sum, d) => sum + d.value, 0) / errorData.length).toFixed(2);

  const currentThroughput = throughputData[throughputData.length - 1].value;
  const avgThroughput = Math.round(throughputData.reduce((sum, d) => sum + d.value, 0) / throughputData.length);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Metrics</h1>
            <p className="text-slate-600 mt-1">Performance and resource utilization metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={AlertCircle} size="sm">
              Set SLO
            </Button>
            <Button variant="secondary" icon={Zap} size="sm">
              Create Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-slate-700">Time Range:</span>
        {['15m', '1h', '6h', '24h', '7d', '30d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-rxt-red-primary text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Latency (p95)</span>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{currentLatency}ms</span>
            <span className="text-sm text-slate-500">avg {avgLatency}ms</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600">↓ 12% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Error Rate</span>
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{currentErrorRate}%</span>
            <span className="text-sm text-slate-500">avg {avgErrorRate}%</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600">↓ 0.2% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Throughput</span>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{currentThroughput}</span>
            <span className="text-sm text-slate-500">req/s (avg {avgThroughput})</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-green-600">↑ 8% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Latency Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{metricsData.latency_p95.name}</h3>
              <p className="text-sm text-slate-600">
                SLO: {metricsData.latency_p95.slo}{metricsData.latency_p95.unit} • Current: {currentLatency}{metricsData.latency_p95.unit}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Full Screen
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsData.latency_p95.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="#64748b"
                style={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: 12 }}
                label={{ value: metricsData.latency_p95.unit, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={metricsData.latency_p95.slo}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'SLO', position: 'right', fill: '#ef4444' }}
              />
              {metricsData.deployments.map((deploy, index) => (
                <ReferenceLine
                  key={index}
                  x={deploy.timestamp}
                  stroke="#6366f1"
                  strokeDasharray="3 3"
                  label={{ value: deploy.version, position: 'top', fill: '#6366f1', fontSize: 10 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#e01f27"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#e01f27' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Error Rate Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{metricsData.error_rate.name}</h3>
              <p className="text-sm text-slate-600">
                Budget: {metricsData.error_rate.budget}{metricsData.error_rate.unit} • Remaining: {(metricsData.error_rate.budget - currentErrorRate).toFixed(1)}{metricsData.error_rate.unit}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Full Screen
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsData.error_rate.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="#64748b"
                style={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: 12 }}
                label={{ value: metricsData.error_rate.unit, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={metricsData.error_rate.budget}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{ value: 'Error Budget', position: 'right', fill: '#ef4444' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Throughput Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{metricsData.throughput.name}</h3>
              <p className="text-sm text-slate-600">Request volume over time</p>
            </div>
            <Button variant="ghost" size="sm">
              Full Screen
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsData.throughput.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="#64748b"
                style={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: 12 }}
                label={{ value: metricsData.throughput.unit, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
