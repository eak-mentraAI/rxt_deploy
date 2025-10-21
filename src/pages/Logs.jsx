import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Download,
  Search,
  X,
  Filter,
  ExternalLink
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [isLiveTail, setIsLiveTail] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('15m');
  const logsEndRef = useRef(null);

  useEffect(() => {
    // Load initial logs
    fetch('/mock-data/logs.json')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isLiveTail && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isLiveTail]);

  // Simulate live tail
  useEffect(() => {
    if (!isLiveTail) return;

    const messages = [
      { level: 'info', service: 'api', message: 'Request processed successfully' },
      { level: 'debug', service: 'db', message: 'Query executed in 12ms' },
      { level: 'info', service: 'api', message: 'Cache hit for user profile' },
      { level: 'warn', service: 'api', message: 'Slow query detected (>100ms)' },
      { level: 'info', service: 'worker', message: 'Background job completed' },
      { level: 'debug', service: 'redis', message: 'Connection pool: 5/10 active' },
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newLog = {
        timestamp: new Date().toISOString(),
        level: randomMsg.level,
        service: randomMsg.service,
        message: randomMsg.message,
        metadata: {}
      };
      setLogs(prev => [...prev, newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveTail]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'debug':
        return 'text-slate-400';
      default:
        return 'text-slate-300';
    }
  };

  const getServiceColor = (service) => {
    const colors = {
      api: 'text-green-400',
      db: 'text-purple-400',
      worker: 'text-orange-400',
      redis: 'text-pink-400',
    };
    return colors[service] || 'text-cyan-400';
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesService && matchesLevel;
  });

  const services = [...new Set(logs.map(log => log.service))];
  const levels = ['all', 'error', 'warn', 'info', 'debug'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Logs</h1>
            <p className="text-slate-600 mt-1">Real-time application logs with filtering and search</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isLiveTail ? 'primary' : 'secondary'}
              icon={isLiveTail ? Pause : Play}
              size="sm"
              onClick={() => setIsLiveTail(!isLiveTail)}
            >
              {isLiveTail ? 'Live Tail' : 'Paused'}
            </Button>
            <Button variant="ghost" icon={Download} size="sm">
              Export
            </Button>
            <Button variant="ghost" icon={ExternalLink} size="sm">
              Open in Datadog
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-10 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Range */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm font-medium text-slate-700">Time Range:</span>
          {['15m', '1h', '6h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-rxt-red-primary text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
          <span>Total logs: <strong className="text-slate-900">{logs.length}</strong></span>
          <span>•</span>
          <span>Filtered: <strong className="text-slate-900">{filteredLogs.length}</strong></span>
          {searchQuery && (
            <>
              <span>•</span>
              <span>Matches: <strong className="text-rxt-red-primary">{filteredLogs.length}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Logs Viewer */}
      <div className="bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-800">
        <div className="p-4 font-mono text-sm max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredLogs.map((log, index) => (
              <motion.div
                key={`${log.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="py-1 hover:bg-slate-900 px-2 -mx-2 rounded cursor-pointer group"
              >
                <span className="text-slate-500 select-none">{formatTimestamp(log.timestamp)}</span>
                {' '}
                <span className={`font-semibold ${getLevelColor(log.level)} uppercase text-xs`}>
                  [{log.level.padEnd(5)}]
                </span>
                {' '}
                <span className={getServiceColor(log.service)}>
                  {log.service}:
                </span>
                {' '}
                <span className="text-slate-300">
                  {log.message}
                </span>
                <button className="ml-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 text-xs">
                  [copy]
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No logs match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
