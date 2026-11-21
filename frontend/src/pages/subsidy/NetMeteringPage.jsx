import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle2, Clock, Lock, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function NetMeteringPage() {
  const navigate = useNavigate();
  const { projects, subsidies } = useERP();

  const netMeteringList = projects.map((p) => {
    const s = subsidies.find((sub) => sub.projectId === p.projectId);
    const isDone = s?.currentStage === 'Net Metering Done' || s?.currentStage === 'Subsidy Credited to Customer' || p.status === 'Closed';

    return {
      id: `nm-${p.projectId}`,
      projectId: p.projectId,
      customerName: p.customerName,
      capacityKW: p.systemCapacityKW,
      meterNumber: isDone ? `GENUS-BI-26-${p.projectId.slice(-4)}` : 'Awaiting Installation',
      importReading: isDone ? '00000.0 kWh' : '—',
      exportReading: isDone ? '00000.0 kWh' : '—',
      syncDate: isDone ? (p.commissioningDate || '2026-03-30') : 'Pending',
      status: isDone ? 'Synchronized & Operational' : 'Meter Testing in Progress',
      unlocksTranche2: isDone,
    };
  });

  const columns = [
    {
      header: 'Project & Customer',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          <span className="font-semibold text-slate-900 block">{row.customerName}</span>
        </div>
      ),
    },
    {
      header: 'Capacity',
      key: 'capacityKW',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-800">{val} kW</span>,
    },
    {
      header: 'Bi-directional Meter No.',
      key: 'meterNumber',
      render: (val) => <span className="font-mono text-slate-700 text-xs font-semibold">{val}</span>,
    },
    {
      header: 'Grid Sync Date',
      key: 'syncDate',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>,
    },
    {
      header: 'Regulatory Impact',
      key: 'unlocksTranche2',
      render: (val) => (
        <div className="text-[10px]">
          {val ? (
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ Unlocked Bank Tranche 2 & Closure
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-500 border border-slate-200">
              Holding Bank Tranche 2
            </span>
          )}
        </div>
      ),
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
          <h1 className="text-xl font-bold text-slate-900">DISCOM Net Metering & Synchronization</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bi-directional meter installation sign-off: The critical regulatory gateway unlocking Bank Loan Tranche 2 and Project Closure.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={netMeteringList}
        searchPlaceholder="Search net metering by project, customer, meter no..."
        searchKeys={['projectId', 'customerName', 'meterNumber', 'status']}
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
