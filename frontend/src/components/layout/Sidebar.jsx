import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Compass,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  Briefcase,
  ListTodo,
  FolderArchive,
  Truck,
  Building2,
  FileCheck,
  Scale,
  ShoppingBag,
  PackageCheck,
  Layers,
  Recycle,
  Landmark,
  Award,
  Clock,
  FileSignature,
  Zap,
  CreditCard,
  Wallet,
  Receipt,
  FileCode,
  DollarSign,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const Sidebar = ({ isCollapsed, toggleCollapsed }) => {
  const location = useLocation();
  const { notifications, approvals, projects } = useERP();

  const unreadNotifs = notifications.filter(n => n.unread).length;
  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  const delayedProjects = projects.filter(p => p.isDelayed).length;

  // Track expanded menu sections
  const [expandedSections, setExpandedSections] = useState({
    crm: true,
    survey: false,
    sales: true,
    projects: true,
    procurement: false,
    subsidy: false,
    finance: false,
    settings: false,
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
      isActive
        ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  const subNavItemClass = ({ isActive }) =>
    `flex items-center px-3 py-1.5 text-xs rounded-lg transition-colors pl-8 ${
      isActive
        ? 'bg-[#2563EB]/80 text-white font-semibold'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#163A5F] text-white transition-all duration-300 flex flex-col border-r border-[#112a45] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#112a45] flex items-center justify-between shrink-0 bg-[#122e4c]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F4B740] to-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <Sun className="w-5 h-5 text-slate-900 animate-spin-slow" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-base tracking-tight text-white block">
                Solaris <span className="text-[#F4B740]">EPC</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                Phase 1 Solar ERP
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {/* 1. Dashboard */}
        <NavLink to="/" className={navItemClass}>
          <LayoutDashboard className="w-4 h-4 shrink-0 mr-3" />
          {!isCollapsed && <span className="flex-1">Dashboard</span>}
          {!isCollapsed && delayedProjects > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
              {delayedProjects}
            </span>
          )}
        </NavLink>

        {/* 2. CRM */}
        <div>
          <button
            onClick={() => toggleSection('crm')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Users className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">CRM & Leads</span>}
            {!isCollapsed && (expandedSections.crm ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.crm) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/crm/leads" className={subNavItemClass}>
                <span>Leads Directory</span>
              </NavLink>
              <NavLink to="/crm/follow-ups" className={subNavItemClass}>
                <span>Follow-ups Schedule</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. Survey & Design */}
        <div>
          <button
            onClick={() => toggleSection('survey')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Compass className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Survey & Design</span>}
            {!isCollapsed && (expandedSections.survey ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.survey) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/survey/site-surveys" className={subNavItemClass}>
                <span>Site Feasibility Surveys</span>
              </NavLink>
              <NavLink to="/survey/bom-templates" className={subNavItemClass}>
                <span>BOM Design Templates</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. Sales */}
        <div>
          <button
            onClick={() => toggleSection('sales')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Sales & Quotes</span>}
            {!isCollapsed && pendingApprovals > 0 && (
              <span className="mr-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-slate-900 rounded-full">
                {pendingApprovals}
              </span>
            )}
            {!isCollapsed && (expandedSections.sales ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.sales) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/sales/quotations" className={subNavItemClass}>
                <span>Quotations</span>
              </NavLink>
              <NavLink to="/sales/approvals" className={subNavItemClass}>
                <span className="flex-1">Approval Queue</span>
                {pendingApprovals > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-400 text-slate-900 rounded-full">
                    {pendingApprovals}
                  </span>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* 5. Projects */}
        <div>
          <button
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Briefcase className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Projects</span>}
            {!isCollapsed && (expandedSections.projects ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.projects) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/projects" end className={subNavItemClass}>
                <span>All Projects</span>
              </NavLink>
              <NavLink to="/projects/milestones" className={subNavItemClass}>
                <span className="flex-1">Installation Milestones</span>
                {delayedProjects > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                    {delayedProjects}
                  </span>
                )}
              </NavLink>
              <NavLink to="/projects/documents" className={subNavItemClass}>
                <span>Project Documents</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 6. Procurement */}
        <div>
          <button
            onClick={() => toggleSection('procurement')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Procurement</span>}
            {!isCollapsed && (expandedSections.procurement ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.procurement) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/procurement/vendors" className={subNavItemClass}>
                <span>Vendors Directory</span>
              </NavLink>
              <NavLink to="/procurement/purchase-requisitions" className={subNavItemClass}>
                <span>Purchase Requisitions</span>
              </NavLink>
              <NavLink to="/procurement/rfq" className={subNavItemClass}>
                <span>RFQ Price Matrix</span>
              </NavLink>
              <NavLink to="/procurement/purchase-orders" className={subNavItemClass}>
                <span>Purchase Orders</span>
              </NavLink>
              <NavLink to="/procurement/grn" className={subNavItemClass}>
                <span>Goods Receipt (GRN)</span>
              </NavLink>
              <NavLink to="/procurement/project-materials" className={subNavItemClass}>
                <span>Project Materials</span>
              </NavLink>
              <NavLink to="/procurement/leftovers" className={subNavItemClass}>
                <span>Leftover Inventory</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 7. Subsidy & DISCOM */}
        <div>
          <button
            onClick={() => toggleSection('subsidy')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Landmark className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Subsidy & DISCOM</span>}
            {!isCollapsed && (expandedSections.subsidy ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.subsidy) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/subsidy/applications" className={subNavItemClass}>
                <span>Subsidy Pipeline</span>
              </NavLink>
              <NavLink to="/subsidy/wcr" className={subNavItemClass}>
                <span>WCR Tracking</span>
              </NavLink>
              <NavLink to="/subsidy/service-orders" className={subNavItemClass}>
                <span>DISCOM Service Orders</span>
              </NavLink>
              <NavLink to="/subsidy/net-metering" className={subNavItemClass}>
                <span>Net Metering</span>
              </NavLink>
              <NavLink to="/subsidy/credit-tracking" className={subNavItemClass}>
                <span>Customer Subsidy Credit</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 8. Finance */}
        <div>
          <button
            onClick={() => toggleSection('finance')}
            className="w-full flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <DollarSign className="w-4 h-4 shrink-0 mr-3 text-slate-300" />
            {!isCollapsed && <span className="flex-1 text-left">Finance</span>}
            {!isCollapsed && (expandedSections.finance ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
          </button>
          {(!isCollapsed && expandedSections.finance) && (
            <div className="mt-1 space-y-0.5">
              <NavLink to="/finance/customer-payments" className={subNavItemClass}>
                <span>Customer Receivables</span>
              </NavLink>
              <NavLink to="/finance/bank-loans" className={subNavItemClass}>
                <span>Bank Loans Pipeline</span>
              </NavLink>
              <NavLink to="/finance/invoices" className={subNavItemClass}>
                <span>Final Tax Invoices</span>
              </NavLink>
              <NavLink to="/finance/receipts" className={subNavItemClass}>
                <span>Payment Receipts</span>
              </NavLink>
              <NavLink to="/finance/vendor-bills" className={subNavItemClass}>
                <span>Vendor Bills (3-Way)</span>
              </NavLink>
              <NavLink to="/finance/vendor-payments" className={subNavItemClass}>
                <span>Vendor Disbursements</span>
              </NavLink>
              <NavLink to="/finance/project-pnl" className={subNavItemClass}>
                <span>Project P&L (Frozen)</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 9. Reports */}
        <NavLink to="/reports" className={navItemClass}>
          <BarChart3 className="w-4 h-4 shrink-0 mr-3" />
          {!isCollapsed && <span>Reports & Analytics</span>}
        </NavLink>

        {/* 10. Notifications */}
        <NavLink to="/notifications" className={navItemClass}>
          <Bell className="w-4 h-4 shrink-0 mr-3" />
          {!isCollapsed && <span className="flex-1">Notifications</span>}
          {!isCollapsed && unreadNotifs > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#F4B740] text-slate-900 rounded-full">
              {unreadNotifs}
            </span>
          )}
        </NavLink>

        {/* 11. Settings */}
        <NavLink to="/settings" className={navItemClass}>
          <Settings className="w-4 h-4 shrink-0 mr-3" />
          {!isCollapsed && <span>Settings & Masters</span>}
        </NavLink>
      </div>

      {/* Footer System Status Ribbon */}
      {!isCollapsed && (
        <div className="p-3 bg-[#112a45] border-t border-[#0d2238] text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jaipur Hub v1.0</span>
          </div>
          <span className="font-mono text-slate-500">FY 26-27</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
