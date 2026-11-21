import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowUpRight,
  Filter,
  Eye,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const delayedFilterParam = searchParams.get('delayed') === 'true';

  const { projects } = useERP();

  const [statusFilter, setStatusFilter] = useState(delayedFilterParam ? 'DELAYED' : 'ALL');

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'DELAYED') return p.isDelayed;
    return p.status === statusFilter;
  });

  const columns = [
    {
      header: 'Project ID',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          {row.isDelayed && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded uppercase">
              Delayed
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Customer & Site',
      key: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-900">{val}</span>
          <span className="text-[11px] text-slate-500 block truncate max-w-xs">{row.siteAddress}</span>
        </div>
      ),
    },
    {
      header: 'Capacity',
      key: 'systemCapacityKW',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val} kW</span>,
    },
    {
      header: 'Payment Mode',
      key: 'paymentMode',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      header: 'Contract Value',
      key: 'contractValue',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Balance Due',
      key: 'balanceDue',
      sortable: true,
      render: (val) => (
        <span className={`font-semibold ${val > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {formatINR(val)}
        </span>
      ),
    },
    {
      header: 'Subsidy Stage',
      key: 'subsidyStage',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Solar EPC Projects Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end execution monitoring, milestone gating, material consumption, and DISCOM synchronization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects/milestones')}
          >
            Milestones Timeline
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {['ALL', 'In Progress', 'Closed', 'DELAYED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              statusFilter === st
                ? st === 'DELAYED'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#163A5F] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st === 'DELAYED' ? 'Delayed Projects' : st}{' '}
            {st === 'DELAYED'
              ? `(${projects.filter((p) => p.isDelayed).length})`
              : st !== 'ALL' && `(${projects.filter((p) => p.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProjects}
        searchPlaceholder="Search projects by ID, customer name, location..."
        searchKeys={['projectId', 'customerName', 'siteAddress', 'subsidyStage']}
        onRowClick={(row) => navigate(`/projects/${row.projectId}`)}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={ArrowUpRight}
            onClick={() => navigate(`/projects/${row.projectId}`)}
          >
            Workspace
          </Button>
        )}
      />
    </div>
  );
}
