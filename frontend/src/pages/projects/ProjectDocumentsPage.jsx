import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderArchive, FileText, CheckCircle2, Upload, Eye, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';

export default function ProjectDocumentsPage() {
  const navigate = useNavigate();
  const { projects } = useERP();

  // Cross project documents manifest
  const documents = projects.flatMap((p) => [
    {
      id: `${p.projectId}-kyc`,
      projectId: p.projectId,
      customerName: p.customerName,
      documentName: 'Customer Aadhaar & Electricity Bill',
      category: 'KYC & Utility',
      status: 'Verified',
      uploadedDate: p.createdAt,
    },
    {
      id: `${p.projectId}-survey`,
      projectId: p.projectId,
      customerName: p.customerName,
      documentName: 'Geotagged Rooftop Survey Report',
      category: 'Technical Design',
      status: 'Verified',
      uploadedDate: p.createdAt,
    },
    {
      id: `${p.projectId}-wcr`,
      projectId: p.projectId,
      customerName: p.customerName,
      documentName: 'Work Completion Report (WCR)',
      category: 'Commissioning',
      status: p.status === 'Closed' ? 'Verified' : 'Pending',
      uploadedDate: p.status === 'Closed' ? p.closedDate : '—',
    },
    {
      id: `${p.projectId}-sync`,
      projectId: p.projectId,
      customerName: p.customerName,
      documentName: 'DISCOM Net Metering Certificate',
      category: 'Regulatory',
      status: p.status === 'Closed' ? 'Verified' : 'Pending',
      uploadedDate: p.status === 'Closed' ? p.closedDate : '—',
    },
  ]);

  const columns = [
    {
      header: 'Project ID',
      key: 'projectId',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-900">{val}</span>,
    },
    {
      header: 'Document Name',
      key: 'documentName',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Category',
      key: 'category',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            val === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Compliance & Document Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized document verification for WCR, DISCOM synchronization, and customer KYC.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        searchPlaceholder="Search documents by project or title..."
        searchKeys={['projectId', 'customerName', 'documentName', 'category']}
        onRowClick={(row) => navigate(`/projects/${row.projectId}`)}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={ArrowUpRight}
            onClick={() => navigate(`/projects/${row.projectId}`)}
          >
            Project
          </Button>
        )}
      />
    </div>
  );
}
