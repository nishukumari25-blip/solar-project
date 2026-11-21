import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, CheckCircle2, AlertTriangle, Eye, ShieldCheck, DollarSign } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR } from '../../utils/formatters';

export default function VendorBillsPage() {
  const navigate = useNavigate();
  const { vendorBills } = useERP();

  const [selectedBill, setSelectedBill] = useState(null);

  const columns = [
    {
      header: 'Bill Number',
      key: 'billNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Vendor & Project',
      key: 'vendorName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <span className="font-mono text-slate-500 text-[11px] block">{row.projectId} (PO: {row.poNumber})</span>
        </div>
      ),
    },
    {
      header: 'Billed Amount',
      key: 'billAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: '3-Way Match Status',
      key: 'matchStatus',
      sortable: true,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            val === 'Matched 100%'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {val}
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
          <h1 className="text-xl font-bold text-slate-900">Vendor Bills & 3-Way Match Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated accounts payable audit: Verify PO order rates, rooftop GRN quantities, and supplier tax invoices.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={vendorBills}
        searchPlaceholder="Search bills by bill number, vendor, PO..."
        searchKeys={['billNumber', 'vendorName', 'poNumber', 'projectId']}
        onRowClick={(row) => setSelectedBill(row)}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedBill(row)}
          >
            Audit Match
          </Button>
        )}
      />

      {/* 3-Way Match Modal */}
      {selectedBill && (
        <Modal
          isOpen={!!selectedBill}
          onClose={() => setSelectedBill(null)}
          title={`3-Way Match Audit: ${selectedBill.billNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{selectedBill.vendorName}</span>
                <p className="text-slate-500 text-[11px]">PO Ref: {selectedBill.poNumber} | Project: {selectedBill.projectId}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                {selectedBill.matchStatus}
              </span>
            </div>

            {/* 3-Way Comparison Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Audit Dimension</th>
                    <th className="py-2.5 px-3">1. PO Approved</th>
                    <th className="py-2.5 px-3">2. Site GRN Received</th>
                    <th className="py-2.5 px-3">3. Vendor Tax Bill</th>
                    <th className="py-2.5 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Quantity</td>
                    <td className="py-2.5 px-3">10 Nos</td>
                    <td className="py-2.5 px-3">10 Nos</td>
                    <td className="py-2.5 px-3">10 Nos</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">100% Match ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Unit Rate (₹)</td>
                    <td className="py-2.5 px-3">₹9,800</td>
                    <td className="py-2.5 px-3 font-mono">N/A (Qty only)</td>
                    <td className="py-2.5 px-3">₹9,800</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">100% Match ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Total Value</td>
                    <td className="py-2.5 px-3 font-bold">{formatINR(selectedBill.billAmount)}</td>
                    <td className="py-2.5 px-3 text-slate-400">—</td>
                    <td className="py-2.5 px-3 font-bold">{formatINR(selectedBill.billAmount)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">Approved ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBill(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Payment authorized for ${selectedBill.billNumber}. Pushed to Vendor Payments queue.`);
                  setSelectedBill(null);
                }}
              >
                Authorize Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
