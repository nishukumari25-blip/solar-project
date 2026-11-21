import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function ServiceOrdersPage() {
  const navigate = useNavigate();
  const { projects } = useERP();

  const serviceOrders = projects.map((p, idx) => ({
    id: `so-${p.projectId}`,
    soNumber: `SO-DISCOM-26-${String(idx + 101).padStart(4, '0')}`,
    projectId: p.projectId,
    customerName: p.customerName,
    discomSubdivision: 'JVVNL Mansarovar Subdivision, Jaipur',
    testingFeeStatus: 'Paid (₹2,500)',
    meterReleaseDate: p.status === 'Closed' ? '2026-03-29' : 'Scheduled',
    status: p.status === 'Closed' ? 'Meter Released' : 'Pending Inspection',
  }));

  const columns = [
    {
      header: 'DISCOM SO Number',
      key: 'soNumber',
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
          <span className="font-mono text-slate-500 text-[11px] block">{val}</span>
        </div>
      ),
    },
    {
      header: 'Subdivision Office',
      key: 'discomSubdivision',
      render: (val) => <span className="text-slate-600 text-xs">{val}</span>,
    },
    {
      header: 'Testing Fee',
      key: 'testingFeeStatus',
      render: (val) => <span className="font-semibold text-emerald-700 text-xs">{val}</span>,
    },
    {
      header: 'Release Date',
      key: 'meterReleaseDate',
      render: (val) => <span className="font-mono text-slate-500 text-xs">{val}</span>,
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
          <h1 className="text-xl font-bold text-slate-900">DISCOM Service Orders (SO)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bi-directional meter testing sanctions, testing fee challans, and meter procurement from DISCOM lab.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={serviceOrders}
        searchPlaceholder="Search service orders by number, project..."
        searchKeys={['soNumber', 'projectId', 'customerName', 'status']}
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
