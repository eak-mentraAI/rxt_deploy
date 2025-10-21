import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Circle,
  Download,
  RotateCcw,
  TrendingUp,
  Clock
} from 'lucide-react';
import StatusBadge from '../components/data-display/StatusBadge';
import Button from '../components/ui/Button';

export default function DeploymentDetail() {
  const { deployId } = useParams();
  const navigate = useNavigate();
  const [deployment, setDeployment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLiveTail, setIsLiveTail] = useState(true);

  useEffect(() => {
    // Load deployment data
    fetch('/mock-data/deployments.json')
      .then(res => res.json())
      .then(data => {
        const deploy = data.find(d => d.id === deployId) || data[0];
        setDeployment(deploy);

        // Initialize logs from deployment steps
        if (deploy.steps && deploy.steps.length > 0) {
          const allLogs = deploy.steps.flatMap((step, stepIndex) =>
            step.logs.map((log, logIndex) => ({
              id: `${stepIndex}-${logIndex}`,
              timestamp: new Date(Date.now() - (1000 * 60 * 5) + (logIndex * 1000)).toISOString(),
              message: log,
              step: step.name
            }))
          );
          setLogs(allLogs);
        }
      });
  }, [deployId]);

  // Simulate live deployment progress
  useEffect(() => {
    if (!deployment || deployment.status !== 'deploying' || !isLiveTail) return;

    const interval = setInterval(() => {
      setDeployment(prev => {
        if (!prev || prev.currentStep >= prev.steps.length - 1) {
          clearInterval(interval);
          return prev;
        }

        const newSteps = [...prev.steps];
        const currentStepIndex = prev.currentStep;

        // Complete current step
        if (newSteps[currentStepIndex].status === 'in_progress') {
          newSteps[currentStepIndex].status = 'completed';
          newSteps[currentStepIndex].duration = Math.floor(Math.random() * 30) + 20;
        }

        // Start next step
        if (currentStepIndex + 1 < newSteps.length) {
          newSteps[currentStepIndex + 1].status = 'in_progress';

          // Add simulated log
          const newLog = {
            id: `sim-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: `Starting ${newSteps[currentStepIndex + 1].displayName}...`,
            step: newSteps[currentStepIndex + 1].name
          };
          setLogs(prev => [...prev, newLog]);
        }

        return {
          ...prev,
          steps: newSteps,
          currentStep: currentStepIndex + 1,
          status: currentStepIndex + 1 >= newSteps.length - 1 ? 'healthy' : 'deploying'
        };
      });
    }, 8000); // Progress every 8 seconds

    return () => clearInterval(interval);
  }, [deployment, isLiveTail]);

  // Add random log lines during deployment
  useEffect(() => {
    if (!deployment || deployment.status !== 'deploying' || !isLiveTail) return;

    const logMessages = [
      'Fetching dependencies...',
      'Installing packages...',
      'Building assets...',
      'Optimizing bundle...',
      'Running tests...',
      'Deploying to infrastructure...',
      'Configuring network routes...',
      'Health check passed ✓',
    ];

    const logInterval = setInterval(() => {
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: randomMessage,
        step: deployment.steps[deployment.currentStep]?.name || 'unknown'
      };
      setLogs(prev => [...prev, newLog]);
    }, 3000);

    return () => clearInterval(logInterval);
  }, [deployment, isLiveTail]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  if (!deployment) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-rxt-red-primary animate-spin" />
      </div>
    );
  }

  const completedSteps = deployment.steps.filter(s => s.status === 'completed').length;
  const totalSteps = deployment.steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/deployments')}
          className="flex items-center gap-2 text-slate-600 hover:text-rxt-red-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Deployments
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Deployment #{deployment.id.split('_')[1]}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Started {formatTime(deployment.startedAt)}
              </div>
              <span>•</span>
              <code className="bg-slate-100 px-2 py-1 rounded font-mono">{deployment.commit}</code>
              <span>•</span>
              <span>{deployment.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={deployment.status} size="lg" />
            {deployment.status === 'healthy' && (
              <>
                <Button variant="secondary" icon={TrendingUp} size="sm">
                  Promote to Prod
                </Button>
                <Button variant="ghost" icon={RotateCcw} size="sm">
                  Rollback
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Progress: {completedSteps} of {totalSteps} steps completed
          </span>
          <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rxt-red-primary to-rxt-red-light"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Deployment Timeline */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Deployment Timeline</h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          {/* Steps */}
          <div className="space-y-4">
            {deployment.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-14"
              >
                {/* Step Icon */}
                <div className="absolute left-4 top-2 z-10 bg-white rounded-full p-1">
                  {getStepIcon(step.status)}
                </div>

                {/* Step Card */}
                <div className={`bg-white border-2 rounded-xl p-4 transition-all ${
                  step.status === 'in_progress'
                    ? 'border-yellow-300 shadow-md'
                    : step.status === 'completed'
                    ? 'border-green-200'
                    : 'border-slate-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{step.displayName}</h3>
                      {step.duration && (
                        <p className="text-sm text-slate-600">Completed in {step.duration}s</p>
                      )}
                    </div>
                    {step.status === 'completed' && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✓ Complete
                      </span>
                    )}
                    {step.status === 'in_progress' && (
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded animate-pulse">
                        In Progress...
                      </span>
                    )}
                  </div>

                  {/* Step Logs */}
                  {step.logs && step.logs.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {step.logs.map((log, logIndex) => (
                        <div key={logIndex} className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-1 rounded">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Live Logs</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveTail(!isLiveTail)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isLiveTail
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-slate-100 text-slate-700 border-2 border-slate-300'
              }`}
            >
              {isLiveTail ? '● Live Tail' : '○ Paused'}
            </button>
            <Button variant="ghost" icon={Download} size="sm">
              Download Logs
            </Button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm overflow-auto max-h-96">
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-300 py-1"
              >
                <span className="text-slate-500">[{formatTime(log.timestamp)}]</span>{' '}
                <span className="text-green-400">{log.step}</span>:{' '}
                {log.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Commit Info */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Commit Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Commit Hash:</span>
            <code className="font-mono bg-slate-100 px-2 py-1 rounded">{deployment.commit}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Message:</span>
            <span className="font-medium text-slate-900">{deployment.commitMessage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Author:</span>
            <span className="text-slate-900">{deployment.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
