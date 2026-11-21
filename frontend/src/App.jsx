import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ERPProvider } from './context/ERPContext';
import AppLayout from './components/layout/AppLayout';

// Module Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// CRM
import LeadsListPage from './pages/crm/LeadsListPage';
import LeadsKanbanPage from './pages/crm/LeadsKanbanPage';
import LeadDetailPage from './pages/crm/LeadDetailPage';
import FollowUpsPage from './pages/crm/FollowUpsPage';

// Survey & Technical Design
import SiteSurveysPage from './pages/survey/SiteSurveysPage';
import SurveyFormPage from './pages/survey/SurveyFormPage';
import BOMTemplatesPage from './pages/survey/BOMTemplatesPage';

// Sales & Quotations
import QuotationsListPage from './pages/sales/QuotationsListPage';
import QuototationBuilderPage from './pages/sales/QuotationBuilderPage';
import ApprovalsPage from './pages/sales/ApprovalsPage';

// Projects
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import MilestonesPage from './pages/projects/MilestonesPage';
import ProjectDocumentsPage from './pages/projects/ProjectDocumentsPage';

// Procurement
import VendorsPage from './pages/procurement/VendorsPage';
import PurchaseRequisitionsPage from './pages/procurement/PurchaseRequisitionsPage';
import RFQPage from './pages/procurement/RFQPage';
import PurchaseOrdersPage from './pages/procurement/PurchaseOrdersPage';
import GRNPage from './pages/procurement/GRNPage';
import ProjectMaterialsPage from './pages/procurement/ProjectMaterialsPage';
import LeftoverMaterialsPage from './pages/procurement/LeftoverMaterialsPage';

// Subsidy & DISCOM
import SubsidyApplicationsPage from './pages/subsidy/SubsidyApplicationsPage';
import WCRTrackingPage from './pages/subsidy/WCRTrackingPage';
import ServiceOrdersPage from './pages/subsidy/ServiceOrdersPage';
import NetMeteringPage from './pages/subsidy/NetMeteringPage';
import SubsidyCreditPage from './pages/subsidy/SubsidyCreditPage';

// Finance & Accounts
import CustomerPaymentsPage from './pages/finance/CustomerPaymentsPage';
import BankLoansPage from './pages/finance/BankLoansPage';
import InvoicesPage from './pages/finance/InvoicesPage';
import ReceiptsPage from './pages/finance/ReceiptsPage';
import VendorBillsPage from './pages/finance/VendorBillsPage';
import VendorPaymentsPage from './pages/finance/VendorPaymentsPage';
import ProjectPnLPage from './pages/finance/ProjectPnLPage';

// Reports, Notifications & Settings
import ReportsHubPage from './pages/reports/ReportsHubPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <ERPProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Dashboard */}
              <Route index element={<DashboardPage />} />

              {/* CRM */}
              <Route path="crm">
                <Route index element={<Navigate to="leads" replace />} />
                <Route path="leads" element={<LeadsListPage />} />
                <Route path="kanban" element={<LeadsKanbanPage />} />
                <Route path="leads/:id" element={<LeadDetailPage />} />
                <Route path="follow-ups" element={<FollowUpsPage />} />
              </Route>

              {/* Survey & Design */}
              <Route path="survey">
                <Route index element={<Navigate to="site-surveys" replace />} />
                <Route path="site-surveys" element={<SiteSurveysPage />} />
                <Route path="new-survey" element={<SurveyFormPage />} />
                <Route path="bom-templates" element={<BOMTemplatesPage />} />
              </Route>

              {/* Sales & Quotations */}
              <Route path="sales">
                <Route index element={<Navigate to="quotations" replace />} />
                <Route path="quotations" element={<QuotationsListPage />} />
                <Route path="new-quote" element={<QuototationBuilderPage />} />
                <Route path="approvals" element={<ApprovalsPage />} />
              </Route>

              {/* Projects */}
              <Route path="projects">
                <Route index element={<Navigate to="all" replace />} />
                <Route path="all" element={<ProjectsListPage />} />
                <Route path="milestones" element={<MilestonesPage />} />
                <Route path="documents" element={<ProjectDocumentsPage />} />
                <Route path=":id" element={<ProjectDetailPage />} />
              </Route>

              {/* Procurement */}
              <Route path="procurement">
                <Route index element={<Navigate to="vendors" replace />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="purchase-requisitions" element={<PurchaseRequisitionsPage />} />
                <Route path="rfq" element={<RFQPage />} />
                <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="grn" element={<GRNPage />} />
                <Route path="materials" element={<ProjectMaterialsPage />} />
                <Route path="leftovers" element={<LeftoverMaterialsPage />} />
              </Route>

              {/* Subsidy & DISCOM */}
              <Route path="subsidy">
                <Route index element={<Navigate to="applications" replace />} />
                <Route path="applications" element={<SubsidyApplicationsPage />} />
                <Route path="wcr" element={<WCRTrackingPage />} />
                <Route path="service-orders" element={<ServiceOrdersPage />} />
                <Route path="net-metering" element={<NetMeteringPage />} />
                <Route path="credit" element={<SubsidyCreditPage />} />
              </Route>

              {/* Finance & Accounts */}
              <Route path="finance">
                <Route index element={<Navigate to="payments" replace />} />
                <Route path="payments" element={<CustomerPaymentsPage />} />
                <Route path="bank-loans" element={<BankLoansPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="receipts" element={<ReceiptsPage />} />
                <Route path="vendor-bills" element={<VendorBillsPage />} />
                <Route path="vendor-payments" element={<VendorPaymentsPage />} />
                <Route path="pnl" element={<ProjectPnLPage />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<ReportsHubPage />} />

              {/* Notifications */}
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ERPProvider>
    </AuthProvider>
  );
}
