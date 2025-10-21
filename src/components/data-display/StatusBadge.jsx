import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Pause, XCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const configs = {
    healthy: {
      icon: CheckCircle2,
      label: 'Healthy',
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
    },
    deploying: {
      icon: Loader2,
      label: 'Deploying',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      animate: true,
    },
    building: {
      icon: Loader2,
      label: 'Building',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      animate: true,
    },
    error: {
      icon: XCircle,
      label: 'Error',
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
    },
    paused: {
      icon: Pause,
      label: 'Paused',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
    pending: {
      icon: AlertCircle,
      label: 'Pending',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizes[size]} font-medium`}>
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
}
