import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Printer, Eye, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR } from '../../utils/formatters';

export default function ReceiptsPage() {
  const navigate = useNavigate();
  const { receipts, company } = useERP();

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const columns = [
    {
      header: 'Receipt Number',
      key: 'receiptNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
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
      header: 'Amount Received',
      key: 'amount',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600 text-sm">{formatINR(val)}</span>,
    },
    {
      header: 'Payment Channel',
      key: 'paymentMode',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="text-slate-800 text-xs font-medium">{val}</span>
          <span className="font-mono text-[10px] text-slate-400 block">{row.referenceNumber}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      key: 'date',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Official Payment Receipt Vouchers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential receipt vouchers issued to customers for advance and milestone collections.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/finance/payments')}
        >
          Record New Payment
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={receipts}
        searchPlaceholder="Search receipts by number, customer, project, UTR..."
        searchKeys={['receiptNumber', 'customerName', 'projectId', 'referenceNumber']}
        onRowClick={(row) => setSelectedReceipt(row)}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedReceipt(row)}
          >
            Voucher
          </Button>
        )}
      />

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title={`Official Money Receipt: ${selectedReceipt.receiptNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">{company.name}</h3>
              <p className="text-slate-500 text-[11px]">{company.address}</p>
              <p className="text-slate-600 font-mono text-[10px] mt-0.5">GSTIN: {company.gstin}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-[#163A5F]">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Date:</span>
                <span className="font-mono">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Received From:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Project:</span>
                <span className="font-mono">{selectedReceipt.projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode / UTR:</span>
                <span>{selectedReceipt.paymentMode} ({selectedReceipt.referenceNumber})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-emerald-700">
                <span>Amount Received:</span>
                <span>{formatINR(selectedReceipt.amount)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
