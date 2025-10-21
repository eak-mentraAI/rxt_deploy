import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Boxes, Zap, Server, Globe, Briefcase, Shield, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const templates = [
  {
    id: 'static-site',
    name: 'Static Site',
    description: 'HTML, CSS, JS static sites with CDN distribution',
    icon: Globe,
    stack: ['HTML', 'CSS', 'JavaScript'],
    useCase: 'Landing pages, documentation, portfolios',
    estimatedCost: '$5-15/month',
    buildTime: '~2 min',
    compliance: [],
    features: ['Auto TLS', 'CDN', 'Custom domains', 'Preview environments']
  },
  {
    id: 'node-api',
    name: 'Node.js API',
    description: 'Express or Fastify REST APIs with auto-scaling',
    icon: Code2,
    stack: ['Node.js 20', 'Express/Fastify', 'PostgreSQL'],
    useCase: 'REST APIs, microservices, webhooks',
    estimatedCost: '$20-50/month',
    buildTime: '~4 min',
    compliance: ['PCI'],
    features: ['Auto-scaling', 'Load balancing', 'Health checks', 'Database connection pooling']
  },
  {
    id: 'python-api',
    name: 'Python API',
    description: 'FastAPI or Flask APIs with async support',
    icon: Server,
    stack: ['Python 3.11', 'FastAPI/Flask', 'PostgreSQL'],
    useCase: 'ML APIs, data processing, REST services',
    estimatedCost: '$20-50/month',
    buildTime: '~5 min',
    compliance: ['PCI', 'HIPAA'],
    features: ['Async workers', 'Auto-scaling', 'Scheduled jobs', 'ML model serving']
  },
  {
    id: 'fullstack-ssr',
    name: 'Full-Stack SSR',
    description: 'Next.js or Remix with server-side rendering',
    icon: Boxes,
    stack: ['Next.js 14', 'React', 'PostgreSQL', 'Redis'],
    useCase: 'Web applications, dashboards, SaaS products',
    estimatedCost: '$40-100/month',
    buildTime: '~6 min',
    compliance: [],
    features: ['SSR/SSG', 'Edge functions', 'API routes', 'Image optimization']
  },
  {
    id: 'worker-job',
    name: 'Background Worker',
    description: 'Async job processing with queue management',
    icon: Zap,
    stack: ['Node.js/Python', 'Bull/Celery', 'Redis'],
    useCase: 'Data processing, email sending, report generation',
    estimatedCost: '$15-40/month',
    buildTime: '~3 min',
    compliance: ['PCI'],
    features: ['Queue management', 'Retry logic', 'Scheduled jobs', 'Dead letter queues']
  },
  {
    id: 'enterprise-app',
    name: 'Enterprise Application',
    description: 'Production-ready with compliance guardrails',
    icon: Briefcase,
    stack: ['Your choice', 'PostgreSQL HA', 'Redis Cluster', 'Monitoring'],
    useCase: 'Enterprise SaaS, financial services, healthcare',
    estimatedCost: '$200-500/month',
    buildTime: '~10 min',
    compliance: ['PCI', 'HIPAA', 'SOC 2'],
    features: ['HA database', 'Multi-region', 'Advanced security', 'Dedicated support']
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterCompliance, setFilterCompliance] = useState('all');

  const filteredTemplates = templates.filter(t =>
    filterCompliance === 'all' || t.compliance.includes(filterCompliance)
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="text-slate-600 mt-1">Pre-configured deployment templates for common use cases</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-slate-700">Filter by compliance:</span>
        {['all', 'PCI', 'HIPAA', 'SOC 2'].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterCompliance(filter)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterCompliance === filter
                ? 'bg-rxt-red-primary text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filter === 'all' ? 'All Templates' : filter}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedTemplate(template)}
              className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-rxt-red-primary shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Icon & Title */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-rxt-red-50 rounded-lg">
                  <Icon className="w-6 h-6 text-rxt-red-primary" />
                </div>
                {template.compliance.length > 0 && (
                  <div className="flex gap-1">
                    {template.compliance.map(comp => (
                      <span key={comp} className="flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        <Shield className="w-3 h-3" />
                        {comp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">{template.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{template.description}</p>

              {/* Stack */}
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 mb-2">TECH STACK</p>
                <div className="flex flex-wrap gap-1">
                  {template.stack.map((tech, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-slate-500">Est. Cost</p>
                  <p className="font-semibold text-slate-900">{template.estimatedCost}</p>
                </div>
                <div>
                  <p className="text-slate-500">Build Time</p>
                  <p className="font-semibold text-slate-900">{template.buildTime}</p>
                </div>
              </div>

              {/* CTA */}
              <Button
                variant={selectedTemplate?.id === template.id ? 'primary' : 'secondary'}
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTemplate(template);
                }}
              >
                {selectedTemplate?.id === template.id ? 'Selected' : 'Use Template'}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Template Detail Panel */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white border-2 border-rxt-red-primary rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedTemplate.name}</h2>
              <p className="text-slate-600">{selectedTemplate.description}</p>
            </div>
            <Button variant="primary" icon={Zap}>
              Create Project
            </Button>
          </div>

          {/* Use Case */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Ideal for:</h3>
            <p className="text-slate-700">{selectedTemplate.useCase}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Included Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedTemplate.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Deploy YAML Preview */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Generated deploy.yaml:</h3>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-300">
{`project: my-${selectedTemplate.id}
environments:
  - name: dev
    resources:
      cpu: ${selectedTemplate.id === 'enterprise-app' ? 8 : selectedTemplate.id.includes('fullstack') ? 4 : 2}
      ram: ${selectedTemplate.id === 'enterprise-app' ? '16Gi' : selectedTemplate.id.includes('fullstack') ? '8Gi' : '4Gi'}
      storage: ${selectedTemplate.id === 'enterprise-app' ? '100Gi' : '20Gi'}
    build:
      base: ${selectedTemplate.stack[0].toLowerCase().replace(' ', ':')}
      commands:
        - npm ci # or equivalent
        - npm run build
    run:
      command: npm start
      ports: [${selectedTemplate.id.includes('worker') ? '3001' : '3000'}]
    networking:
      expose:
        - host: dev.my-app.rxt.cloud
          tls: auto`}
              </pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
