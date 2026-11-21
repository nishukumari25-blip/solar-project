import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Calendar, ArrowUpRight, Filter } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function MilestonesPage() {
  const navigate = useNavigate();
  const { milestones } = useERP();

  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = milestones.filter((m) => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  const columns = [
    {
      header: 'Project ID',
      key: 'projectId',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Milestone Step',
      key: 'sequence',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">Step {val}: {row.name}</span>
          <span className="text-[11px] text-slate-400 block">{row.description}</span>
        </div>
      ),
    },
    {
      header: 'Target Completion',
      key: 'targetDate',
      sortable: true,
      render: (val) => <span className="font-mono text-slate-600 text-xs">{val || '2026-04-10'}</span>,
    },
    {
      header: 'Completed Date',
      key: 'completedDate',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-xs text-emerald-700">
          {val || '—'}
        </span>
      ),
    },
    {
      header: 'Photo Proof',
      key: 'photoUploaded',
      render: (val, row) => (
        <span className="text-[11px] text-slate-500">
          {row.photoRequired ? (val ? '✓ Uploaded' : 'Pending') : 'N/A'}
        </span>
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
          <h1 className="text-xl font-bold text-slate-900">Installation Milestones Monitor</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-project tracking of the 7 sequential execution gates.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/projects/all')}
        >
          View Projects List
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {['ALL', 'In Progress', 'Completed', 'Pending'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === st
                ? 'bg-[#163A5F] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st} {st !== 'ALL' && `(${milestones.filter((m) => m.status === st).length})`}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search milestones by project ID or name..."
        searchKeys={['projectId', 'name', 'status']}
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
