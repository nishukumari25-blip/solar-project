import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function ProjectMaterialsPage() {
  const navigate = useNavigate();
  const { projectMaterials } = useERP();

  const columns = [
    {
      header: 'Project ID',
      key: 'projectId',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Category & Spec',
      key: 'category',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="text-[11px] text-slate-500 block">{row.specification}</span>
        </div>
      ),
    },
    {
      header: 'BOM Estimate',
      key: 'bomQty',
      sortable: true,
      render: (val, row) => <span className="font-medium text-slate-700">{val} {row.unit}</span>,
    },
    {
      header: 'PO Ordered',
      key: 'poQty',
      sortable: true,
      render: (val, row) => <span className="font-medium text-slate-700">{val} {row.unit}</span>,
    },
    {
      header: 'GRN Received',
      key: 'grnQty',
      sortable: true,
      render: (val, row) => <span className="font-bold text-slate-900">{val} {row.unit}</span>,
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
          <h1 className="text-xl font-bold text-slate-900">Project Materials Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct-to-site equipment tracking and consumption registers across all projects.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projectMaterials}
        searchPlaceholder="Search materials by project, category, spec..."
        searchKeys={['projectId', 'category', 'specification', 'status']}
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
