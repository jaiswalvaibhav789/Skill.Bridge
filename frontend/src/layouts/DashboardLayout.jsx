import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/navigation/Sidebar';

export default function DashboardLayout({ user, onLogout, children, title, subtitle, action }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {(title || subtitle || action) && (
            <div className="bg-white border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {title && <h1 className="text-2xl font-bold font-display text-slate-900">{title}</h1>}
                  {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
              </div>
            </div>
          )}

          <div className="flex-1 p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
