import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Mail, Trash2, Crown, Eye, Edit, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('team');

  const tabs = [
    { id: 'team', label: 'Team & Access', icon: Users },
    { id: 'general', label: 'General', icon: Shield }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage project settings and team access</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-rxt-red-primary text-rxt-red-primary'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'team' && <TeamAccessTab />}
      {activeTab === 'general' && <GeneralTab />}
    </div>
  );
}

function TeamAccessTab() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@company.com',
      role: 'owner',
      avatar: 'A',
      status: 'active',
      joinedAt: '2025-01-15'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@company.com',
      role: 'admin',
      avatar: 'B',
      status: 'active',
      joinedAt: '2025-03-22'
    },
    {
      id: 3,
      name: 'Charlie Davis',
      email: 'charlie@company.com',
      role: 'developer',
      avatar: 'C',
      status: 'active',
      joinedAt: '2025-05-10'
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana@company.com',
      role: 'developer',
      avatar: 'D',
      status: 'active',
      joinedAt: '2025-07-18'
    },
    {
      id: 5,
      name: 'Eve Martinez',
      email: 'eve@company.com',
      role: 'viewer',
      avatar: 'E',
      status: 'pending',
      joinedAt: null
    }
  ];

  const roles = {
    owner: {
      label: 'Owner',
      color: 'bg-purple-100 text-purple-700',
      icon: Crown,
      permissions: ['Full access', 'Billing', 'Delete project', 'Manage team']
    },
    admin: {
      label: 'Admin',
      color: 'bg-blue-100 text-blue-700',
      icon: Shield,
      permissions: ['Deploy', 'Manage secrets', 'Configure environments', 'Invite members']
    },
    developer: {
      label: 'Developer',
      color: 'bg-green-100 text-green-700',
      icon: Edit,
      permissions: ['Deploy', 'View logs', 'View metrics', 'View secrets']
    },
    viewer: {
      label: 'Viewer',
      color: 'bg-slate-100 text-slate-700',
      icon: Eye,
      permissions: ['View deployments', 'View logs', 'View metrics']
    }
  };

  const getRoleInfo = (role) => roles[role] || roles.viewer;

  return (
    <div className="space-y-6">
      {/* Invite Member */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Team Members</h2>
            <p className="text-sm text-slate-600 mt-1">Manage who has access to this project</p>
          </div>
          <Button variant="primary" icon={UserPlus} onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teamMembers.map((member, index) => {
                const roleInfo = getRoleInfo(member.role);
                const RoleIcon = roleInfo.icon;

                return (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rxt-red-primary to-rxt-red-light flex items-center justify-center text-white font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.status === 'active' ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {member.role !== 'owner' && (
                          <>
                            <Button variant="ghost" size="sm">
                              Change Role
                            </Button>
                            <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Role Permissions</h2>
        <p className="text-sm text-slate-600 mb-6">
          Understand what each role can do within this project
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(roles).map(([roleKey, roleData]) => {
            const RoleIcon = roleData.icon;
            return (
              <div key={roleKey} className="border-2 border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${roleData.color}`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{roleData.label}</h3>
                </div>
                <ul className="space-y-2">
                  {roleData.permissions.map((perm, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="space-y-6">
      {/* Project Information */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              defaultValue="my-api"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              defaultValue="Production API service"
              rows={3}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Repository URL
            </label>
            <input
              type="text"
              defaultValue="github.com/acme/my-api"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-rxt-red-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold text-red-900 mb-1">Danger Zone</h2>
            <p className="text-sm text-red-700">
              These actions are irreversible. Please proceed with caution.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Transfer Project</h3>
              <p className="text-sm text-slate-600">Transfer this project to another organization</p>
            </div>
            <Button variant="ghost" size="sm">
              Transfer
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Archive Project</h3>
              <p className="text-sm text-slate-600">Archive this project (can be restored later)</p>
            </div>
            <Button variant="ghost" size="sm">
              Archive
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-900">Delete Project</h3>
              <p className="text-sm text-red-700">Permanently delete this project and all its data</p>
            </div>
            <Button variant="ghost" size="sm" icon={Trash2}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
