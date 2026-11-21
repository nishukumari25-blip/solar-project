import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, AlertTriangle, Clock, CheckCircle2, ArrowUpRight, Search } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

const STAGES = [
  'Application Registered',
  'Feasibility Approved',
  'Installation Uploaded',
  'DISCOM Inspection',
  'Net Metering Done',
  'Subsidy Claim Submitted',
  'Subsidy Credited to Customer',
];

export default function SubsidyApplicationsPage() {
  const navigate = useNavigate();
  const { subsidies, updateSubsidyStage } = useERP();

  const [filterStage, setFilterStage] = useState('ALL');

  const filtered = subsidies.filter((s) => {
    if (filterStage === 'ALL') return true;
    if (filterStage === 'STUCK') return s.daysInStage >= 45;
    return s.currentStage === filterStage;
  });

  const columns = [
    {
      header: 'Application No.',
      key: 'applicationNumber',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          <span className="font-mono text-[10px] text-slate-500 block">CA: {row.consumerNumber}</span>
        </div>
      ),
    },
    {
      header: 'Project & Customer',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{row.customerName}</span>
          <span className="font-mono text-slate-500 text-[11px] block">{val}</span>
        </div>
      ),
    },
    {
      header: 'Current Stage',
      key: 'currentStage',
      sortable: true,
      render: (val, row) => (
        <div>
          <StatusBadge status={val} />
          {row.daysInStage >= 45 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded uppercase">
              ≥45d Stuck
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Time in Stage',
      key: 'daysInStage',
      sortable: true,
      render: (val) => (
        <span className={`font-mono text-xs font-semibold ${val >= 45 ? 'text-rose-600' : 'text-slate-600'}`}>
          {val} Days
        </span>
      ),
    },
    {
      header: 'Approved Subsidy',
      key: 'approvedAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600">{formatINR(val)}</span>,
    },
    {
      header: 'Update Stage',
      key: 'id',
      render: (val, row) => (
        <select
          value={row.currentStage}
          onChange={(e) => updateSubsidyStage(row.id, e.target.value)}
          className="text-xs px-2 py-1 border border-slate-200 rounded bg-white text-slate-700 font-medium focus:outline-none"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">National Portal Subsidy Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor the 7-stage PM Surya Ghar portal workflow and track liaison bottleneck alerts.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setFilterStage('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            filterStage === 'ALL' ? 'bg-[#163A5F] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Applications ({subsidies.length})
        </button>
        <button
          onClick={() => setFilterStage('STUCK')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            filterStage === 'STUCK' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Stuck ≥ 45 Days ({subsidies.filter((s) => s.daysInStage >= 45).length})
        </button>
        {STAGES.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStage(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              filterStage === st ? 'bg-[#163A5F] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search subsidy by app number, customer, consumer CA..."
        searchKeys={['applicationNumber', 'customerName', 'consumerNumber', 'projectId']}
        onRowClick={(row) => navigate(`/projects/${row.projectId}`)}
        showExport={true}
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
