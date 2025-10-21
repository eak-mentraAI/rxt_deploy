import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Rocket,
  ScrollText,
  BarChart3,
  Globe,
  Network,
  Key,
  Settings,
  User,
  LogOut,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/environments', icon: Layers, label: 'Environments' },
  { path: '/deployments', icon: Rocket, label: 'Deployments' },
  { path: '/logs', icon: ScrollText, label: 'Logs' },
  { path: '/metrics', icon: BarChart3, label: 'Metrics' },
  { path: '/domains', icon: Globe, label: 'Domains' },
  { path: '/networking', icon: Network, label: 'Networking' },
  { path: '/secrets', icon: Key, label: 'Secrets' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function LeftNav() {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="w-64 bg-slate-50 border-r border-slate-200 h-full p-4 flex flex-col">
      {/* Navigation Items */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-rxt-red-primary text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Section */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-200">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rxt-red-primary to-rxt-red-light flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900">Alice Johnson</p>
              <p className="text-xs text-slate-500">alice@company.com</p>
            </div>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-slate-700 text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </button>
              <div className="border-t border-slate-200"></div>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-sm">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
