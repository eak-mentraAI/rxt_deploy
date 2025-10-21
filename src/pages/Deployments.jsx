import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import StatusBadge from '../components/data-display/StatusBadge';

export default function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/mock-data/deployments.json')
      .then(res => res.json())
      .then(data => setDeployments(data));

    fetch('/mock-data/environments.json')
      .then(res => res.json())
      .then(data => setEnvironments(data));
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredDeployments = deployments.filter(d =>
    filter === 'all' || d.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Deployments</h1>
        <p className="text-slate-600 mt-1">View and manage all deployment history</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Filter:</span>
        </div>
        <div className="flex gap-2">
          {['all', 'deploying', 'healthy', 'error'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-rxt-red-primary text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Environment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Commit</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDeployments.map((deploy, index) => {
              const env = environments.find(e => e.id === deploy.envId);
              return (
                <motion.tr
                  key={deploy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/deployments/${deploy.id}`}
                      className="font-mono text-sm text-rxt-red-primary hover:underline"
                    >
                      #{deploy.id.split('_')[1]}
                    </Link>
                  </td>
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
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
