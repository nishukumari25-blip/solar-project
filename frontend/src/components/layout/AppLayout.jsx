import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from './Breadcrumbs';

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden text-[#1F2937]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          toggleCollapsed={toggleCollapsed}
          closeMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              toggleMobile();
            } else {
              toggleCollapsed();
            }
          }}
          sidebarOpen={!isCollapsed}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
