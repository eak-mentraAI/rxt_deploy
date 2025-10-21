import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProjectOverview from './pages/ProjectOverview';
import Environments from './pages/Environments';
import Deployments from './pages/Deployments';
import DeploymentDetail from './pages/DeploymentDetail';
import Logs from './pages/Logs';
import Metrics from './pages/Metrics';
import Domains from './pages/Domains';
import Templates from './pages/Templates';
import Usage from './pages/Usage';
import Networking from './pages/Networking';
import Secrets from './pages/Secrets';
import Settings from './pages/Settings';

// Placeholder pages
const PlaceholderPage = ({ title }) => (
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
    <p className="text-slate-600 mt-2">This page is coming soon...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<ProjectOverview />} />
          <Route path="/environments" element={<Environments />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="/deployments/:deployId" element={<DeploymentDetail />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/secrets" element={<Secrets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
