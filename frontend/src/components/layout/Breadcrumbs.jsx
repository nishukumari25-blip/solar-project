import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
  crm: 'CRM',
  leads: 'Leads',
  'follow-ups': 'Follow-ups',
  survey: 'Survey & Design',
  'site-surveys': 'Site Surveys',
  'new-survey': 'New Survey Form',
  'bom-templates': 'BOM Templates',
  sales: 'Sales',
  quotations: 'Quotations',
  'new-quote': 'Quotation Builder',
  approvals: 'Approvals Queue',
  projects: 'Projects',
  milestones: 'Milestones',
  documents: 'Documents',
  procurement: 'Procurement',
  vendors: 'Vendors',
  'purchase-requisitions': 'Purchase Requisitions',
  rfq: 'RFQs & Comparisons',
  'purchase-orders': 'Purchase Orders',
  grn: 'Site GRN & Serials',
  materials: 'Project Materials',
  leftovers: 'Leftover Materials',
  subsidy: 'Subsidy & DISCOM',
  applications: 'Subsidy Applications',
  wcr: 'WCR Tracking',
  'service-orders': 'Service Orders',
  'net-metering': 'Net Metering',
  credit: 'Customer Subsidy Credit',
  finance: 'Finance & Accounts',
  payments: 'Customer Payments',
  'bank-loans': 'Bank Loans (2-Tranches)',
  invoices: 'Tax Invoices',
  receipts: 'Payment Receipts',
  'vendor-bills': 'Vendor Bills & 3-Way Match',
  'vendor-payments': 'Vendor Payments & Ageing',
  pnl: 'Project P&L',
  reports: 'Reports Hub',
  notifications: 'Notifications',
  settings: 'Settings & Administration',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Don't show on root dashboard
  }

  return (
    <nav className="flex items-center text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap py-1">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#163A5F] font-medium transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[segment] || decodeURIComponent(segment);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800 shrink-0">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-[#163A5F] transition-colors shrink-0"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
