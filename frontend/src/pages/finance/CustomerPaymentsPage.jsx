import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Plus, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Receipt } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR } from '../../utils/formatters';

export default function CustomerPaymentsPage() {
  const navigate = useNavigate();
  const { customerPayments, projects, recordCustomerPayment } = useERP();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: projects[0]?.projectId || 'PRJ-26-0001',
    amount: 50000,
    paymentMode: 'Bank Transfer / NEFT',
    referenceNumber: 'UTR-HDFC-991823',
    notes: 'Stage payment release',
  });

  const selectedProject = projects.find((p) => p.projectId === formData.projectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      recordCustomerPayment({
        projectId: formData.projectId,
        customerName: selectedProject?.customerName || 'Customer',
        amount: Number(formData.amount),
        paymentMode: formData.paymentMode,
        referenceNumber: formData.referenceNumber,
        notes: formData.notes,
      });

      alert('Payment recorded and receipt generated!');
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to record payment.');
    }
  };

  const columns = [
    {
      header: 'Payment ID',
      key: 'id',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono font-bold text-[#163A5F]">{row.referenceNumber || val}</span>
      ),
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
      header: 'Milestone / Purpose',
      key: 'milestoneLabel',
      render: (val, row) => (
        <span className="text-slate-700 text-xs">{val || row.notes || 'Installation Payment'}</span>
      ),
    },
    {
      header: 'Amount Received',
      key: 'amount',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600 text-sm">{formatINR(val)}</span>,
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
          <h1 className="text-xl font-bold text-slate-900">Customer Payments & Receivables</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record customer advance payments, milestone collections, and generate payment receipts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Receipt}
            onClick={() => navigate('/finance/receipts')}
          >
            Receipts Register
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            Record Payment
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={customerPayments}
        searchPlaceholder="Search payments by project, customer, UTR..."
        searchKeys={['projectId', 'customerName', 'referenceNumber', 'paymentMode']}
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

      {/* Record Payment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Customer Payment Receipt"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Target Project *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.projectId}>
                  {p.projectId} — {p.customerName} (Bal: ₹{p.balanceDue.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
            <input
              type="number"
              min="1"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Channel *</label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
              <option value="UPI / QR Code">UPI / QR Code</option>
              <option value="Cheque / DD">Cheque / Demand Draft</option>
              <option value="Bank Loan Disbursement">Bank Loan Direct Disbursement</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">UTR / Cheque Reference *</label>
            <input
              type="text"
              required
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Issue Receipt Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
