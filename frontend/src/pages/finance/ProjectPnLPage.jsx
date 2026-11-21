import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Lock, DollarSign, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatINR } from '../../utils/formatters';

export default function ProjectPnLPage() {
  const navigate = useNavigate();
  const { projectPnl, projects } = useERP();

  const totalRevenue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
  const totalCost = projectPnl.reduce((acc, p) => acc + (p.totalCost || p.contractValue * 0.76), 0);
  const totalProfit = totalRevenue - totalCost;
  const blendedMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

  const columns = [
    {
      header: 'Project ID',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          <span className="font-semibold text-slate-800 text-xs block">{row.customerName}</span>
        </div>
      ),
    },
    {
      header: 'Contract Revenue',
      key: 'contractValue',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Material & BOS Cost',
      key: 'moduleCost',
      render: (val, row) => (
        <span className="font-medium text-slate-700">{formatINR(row.totalCost ? row.totalCost * 0.8 : row.contractValue * 0.65)}</span>
      ),
    },
    {
      header: 'Labor & Civil',
      key: 'laborCost',
      render: (val, row) => (
        <span className="font-medium text-slate-700">{formatINR(row.laborCost || 22000)}</span>
      ),
    },
    {
      header: 'Gross Profit',
      key: 'grossProfit',
      sortable: true,
      render: (val, row) => {
        const profit = val || (row.contractValue - (row.totalCost || row.contractValue * 0.76));
        return <span className="font-bold text-emerald-600">{formatINR(profit)}</span>;
      },
    },
    {
      header: 'Gross Margin %',
      key: 'grossMarginPct',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {val || '22.4'}%
        </span>
      ),
    },
    {
      header: 'Accounting Lock',
      key: 'status',
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-max ${
            val?.includes('Locked')
              ? 'bg-slate-100 text-slate-700 border border-slate-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {val?.includes('Locked') && <Lock className="w-3 h-3" />}
          {val || 'Active'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Costing & Profit & Loss Statement</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time project gross margin analysis across bill of materials, labor, transport, and site execution.
          </p>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#163A5F]">
          <span className="text-xs text-slate-400 font-medium">Total Contract Revenue</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalRevenue)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-400 font-medium">Total Execution Costs (COGS)</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalCost)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-400 font-medium">Realized Gross Profit</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalProfit)}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <span className="text-xs text-slate-400 font-medium">Blended Gross Margin</span>
          <div className="text-xl font-bold text-[#163A5F] mt-1">{blendedMargin}%</div>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={projectPnl}
        searchPlaceholder="Search project P&L by ID, customer..."
        searchKeys={['projectId', 'customerName', 'status']}
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
