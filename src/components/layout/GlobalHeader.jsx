import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../data-display/StatusBadge';

export default function GlobalHeader({ projectName = "my-api" }) {
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load projects
    fetch('/mock-data/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        const current = data.find(p => p.isCurrent);
        if (current) setCurrentProject(current);
      });
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProjectSwitcher(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSwitch = (project) => {
    setCurrentProject(project);
    setProjects(prev => prev.map(p => ({
      ...p,
      isCurrent: p.id === project.id
    })));
    setShowProjectSwitcher(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Project */}
        <div className="flex items-center gap-4">
          <img
            src="/assets/logos/rxt_icon.png"
            alt="Rackspace"
            className="h-8 w-8 rounded-lg"
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-rxt-red-primary to-rxt-red-light bg-clip-text text-transparent">
              Deploy
            </span>
          </div>
          <div className="hidden md:block w-px h-6 bg-slate-300" />

          {/* Project Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition-colors"
            >
              {currentProject?.name || projectName}
              <svg className={`w-4 h-4 transition-transform ${showProjectSwitcher ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showProjectSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-0 w-80 bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-3 border-b border-slate-200 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-600 uppercase">Switch Project</p>
                  </div>

                  {/* Project List */}
                  <div className="max-h-96 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleProjectSwitch(project)}
                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900 truncate">{project.name}</p>
                            {project.isCurrent && (
                              <Check className="w-4 h-4 text-rxt-red-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 truncate mb-2">{project.description}</p>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={project.status} size="sm" />
                            <span className="text-xs text-slate-500">{project.environments} env{project.environments !== 1 ? 's' : ''}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{project.framework}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-slate-200 bg-slate-50">
                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rxt-red-primary text-white hover:bg-rxt-red-dark transition-colors text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      Create New Project
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rxt-red-primary rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
