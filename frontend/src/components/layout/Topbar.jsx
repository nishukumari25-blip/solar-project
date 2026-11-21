import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  Plus,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ClipboardList,
  Sun,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function Topbar({ onToggleSidebar, sidebarOpen }) {
  const { currentUser, activeRole, switchRole, switchUser, allUsers } = useAuth();
  const { notifications, resetDemoData, projects, leads, quotations, serials } = useERP();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  const unreadNotifications = notifications.filter((n) => n.unread);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (quickRef.current && !quickRef.current.contains(e.target)) setQuickCreateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search Results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results = [];

    // Search Projects
    projects.forEach((p) => {
      if (
        p.projectId.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.mobile.includes(query)
      ) {
        results.push({
          type: 'Project',
          title: `${p.projectId} — ${p.customerName}`,
          subtitle: `${p.systemCapacityKW} kW | ₹${p.contractValue.toLocaleString('en-IN')} | ${p.status}`,
          link: `/projects/${p.projectId}`,
        });
      }
    });

    // Search Leads
    leads.forEach((l) => {
      if (
        l.leadCode.toLowerCase().includes(query) ||
        l.customerName.toLowerCase().includes(query) ||
        l.mobile.includes(query)
      ) {
        results.push({
          type: 'Lead',
          title: `${l.leadCode} — ${l.customerName}`,
          subtitle: `${l.proposedCapacityKW} kW | ${l.city} | ${l.status}`,
          link: `/crm/leads/${l.id}`,
        });
      }
    });

    // Search Quotations
    quotations.forEach((q) => {
      if (
        q.quoteNumber.toLowerCase().includes(query) ||
        q.customerName.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'Quotation',
          title: `${q.quoteNumber} — ${q.customerName}`,
          subtitle: `${q.systemCapacityKW} kW | ₹${q.grandTotal.toLocaleString('en-IN')} | ${q.status}`,
          link: `/sales/quotations`,
        });
      }
    });

    // Search Serials
    serials.forEach((s) => {
      if (
        s.serialNumber.toLowerCase().includes(query) ||
        s.itemType.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'Serial Number',
          title: `${s.serialNumber} (${s.itemType})`,
          subtitle: `Project: ${s.projectId} | GRN: ${s.grnNumber}`,
          link: `/procurement/grn`,
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, projects, leads, quotations, serials]);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile hamburger & Global Search Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors w-64 md:w-80 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search projects, leads, serials...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-500 font-mono shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action (+ New) */}
          <div className="relative" ref={quickRef}>
            <button
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#163A5F] hover:bg-[#122e4c] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Quick Action</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Create New
                </div>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false);
                    navigate('/crm/leads');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>New Customer Lead</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false);
                    navigate('/survey/new-survey');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4 text-teal-600" />
                  <span>Start Site Survey Form</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false);
                    navigate('/sales/new-quote');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Generate Quotation</span>
                </button>
                <button
                  onClick={() => {
                    setQuickCreateOpen(false);
                    navigate('/finance/payments');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Record Customer Payment</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Role Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
            <Shield className="w-3.5 h-3.5 text-[#163A5F]" />
            <span className="text-slate-500 font-medium">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent font-semibold text-[#163A5F] focus:outline-none cursor-pointer text-xs"
            >
              {currentUser.roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('/notifications');
                    }}
                    className="text-[11px] text-[#2563EB] hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.targetPath) navigate(n.targetPath);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#163A5F] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">{activeRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {currentUser.roles.map((r) => (
                      <span
                        key={r}
                        className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                          r === activeRole ? 'bg-[#163A5F] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Switch Demo User Section */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Switch Prototype Persona
                  </p>
                  <div className="space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setProfileOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-slate-100 font-semibold text-[#163A5F]'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{u.name}</span>
                        <span className="text-[10px] text-slate-400">({u.roles[0]})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      if (window.confirm('Reset all demo data back to factory initial state?')) {
                        resetDemoData();
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Prototype State</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        title="Global Search"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, mobile, project code, or serial number..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    navigate(res.link);
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-lg cursor-pointer border border-slate-200/60 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#163A5F] px-1.5 py-0.5 bg-white border border-slate-200 rounded mr-2">
                      {res.type}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm">{res.title}</span>
                    <p className="text-xs text-slate-500 mt-1">{res.subtitle}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              ))
            ) : searchQuery.trim() ? (
              <p className="text-center py-8 text-xs text-slate-400">
                No matching projects, leads, or serials found for "{searchQuery}".
              </p>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Type something to search across Projects, Leads, Quotations, and Serial Numbers.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
