import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function PurchaseRequisitionsPage() {
  const navigate = useNavigate();
  const { prs } = useERP();

  const columns = [
    {
      header: 'PR Number',
      key: 'prNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Project Ref',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-semibold text-slate-800">{val}</span>
          <span className="text-[11px] text-slate-500 block">{row.customerName}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'itemCategory',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      header: 'Required Quantity',
      key: 'quantityRequired',
      render: (val, row) => (
        <span className="font-semibold text-slate-900">{val} {row.unit}</span>
      ),
    },
    {
      header: 'Leftover Stock Offset',
      key: 'leftoverOffsetQty',
      render: (val, row) => (
        <span className="text-emerald-700 font-medium">
          {val > 0 ? `-${val} ${row.unit} (Leftover)` : '0 (Direct Procurement)'}
        </span>
      ),
    },
    {
      header: 'Net Order Qty',
      key: 'netOrderQty',
      sortable: true,
      render: (val, row) => (
        <span className="font-bold text-[#163A5F]">{val || row.quantityRequired} {row.unit}</span>
      ),
    },
    {
      header: 'Date',
      key: 'date',
      sortable: true,
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
          <h1 className="text-xl font-bold text-slate-900">Purchase Requisitions (PR)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            BOM-generated material requirements deducted by available site leftovers for direct-to-site purchasing.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={ShoppingBag}
          onClick={() => navigate('/procurement/purchase-orders')}
        >
          View Purchase Orders
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={prs}
        searchPlaceholder="Search PRs by number, project ID, customer..."
        searchKeys={['prNumber', 'projectId', 'customerName', 'itemCategory']}
        actions={(row) => (
          <Button
            variant="teal"
            size="xs"
            onClick={() => navigate(`/procurement/purchase-orders?prId=${row.id}`)}
          >
            Create PO
          </Button>
        )}
      />
    </div>
  );
}
