import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Download, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Usage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock usage data by environment
  const usageByEnv = [
    { name: 'Production', cpu: 850, ram: 1200, storage: 450, cost: 423 },
    { name: 'Staging', cpu: 320, ram: 480, storage: 180, cost: 198 },
    { name: 'Development', cpu: 180, ram: 280, storage: 90, cost: 126 }
  ];

  // Mock usage over time
  const usageOverTime = [
    { date: 'Oct 1', cost: 24 },
    { date: 'Oct 3', cost: 26 },
    { date: 'Oct 5', cost: 28 },
    { date: 'Oct 7', cost: 30 },
    { date: 'Oct 9', cost: 27 },
    { date: 'Oct 11', cost: 29 },
    { date: 'Oct 13', cost: 31 },
    { date: 'Oct 15', cost: 28 },
    { date: 'Oct 17', cost: 30 },
    { date: 'Oct 19', cost: 32 },
    { date: 'Oct 21', cost: 29 }
  ];

  // Cost breakdown pie chart
  const costBreakdown = [
    { name: 'Compute (CPU)', value: 520, color: '#e01f27' },
    { name: 'Memory (RAM)', value: 210, color: '#ff4449' },
    { name: 'Storage', value: 85, color: '#fca5a5' },
    { name: 'Network/Egress', value: 32, color: '#fecaca' }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0);
  const monthlyBudget = 1500;
  const budgetUsed = (totalCost / monthlyBudget) * 100;
  const projectedMonthly = Math.round((totalCost / 21) * 30); // Project based on 21 days

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Usage & Billing</h1>
            <p className="text-slate-600 mt-1">Monitor resource consumption and costs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Download} size="sm">
              Export CSV
            </Button>
            <Button variant="secondary" icon={Calendar} size="sm">
              Billing History
            </Button>
          </div>
        </div>
      </div>

      {/* Budget Alert */}
      {budgetUsed > 75 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Budget Warning</h3>
              <p className="text-sm text-yellow-700">
                You've used {budgetUsed.toFixed(1)}% of your monthly budget. Projected spend: ${projectedMonthly}/month
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Current Month</span>
            <DollarSign className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalCost}</p>
          <p className="text-sm text-slate-500 mt-1">of ${monthlyBudget} budget</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Projected</span>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900">${projectedMonthly}</p>
          <p className="text-sm text-green-600 mt-1">↓ 5% vs last month</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Budget Remaining</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${monthlyBudget - totalCost}</p>
          <p className="text-sm text-slate-500 mt-1">{(100 - budgetUsed).toFixed(1)}% available</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Avg Daily</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">${Math.round(totalCost / 21)}</p>
          <p className="text-sm text-slate-500 mt-1">last 21 days</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cost Trend */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Spend Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} label={{ value: 'USD', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#cbd5e1' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="cost" fill="#e01f27" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown Pie */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage by Environment */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resource Usage by Environment</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Environment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">CPU (vCPU-hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">RAM (GB-hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Storage (GB-hrs)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {usageByEnv.map((env, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{env.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{env.cpu.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-700">{env.ram.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-700">{env.storage.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">${env.cost}</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="px-6 py-4 text-slate-900">Total</td>
                <td className="px-6 py-4 text-slate-900">{usageByEnv.reduce((sum, e) => sum + e.cpu, 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-900">{usageByEnv.reduce((sum, e) => sum + e.ram, 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-900">{usageByEnv.reduce((sum, e) => sum + e.storage, 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-900">${usageByEnv.reduce((sum, e) => sum + e.cost, 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Management */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Budget Settings</h3>
          <Button variant="secondary" size="sm">
            Update Budget
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Monthly Budget: ${monthlyBudget}</span>
              <span className="text-sm text-slate-600">${totalCost} used ({budgetUsed.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="alert-75" className="w-4 h-4 text-rxt-red-primary" defaultChecked />
              <label htmlFor="alert-75" className="text-sm text-slate-700">Alert at 75% budget</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="alert-90" className="w-4 h-4 text-rxt-red-primary" defaultChecked />
              <label htmlFor="alert-90" className="text-sm text-slate-700">Alert at 90% budget</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="daily-report" className="w-4 h-4 text-rxt-red-primary" />
              <label htmlFor="daily-report" className="text-sm text-slate-700">Daily usage report</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="monthly-summary" className="w-4 h-4 text-rxt-red-primary" defaultChecked />
              <label htmlFor="monthly-summary" className="text-sm text-slate-700">Monthly summary email</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
