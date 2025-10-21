import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Github, Gitlab, Code2, Rocket, Zap, Globe } from 'lucide-react';
import Button from '../ui/Button';

export default function OnboardingWizard({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectName: '',
    repository: '',
    framework: '',
    deployRegion: 'us-east-1'
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to RXT Deploy',
      subtitle: 'Let\'s get your first project deployed in minutes',
      icon: Rocket
    },
    {
      id: 'connect-repo',
      title: 'Connect Repository',
      subtitle: 'Link your Git repository to get started',
      icon: Github
    },
    {
      id: 'configure',
      title: 'Configure Project',
      subtitle: 'Set up your build and runtime configuration',
      icon: Code2
    },
    {
      id: 'deploy',
      title: 'Ready to Deploy',
      subtitle: 'Review and launch your first deployment',
      icon: Zap
    }
  ];

  const frameworks = [
    { id: 'nextjs', name: 'Next.js', icon: '⚡' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js', icon: '💚' },
    { id: 'node', name: 'Node.js', icon: '🟢' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'static', name: 'Static Site', icon: '📄' }
  ];

  const regions = [
    { id: 'us-east-1', name: 'US East (Virginia)', latency: '20ms' },
    { id: 'us-west-1', name: 'US West (California)', latency: '45ms' },
    { id: 'eu-west-1', name: 'EU West (Ireland)', latency: '80ms' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', latency: '180ms' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete?.(formData);
      onClose?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.repository.length > 0;
      case 2: return formData.projectName.length > 0 && formData.framework.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logos/rxt_icon.png"
                alt="RXT"
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</h2>
                <p className="text-sm text-slate-600">{steps[currentStep].subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-rxt-red-primary text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && (
                <ConnectRepoStep
                  repository={formData.repository}
                  onChange={(value) => updateFormData('repository', value)}
                />
              )}
              {currentStep === 2 && (
                <ConfigureStep
                  projectName={formData.projectName}
                  framework={formData.framework}
                  deployRegion={formData.deployRegion}
                  frameworks={frameworks}
                  regions={regions}
                  onChange={updateFormData}
                />
              )}
              {currentStep === 3 && <DeployStep formData={formData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              icon={ArrowLeft}
            >
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Skip for now
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!isStepValid()}
                icon={currentStep === steps.length - 1 ? Rocket : ArrowRight}
              >
                {currentStep === steps.length - 1 ? 'Deploy Project' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rxt-red-primary to-rxt-red-light rounded-2xl flex items-center justify-center">
        <Rocket className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">Deploy with Confidence</h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        RXT Deploy makes it easy to deploy, manage, and scale your applications on Rackspace infrastructure.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-900">Fast Deployments</p>
          <p className="text-xs text-slate-500">Go live in minutes</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-900">Global Scale</p>
          <p className="text-xs text-slate-500">Deploy anywhere</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
            <Check className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-slate-900">Zero Config</p>
          <p className="text-xs text-slate-500">Just push code</p>
        </div>
      </div>
    </div>
  );
}

function ConnectRepoStep({ repository, onChange }) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button className="flex-1 p-6 border-2 border-rxt-red-primary rounded-xl hover:shadow-lg transition-all bg-rxt-red-50">
          <Github className="w-8 h-8 mb-3 text-slate-900" />
          <h4 className="font-semibold text-slate-900 mb-1">GitHub</h4>
          <p className="text-sm text-slate-600">Connect your GitHub repository</p>
        </button>
        <button className="flex-1 p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all">
          <Gitlab className="w-8 h-8 mb-3 text-orange-600" />
          <h4 className="font-semibold text-slate-900 mb-1">GitLab</h4>
          <p className="text-sm text-slate-600">Connect your GitLab repository</p>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Repository URL
        </label>
        <input
          type="text"
          value={repository}
          onChange={(e) => onChange(e.target.value)}
          placeholder="github.com/username/repo"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          We'll automatically detect your framework and configuration
        </p>
      </div>
    </div>
  );
}

function ConfigureStep({ projectName, framework, deployRegion, frameworks, regions, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => onChange('projectName', e.target.value)}
          placeholder="my-awesome-app"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Framework
        </label>
        <div className="grid grid-cols-3 gap-3">
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              onClick={() => onChange('framework', fw.id)}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                framework === fw.id
                  ? 'border-rxt-red-primary bg-rxt-red-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-3xl mb-2">{fw.icon}</div>
              <p className="text-sm font-medium text-slate-900">{fw.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Deploy Region
        </label>
        <div className="space-y-2">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => onChange('deployRegion', region.id)}
              className={`w-full p-4 border-2 rounded-lg transition-all text-left flex items-center justify-between ${
                deployRegion === region.id
                  ? 'border-rxt-red-primary bg-rxt-red-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="font-medium text-slate-900">{region.name}</p>
                <p className="text-sm text-slate-500">Latency: {region.latency}</p>
              </div>
              {deployRegion === region.id && (
                <Check className="w-5 h-5 text-rxt-red-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeployStep({ formData }) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
        <Check className="w-12 h-12 mx-auto mb-3 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Ready to Deploy!</h3>
        <p className="text-sm text-green-700">
          Your project is configured and ready to launch
        </p>
      </div>

      <div className="bg-slate-50 rounded-lg p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Configuration Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Project Name:</span>
            <span className="text-sm font-medium text-slate-900">{formData.projectName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Repository:</span>
            <span className="text-sm font-medium text-slate-900">{formData.repository || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Framework:</span>
            <span className="text-sm font-medium text-slate-900 capitalize">{formData.framework || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Region:</span>
            <span className="text-sm font-medium text-slate-900">{formData.deployRegion}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>What happens next?</strong> We'll initialize your environments, set up CI/CD, and deploy your first version. This usually takes 2-5 minutes.
        </p>
      </div>
    </div>
  );
}
