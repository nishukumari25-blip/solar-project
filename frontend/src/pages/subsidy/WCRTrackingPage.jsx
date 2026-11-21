import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSignature, CheckCircle2, Clock, Upload, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function WCRTrackingPage() {
  const navigate = useNavigate();
  const { projects } = useERP();

  // WCR pipeline derived from projects
  const wcrList = projects.map((p) => {
    const isCompleted = p.status === 'Closed' || p.subsidyStage === 'Net Metering Done' || p.subsidyStage === 'Subsidy Claim Submitted';
    return {
      id: `wcr-${p.projectId}`,
      projectId: p.projectId,
      customerName: p.customerName,
      capacityKW: p.systemCapacityKW,
      wcrNumber: `WCR-26-${p.projectId.slice(-4)}`,
      submissionDate: isCompleted ? '2026-03-28' : 'Pending Commissioning',
      discomInspector: 'Er. R.K. Singhal (JVVNL)',
      status: isCompleted ? 'Approved by DISCOM' : 'Ready for Submission',
    };
  });

  const columns = [
    {
      header: 'WCR Number',
      key: 'wcrNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Project & Customer',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{row.customerName}</span>
          <span className="font-mono text-slate-500 text-[11px] block">{val} ({row.capacityKW} kW)</span>
        </div>
      ),
    },
    {
      header: 'DISCOM Division',
      key: 'discomInspector',
      render: (val) => <span className="text-slate-600 text-xs">{val}</span>,
    },
    {
      header: 'Submission Date',
      key: 'submissionDate',
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Work Completion Report (WCR) Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Post-commissioning regulatory compliance sign-offs required to trigger DISCOM meter testing.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={wcrList}
        searchPlaceholder="Search WCR by number, customer, project..."
        searchKeys={['wcrNumber', 'projectId', 'customerName', 'status']}
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
