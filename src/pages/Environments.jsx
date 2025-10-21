import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Trash2, ExternalLink, GitBranch, Cpu, HardDrive, Zap, Clock, Copy } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/data-display/StatusBadge';

export default function Environments() {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);

  useEffect(() => {
    fetch('/mock-data/environments.json')
      .then(res => res.json())
      .then(data => {
        setEnvironments(data);
        if (data.length > 0) setSelectedEnv(data[0]);
      });
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Environments</h1>
            <p className="text-slate-600 mt-1">Manage deployment environments and configurations</p>
          </div>
          <Button variant="primary" icon={Plus}>
            Create Environment
          </Button>
        </div>
      </div>

      {/* Environment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {environments.map((env, index) => (
          <motion.div
            key={env.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEnv(env)}
            className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedEnv?.id === env.id
                ? 'border-rxt-red-primary shadow-lg'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 capitalize">{env.name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {env.branch ? `Branch: ${env.branch}` : 'Auto-deploy'}
                </p>
              </div>
              <StatusBadge status={env.status} />
            </div>

            {/* URL */}
            <div className="mb-4">
              <a
                href={env.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-sm text-rxt-red-primary hover:underline group"
              >
                <span className="truncate">{env.url}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Resource Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{env.cpu} vCPU</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{env.ram} RAM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{env.instances || 1} instance{env.instances > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{formatTime(env.lastDeployedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                View Logs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                Deploy
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Environment Detail Panel */}
      {selectedEnv && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize mb-1">{selectedEnv.name}</h2>
                <p className="text-slate-600">Environment configuration and settings</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" icon={Settings} size="sm">
                  Configure
                </Button>
                <Button variant="ghost" icon={Trash2} size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Build Configuration */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Build Configuration
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Git Branch</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-900">
                        {selectedEnv.branch || 'main'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedEnv.branch || 'main')}
                        className="p-1 text-slate-400 hover:text-rxt-red-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Auto Deploy</p>
                    <p className="text-sm text-slate-700">
                      {selectedEnv.autoDeploy !== false ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Build Command</p>
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-900 block">
                      npm run build
                    </code>
                  </div>
                </div>
              </div>

              {/* Resource Allocation */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Resource Allocation
                </h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">CPU</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedEnv.cpu} vCPU</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '35%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-600">Memory</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedEnv.ram}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '52%' }} />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-600">Instances</span>
                    <span className="text-sm font-semibold text-slate-900">{selectedEnv.instances || 1}</span>
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Environment Variables</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <code className="font-mono text-slate-700">NODE_ENV</code>
                    <code className="font-mono text-slate-900">{selectedEnv.name}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="font-mono text-slate-700">DATABASE_URL</code>
                    <code className="font-mono text-slate-400">••••••••••••</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <code className="font-mono text-slate-700">REDIS_URL</code>
                    <code className="font-mono text-slate-400">••••••••••••</code>
                  </div>
                  <button className="w-full mt-2 text-sm text-rxt-red-primary hover:underline font-medium text-left">
                    View all variables →
                  </button>
                </div>
              </div>

              {/* Deployment Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Latest Deployment</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Status</p>
                    <StatusBadge status={selectedEnv.status} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Deployed</p>
                    <p className="text-sm text-slate-700">{formatTime(selectedEnv.lastDeployedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">URL</p>
                    <a
                      href={selectedEnv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-rxt-red-primary hover:underline flex items-center gap-1 truncate"
                    >
                      {selectedEnv.url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-red-50 border-t border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              Destructive actions that cannot be undone. Use with caution.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm">
                Disable Auto Deploy
              </Button>
              <Button variant="ghost" size="sm">
                Reset Environment
              </Button>
              <Button variant="ghost" size="sm" icon={Trash2}>
                Delete Environment
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
