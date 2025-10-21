import React from 'react';
import GlobalHeader from './GlobalHeader';
import LeftNav from './LeftNav';

export default function AppShell({ children }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
