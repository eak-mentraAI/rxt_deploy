import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, EyeOff, Copy, Trash2, Edit, Lock, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Secrets() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState({});
  const [selectedEnv, setSelectedEnv] = useState('all');

  // Mock secrets data
  const secrets = [
    {
      id: 1,
      key: 'DATABASE_URL',
      value: 'postgresql://user:pass@db.rxt.cloud:5432/prod_db',
      environments: ['production', 'staging'],
      type: 'connection_string',
      lastModified: '2025-10-15T14:30:00Z',
      modifiedBy: 'alice@company.com',
      status: 'active'
    },
    {
      id: 2,
      key: 'REDIS_URL',
      value: 'redis://default:secret123@redis.rxt.cloud:6379',
      environments: ['production', 'staging', 'development'],
      type: 'connection_string',
      lastModified: '2025-10-12T10:15:00Z',
      modifiedBy: 'bob@company.com',
      status: 'active'
    },
    {
      id: 3,
      key: 'API_SECRET_KEY',
      value: 'mock_api_key_example_not_real_12345',
      environments: ['production'],
      type: 'api_key',
      lastModified: '2025-10-20T08:45:00Z',
      modifiedBy: 'alice@company.com',
      status: 'active'
    },
    {
      id: 4,
      key: 'WEBHOOK_SECRET',
      value: 'mock_webhook_secret_example_67890',
      environments: ['production', 'staging'],
      type: 'webhook_secret',
      lastModified: '2025-10-18T16:20:00Z',
      modifiedBy: 'charlie@company.com',
      status: 'active'
    },
    {
      id: 5,
      key: 'JWT_SECRET',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      environments: ['production', 'staging', 'development'],
      type: 'encryption_key',
      lastModified: '2025-10-10T12:00:00Z',
      modifiedBy: 'alice@company.com',
      status: 'active'
    },
    {
      id: 6,
      key: 'OLD_API_KEY',
      value: 'deprecated_key_do_not_use',
      environments: ['staging'],
      type: 'api_key',
      lastModified: '2025-09-15T09:30:00Z',
      modifiedBy: 'bob@company.com',
      status: 'deprecated'
    }
  ];

  const filteredSecrets = selectedEnv === 'all'
    ? secrets
    : secrets.filter(s => s.environments.includes(selectedEnv));

  const toggleSecretVisibility = (id) => {
    setVisibleSecrets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const maskSecret = (value) => {
    if (value.length <= 8) return '••••••••';
    return value.substring(0, 4) + '••••••••' + value.substring(value.length - 4);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'api_key': return 'bg-purple-100 text-purple-700';
      case 'connection_string': return 'bg-blue-100 text-blue-700';
      case 'webhook_secret': return 'bg-orange-100 text-orange-700';
      case 'encryption_key': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Secrets</h1>
            <p className="text-slate-600 mt-1">Securely manage environment variables and API keys</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Secret
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Encrypted at Rest</h3>
            <p className="text-sm text-blue-700">
              All secrets are encrypted using AES-256 encryption and are only decrypted at runtime within your application containers.
              Access is logged and auditable.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Filter by environment:</span>
          {['all', 'production', 'staging', 'development'].map((env) => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                selectedEnv === env
                  ? 'bg-rxt-red-primary text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Secrets Table */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Environments</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Last Modified</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSecrets.map((secret, index) => (
              <motion.tr
                key={secret.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-slate-50 transition-colors ${
                  secret.status === 'deprecated' ? 'opacity-60' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <code className="font-mono text-sm font-medium text-slate-900">{secret.key}</code>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-slate-700 max-w-xs truncate">
                      {visibleSecrets[secret.id] ? secret.value : maskSecret(secret.value)}
                    </code>
                    <button
                      onClick={() => toggleSecretVisibility(secret.id)}
                      className="p-1 text-slate-400 hover:text-rxt-red-primary transition-colors"
                    >
                      {visibleSecrets[secret.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(secret.value)}
                      className="p-1 text-slate-400 hover:text-rxt-red-primary transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(secret.type)}`}>
                    {secret.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {secret.environments.map((env) => (
                      <span
                        key={env}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(secret.lastModified)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{secret.modifiedBy}</p>
                </td>
                <td className="px-6 py-4">
                  {secret.status === 'active' ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Deprecated</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-slate-400 hover:text-rxt-red-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best Practices Section */}
      <div className="mt-6 bg-white border-2 border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Rotate Regularly</h4>
              <p className="text-sm text-slate-600">
                Rotate secrets every 90 days or when team members with access leave
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Use Environment-Specific Keys</h4>
              <p className="text-sm text-slate-600">
                Never share production secrets across staging or development environments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Audit Access</h4>
              <p className="text-sm text-slate-600">
                Review secret access logs regularly to detect unauthorized access
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Minimal Permissions</h4>
              <p className="text-sm text-slate-600">
                Grant access only to team members who absolutely need it
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
