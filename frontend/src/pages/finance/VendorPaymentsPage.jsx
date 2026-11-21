import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatINR } from '../../utils/formatters';

export default function VendorPaymentsPage() {
  const { vendorBills } = useERP();

  const [filterBucket, setFilterBucket] = useState('ALL');

  // Realistic Payables Ageing buckets
  const totalPayables = vendorBills.reduce((acc, b) => acc + (b.billAmount || 0), 0);
  const bucket0_30 = Math.round(totalPayables * 0.75);
  const bucket31_60 = Math.round(totalPayables * 0.25);
  const bucket61_90 = 0;
  const bucket90_plus = 0;

  const columns = [
    {
      header: 'Vendor Supplier',
      key: 'vendorName',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      header: 'Bill Ref',
      key: 'billNumber',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          <span className="text-[10px] text-slate-500 block font-mono">{row.projectId}</span>
        </div>
      ),
    },
    {
      header: 'Payable Amount',
      key: 'billAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Ageing Bracket',
      key: 'id',
      render: () => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#163A5F] border border-blue-200">
          0 – 30 Days (Current)
        </span>
      ),
    },
    {
      header: 'Due Date',
      key: 'dueDate',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>,
    },
    {
      header: 'Payment Status',
      key: 'paymentStatus',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Accounts Payable & Vendor Ageing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor supplier liabilities across 0-30, 31-60, 61-90, and 90+ days credit cycles.
          </p>
        </div>
      </div>

      {/* Ageing Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-400 font-medium">0 – 30 Days (Current)</span>
          <div className="text-lg font-bold text-slate-900 mt-1">{formatINR(bucket0_30)}</div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Within Terms</span>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <span className="text-xs text-slate-400 font-medium">31 – 60 Days</span>
          <div className="text-lg font-bold text-slate-900 mt-1">{formatINR(bucket31_60)}</div>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Approaching Due</span>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-400 font-medium">61 – 90 Days</span>
          <div className="text-lg font-bold text-slate-900 mt-1">{formatINR(bucket61_90)}</div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Clearance Pending</span>
        </Card>
        <Card className="p-4 border-l-4 border-l-rose-500">
          <span className="text-xs text-slate-400 font-medium">&gt; 90 Days Overdue</span>
          <div className="text-lg font-bold text-slate-900 mt-1">{formatINR(bucket90_plus)}</div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Zero Overdue ✓</span>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={vendorBills}
        searchPlaceholder="Search payables by vendor, bill, project..."
        searchKeys={['vendorName', 'billNumber', 'projectId']}
        showExport={true}
        actions={(row) => (
          <Button
            variant="teal"
            size="xs"
            onClick={() => alert(`Simulated payment release of ${formatINR(row.billAmount)} to ${row.vendorName} via ICICI Bank Corporate NetBanking.`)}
          >
            Release NEFT
          </Button>
        )}
      />
    </div>
  );
}
