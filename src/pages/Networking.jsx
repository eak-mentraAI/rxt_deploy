import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Zap, Database, Shield, ExternalLink, Plus, Settings, Network } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/data-display/StatusBadge';

export default function Networking() {
  const [selectedNode, setSelectedNode] = useState(null);

  // Network topology data
  const nodes = [
    {
      id: 'lb',
      type: 'loadbalancer',
      name: 'Load Balancer',
      status: 'healthy',
      icon: Network,
      position: { x: 50, y: 10 },
      metadata: {
        provider: 'Rackspace LB',
        algorithm: 'Round Robin',
        activeConnections: 847,
        throughput: '2.4 GB/s'
      }
    },
    {
      id: 'prod',
      type: 'environment',
      name: 'Production',
      status: 'healthy',
      icon: Zap,
      position: { x: 20, y: 40 },
      metadata: {
        instances: 3,
        cpu: '8 vCPU',
        ram: '16 GB',
        uptime: '99.98%'
      }
    },
    {
      id: 'staging',
      type: 'environment',
      name: 'Staging',
      status: 'healthy',
      icon: Zap,
      position: { x: 50, y: 40 },
      metadata: {
        instances: 2,
        cpu: '4 vCPU',
        ram: '8 GB',
        uptime: '99.92%'
      }
    },
    {
      id: 'dev',
      type: 'environment',
      name: 'Development',
      status: 'healthy',
      icon: Zap,
      position: { x: 80, y: 40 },
      metadata: {
        instances: 1,
        cpu: '2 vCPU',
        ram: '4 GB',
        uptime: '99.85%'
      }
    },
    {
      id: 'db',
      type: 'database',
      name: 'PostgreSQL',
      status: 'healthy',
      icon: Database,
      position: { x: 20, y: 70 },
      metadata: {
        version: '15.4',
        storage: '50 GB',
        connections: 42,
        replication: 'Primary + 2 Read Replicas'
      }
    },
    {
      id: 'redis',
      type: 'cache',
      name: 'Redis Cache',
      status: 'healthy',
      icon: Zap,
      position: { x: 50, y: 70 },
      metadata: {
        version: '7.2',
        memory: '4 GB',
        hitRate: '98.3%',
        evictionPolicy: 'allkeys-lru'
      }
    },
    {
      id: 'cdn',
      type: 'cdn',
      name: 'CDN',
      status: 'healthy',
      icon: Globe,
      position: { x: 80, y: 70 },
      metadata: {
        provider: 'Rackspace CDN',
        pops: 150,
        cacheHitRate: '94.2%',
        bandwidth: '12 TB/month'
      }
    }
  ];

  const connections = [
    { from: 'lb', to: 'prod', type: 'https', traffic: 'high' },
    { from: 'lb', to: 'staging', type: 'https', traffic: 'medium' },
    { from: 'lb', to: 'dev', type: 'https', traffic: 'low' },
    { from: 'prod', to: 'db', type: 'tcp', traffic: 'high' },
    { from: 'staging', to: 'db', type: 'tcp', traffic: 'medium' },
    { from: 'dev', to: 'db', type: 'tcp', traffic: 'low' },
    { from: 'prod', to: 'redis', type: 'tcp', traffic: 'high' },
    { from: 'staging', to: 'redis', type: 'tcp', traffic: 'medium' },
    { from: 'lb', to: 'cdn', type: 'https', traffic: 'high' }
  ];

  // Firewall rules
  const firewallRules = [
    { id: 1, name: 'Allow HTTPS', direction: 'inbound', protocol: 'TCP', port: '443', source: '0.0.0.0/0', status: 'active' },
    { id: 2, name: 'Allow HTTP', direction: 'inbound', protocol: 'TCP', port: '80', source: '0.0.0.0/0', status: 'active' },
    { id: 3, name: 'Allow PostgreSQL', direction: 'inbound', protocol: 'TCP', port: '5432', source: '10.0.0.0/16', status: 'active' },
    { id: 4, name: 'Allow Redis', direction: 'inbound', protocol: 'TCP', port: '6379', source: '10.0.0.0/16', status: 'active' },
    { id: 5, name: 'Deny All Other', direction: 'inbound', protocol: 'ALL', port: '*', source: '0.0.0.0/0', status: 'active' }
  ];

  const getNodeColor = (type) => {
    switch (type) {
      case 'loadbalancer': return 'bg-purple-100 border-purple-300';
      case 'environment': return 'bg-rxt-red-50 border-rxt-red-300';
      case 'database': return 'bg-blue-100 border-blue-300';
      case 'cache': return 'bg-orange-100 border-orange-300';
      case 'cdn': return 'bg-green-100 border-green-300';
      default: return 'bg-slate-100 border-slate-300';
    }
  };

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'high': return 'stroke-green-500';
      case 'medium': return 'stroke-yellow-500';
      case 'low': return 'stroke-slate-400';
      default: return 'stroke-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Networking</h1>
            <p className="text-slate-600 mt-1">Network topology, firewall rules, and connectivity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={Settings} size="sm">
              Network Settings
            </Button>
            <Button variant="primary" icon={Plus} size="sm">
              Add Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Network Topology Visualization */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-8 mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Network Topology</h2>

        {/* SVG Topology */}
        <div className="relative w-full h-96 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
          <svg className="w-full h-full">
            {/* Draw connections */}
            {connections.map((conn, index) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);

              if (!fromNode || !toNode) return null;

              const x1 = `${fromNode.position.x}%`;
              const y1 = `${fromNode.position.y}%`;
              const x2 = `${toNode.position.x}%`;
              const y2 = `${toNode.position.y}%`;

              return (
                <g key={index}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={`${getTrafficColor(conn.traffic)} transition-all`}
                    strokeWidth="2"
                    strokeDasharray={conn.type === 'https' ? '0' : '5,5'}
                  />
                  {/* Traffic indicator */}
                  {conn.traffic === 'high' && (
                    <circle
                      cx={`${(fromNode.position.x + toNode.position.x) / 2}%`}
                      cy={`${(fromNode.position.y + toNode.position.y) / 2}%`}
                      r="3"
                      className="fill-green-500"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.3;1;0.3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node overlays */}
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
                style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                onClick={() => setSelectedNode(node)}
              >
                <div
                  className={`${getNodeColor(node.type)} border-2 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
                    selectedNode?.id === node.id ? 'ring-4 ring-rxt-red-primary ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 min-w-24">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 text-center">{node.name}</p>
                    <StatusBadge status={node.status} size="sm" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500"></div>
            <span className="text-slate-600">High Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-500"></div>
            <span className="text-slate-600">Medium Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-slate-400"></div>
            <span className="text-slate-600">Low Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-slate-400" style={{ strokeDasharray: '5,5' }}></div>
            <span className="text-slate-600">TCP Connection</span>
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-rxt-red-primary rounded-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{selectedNode.name}</h3>
              <p className="text-sm text-slate-600 capitalize">{selectedNode.type}</p>
            </div>
            <StatusBadge status={selectedNode.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(selectedNode.metadata).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Firewall Rules */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Firewall Rules</h2>
            <Button variant="secondary" icon={Shield} size="sm">
              Security Settings
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Rule Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Direction</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Protocol</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Port</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {firewallRules.map((rule, index) => (
                <motion.tr
                  key={rule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{rule.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {rule.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-900">
                      {rule.protocol}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-slate-700">{rule.port}</code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-slate-700">{rule.source}</code>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rule.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
