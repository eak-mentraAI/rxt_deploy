import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, GitBranch, Clock, Zap, Globe, Shield, DollarSign, TrendingUp, Activity, Plus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/data-display/StatusBadge';
import Button from '../components/ui/Button';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';

export default function ProjectOverview() {
  const [environments, setEnvironments] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [domains, setDomains] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Load mock data
    fetch('/mock-data/environments.json')
      .then(res => res.json())
      .then(data => setEnvironments(data));

    fetch('/mock-data/deployments.json')
      .then(res => res.json())
      .then(data => setDeployments(data.slice(0, 5))); // Last 5 deployments

    fetch('/mock-data/domains.json')
      .then(res => res.json())
      .then(data => setDomains(data));
  }, []);

  // Mock traffic/error data for sparklines
  const trafficData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    requests: Math.floor(Math.random() * 300) + 200
  }));

  const errorData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    errors: Math.random() * 1.5
  }));

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Project Overview</h1>
            <p className="text-slate-600 mt-1">Monitor deployments, environments, and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" icon={Plus} onClick={() => setShowOnboarding(true)}>
              Quick Start
            </Button>
            <Button variant="secondary" icon={GitBranch}>
              View Repository
            </Button>
            <Button variant="primary" icon={Zap}>
              New Deployment
            </Button>
          </div>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Environments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {environments.map((env, index) => (
            <motion.div
              key={env.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-rxt-red-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 capitalize">{env.name}</h3>
                  <p className="text-sm text-slate-500">{env.cpu} vCPU · {env.ram} RAM</p>
                </div>
                <StatusBadge status={env.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ExternalLink className="w-4 h-4" />
                  <a href={env.url} className="hover:text-rxt-red-primary truncate" target="_blank" rel="noopener noreferrer">
                    {env.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Deployed {formatTime(env.lastDeployedAt)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  View Logs
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Deploy
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Deployments</h2>
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Commit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deployments.map((deploy) => {
                const env = environments.find(e => e.id === deploy.envId);
                return (
                  <tr key={deploy.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 capitalize">{env?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">{deploy.commit}</code>
                        <p className="text-sm text-slate-600 mt-1">{deploy.commitMessage}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{deploy.author}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={deploy.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatTime(deploy.startedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Traffic & Error Rates */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Traffic</h3>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-slate-900">12.4K</p>
            <p className="text-sm text-slate-600">req/hour (last 24h)</p>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={trafficData}>
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-600">Error Rate:</span>
            <span className="font-semibold text-green-600">0.3%</span>
          </div>
        </div>

        {/* Domain & TLS Health */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Domains & TLS</h3>
            <Globe className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {domains.map((domain, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{domain.domain}</p>
                  <p className="text-xs text-slate-500 capitalize">{domain.envName}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {domain.tlsStatus === 'active' ? (
                    <Shield className="w-4 h-4 text-green-600" title="TLS Active" />
                  ) : (
                    <Shield className="w-4 h-4 text-slate-300" title="No TLS" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-rxt-red-primary hover:underline font-medium">
            View all domains →
          </button>
        </div>

        {/* Budget Status */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Budget</h3>
            <DollarSign className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-slate-900">$847</p>
            <p className="text-sm text-slate-600">of $1,500 monthly budget</p>
          </div>
          <div className="mb-3">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full" style={{ width: '56%' }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Remaining:</span>
            <span className="font-semibold text-green-600">$653 (44%)</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Projected: $1,420/month
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-rxt-red-primary transition-colors">
          <p className="text-sm font-medium text-slate-600">Total Deploys (24h)</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">47</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-rxt-red-primary transition-colors">
          <p className="text-sm font-medium text-slate-600">Success Rate</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">98.2%</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-rxt-red-primary transition-colors">
          <p className="text-sm font-medium text-slate-600">Avg Deploy Time</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">4m 32s</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-rxt-red-primary transition-colors">
          <p className="text-sm font-medium text-slate-600">Active Environments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
        </div>
      </div>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={(data) => {
          console.log('Onboarding complete:', data);
          // Handle onboarding completion
        }}
      />
    </div>
  );
}
