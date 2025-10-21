import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('/mock-data/domains.json')
      .then(res => res.json())
      .then(data => {
        setDomains(data);
        if (data.length > 0) setSelectedDomain(data[0]);
      });
  }, []);

  const getTLSStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getDNSStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
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
            <h1 className="text-3xl font-bold text-slate-900">Domains</h1>
            <p className="text-slate-600 mt-1">Manage custom domains and TLS certificates</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Domain
          </Button>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Domain</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Environment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">TLS Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">DNS Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {domains.map((domain, index) => (
              <motion.tr
                key={domain.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDomain(domain)}
                className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                  selectedDomain?.id === domain.id ? 'bg-rxt-red-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{domain.domain}</span>
                    <a
                      href={`https://${domain.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-rxt-red-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                    {domain.envName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getTLSStatusIcon(domain.tlsStatus)}
                    <span className="text-sm text-slate-700 capitalize">
                      {domain.tlsType === 'auto' ? 'Auto (Let\'s Encrypt)' : domain.tlsType}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getDNSStatusIcon(domain.dnsStatus)}
                    <span className="text-sm text-slate-700 capitalize">{domain.dnsStatus}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {domain.tlsExpiry ? new Date(domain.tlsExpiry).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    Configure
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Domain Detail Panel */}
      {selectedDomain && (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">DNS Configuration</h2>
            <div className="flex gap-2">
              <Button variant="secondary" icon={RefreshCw} size="sm">
                Re-check DNS
              </Button>
              {selectedDomain.tlsStatus === 'active' && (
                <Button variant="secondary" size="sm">
                  Force Renew TLS
                </Button>
              )}
            </div>
          </div>

          {selectedDomain.dnsStatus === 'pending' && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">DNS Configuration Required</h3>
                  <p className="text-sm text-yellow-700">
                    Add these DNS records to your domain provider to activate this domain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DNS Records */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Required DNS Records</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                {/* A Record */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono font-semibold text-slate-700 w-16">A</span>
                      <span className="font-mono text-slate-900">{selectedDomain.domain}</span>
                      <span className="text-slate-400">→</span>
                      <code className="bg-slate-100 px-2 py-1 rounded font-mono text-slate-900">
                        192.0.2.10
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('192.0.2.10')}
                    className="p-2 text-slate-400 hover:text-rxt-red-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* CAA Record */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono font-semibold text-slate-700 w-16">CAA</span>
                      <span className="font-mono text-slate-900">{selectedDomain.domain.split('.').slice(-2).join('.')}</span>
                      <span className="text-slate-400">→</span>
                      <code className="bg-slate-100 px-2 py-1 rounded font-mono text-slate-900">
                        0 issue "letsencrypt.org"
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('0 issue "letsencrypt.org"')}
                    className="p-2 text-slate-400 hover:text-rxt-red-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* TLS Certificate Info */}
            {selectedDomain.tlsStatus === 'active' && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">TLS Certificate</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 mb-2">Certificate Active</p>
                      <div className="space-y-1 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Issued by:</span>
                          <span className="font-mono">Let's Encrypt</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span className="font-mono">{new Date(selectedDomain.tlsExpiry).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-renewal:</span>
                          <span className="font-semibold">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Copy the DNS records above</li>
                <li>Add them to your DNS provider (Cloudflare, Route53, etc.)</li>
                <li>Wait for DNS propagation (typically 5-15 minutes)</li>
                <li>Click "Re-check DNS" to verify configuration</li>
                <li>TLS certificate will be automatically provisioned once DNS is active</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
