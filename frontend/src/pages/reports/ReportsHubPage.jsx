import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Briefcase,
  Users,
  Award,
  Filter,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatINR } from '../../utils/formatters';

export default function ReportsHubPage() {
  const navigate = useNavigate();
  const { projects, leads, quotations, customerPayments, pos, subsidies } = useERP();

  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('Current FY 2026-27');

  // Sales Report Data
  const salesRows = quotations.map((q) => ({
    id: q.id,
    ref: q.quoteNumber,
    customer: q.customerName,
    capacity: `${q.systemCapacityKW} kW`,
    amount: formatINR(q.grandTotal),
    subsidy: formatINR(q.totalSubsidy),
    netCost: formatINR(q.netCustomerCost),
    date: q.date,
    status: q.status,
  }));

  // Operations Report Data
  const opsRows = projects.map((p) => ({
    id: p.id,
    ref: p.projectId,
    customer: p.customerName,
    capacity: `${p.systemCapacityKW} kW`,
    manager: p.managerName,
    subsidyStage: p.subsidyStage,
    balance: formatINR(p.balanceDue),
    status: p.status,
  }));

  // Procurement Report Data
  const procRows = pos.map((po) => ({
    id: po.id,
    ref: po.poNumber,
    project: po.projectId,
    vendor: po.vendorName,
    amount: formatINR(po.totalAmount),
    date: po.date,
    status: po.status,
  }));

  const handleExportCSV = (reportName) => {
    alert(`Exporting ${reportName} (${dateRange}) to CSV format (Simulated).`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Executive Reports & Business Intelligence Hub</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-departmental analytics for management review, statutory compliance, and audit preparation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium"
          >
            <option value="Current FY 2026-27">Current FY 2026-27</option>
            <option value="Q4 FY 2025-26">Q4 FY 2025-26</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="All Time">All Time</option>
          </select>
          <Button
            variant="ghost"
            size="sm"
            icon={Download}
            onClick={() => handleExportCSV(activeTab.toUpperCase())}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'sales', label: '1. Sales & Conversion Report', icon: Users },
          { id: 'ops', label: '2. Project Execution Velocity', icon: Briefcase },
          { id: 'proc', label: '3. Procurement & Direct-to-Site Spend', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#163A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Tables */}
      {activeTab === 'sales' && (
        <DataTable
          columns={[
            { header: 'Quote No.', key: 'ref', sortable: true },
            { header: 'Customer', key: 'customer', sortable: true },
            { header: 'Capacity', key: 'capacity', sortable: true },
            { header: 'Quoted Total', key: 'amount', sortable: true },
            { header: 'Govt Subsidy', key: 'subsidy' },
            { header: 'Net Customer Cost', key: 'netCost' },
            { header: 'Date', key: 'date', sortable: true },
            { header: 'Status', key: 'status', sortable: true },
          ]}
          data={salesRows}
          searchPlaceholder="Search sales report..."
          showExport={true}
          onExport={() => handleExportCSV('Sales Report')}
        />
      )}

      {activeTab === 'ops' && (
        <DataTable
          columns={[
            { header: 'Project ID', key: 'ref', sortable: true },
            { header: 'Customer', key: 'customer', sortable: true },
            { header: 'Capacity', key: 'capacity', sortable: true },
            { header: 'Project Manager', key: 'manager' },
            { header: 'Subsidy Stage', key: 'subsidyStage' },
            { header: 'Outstanding Balance', key: 'balance' },
            { header: 'Project Status', key: 'status', sortable: true },
          ]}
          data={opsRows}
          searchPlaceholder="Search execution report..."
          showExport={true}
          onExport={() => handleExportCSV('Execution Velocity Report')}
        />
      )}

      {activeTab === 'proc' && (
        <DataTable
          columns={[
            { header: 'PO Number', key: 'ref', sortable: true },
            { header: 'Project Ref', key: 'project', sortable: true },
            { header: 'Vendor Supplier', key: 'vendor', sortable: true },
            { header: 'Order Amount', key: 'amount', sortable: true },
            { header: 'PO Date', key: 'date', sortable: true },
            { header: 'Fulfillment Status', key: 'status', sortable: true },
          ]}
          data={procRows}
          searchPlaceholder="Search procurement report..."
          showExport={true}
          onExport={() => handleExportCSV('Procurement Spend Report')}
        />
      )}
    </div>
  );
}
