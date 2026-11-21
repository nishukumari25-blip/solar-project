import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Printer, Eye, CheckCircle2, DollarSign, Download } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR, formatDate } from '../../utils/formatters';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { invoices, company } = useERP();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const columns = [
    {
      header: 'Invoice Number',
      key: 'invoiceNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Project & Customer',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{row.customerName}</span>
          <span className="font-mono text-slate-500 text-[11px] block">{val} ({row.systemCapacityKW} kW)</span>
        </div>
      ),
    },
    {
      header: 'Taxable Amount',
      key: 'taxableAmount',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700">{formatINR(val)}</span>,
    },
    {
      header: 'GST (12%)',
      key: 'totalTax',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-mono text-xs">{formatINR(val)}</span>,
    },
    {
      header: 'Invoice Total',
      key: 'grandTotal',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Invoice Date',
      key: 'invoiceDate',
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
          <h1 className="text-xl font-bold text-slate-900">GST Tax Invoices Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single final tax invoice for turnkey solar EPC installation with serialized equipment manifest.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices by invoice number, customer, project..."
        searchKeys={['invoiceNumber', 'customerName', 'projectId']}
        onRowClick={(row) => setSelectedInvoice(row)}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedInvoice(row)}
          >
            View Invoice
          </Button>
        )}
      />

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs font-sans">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{company.name}</h3>
                <p className="text-slate-500 text-[11px] max-w-sm">{company.address}</p>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">GSTIN: {company.gstin} | PAN: {company.pan}</p>
                <p className="text-slate-500 text-[11px]">State: 08-Rajasthan | State Code: 08</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-[#163A5F] block font-mono">{selectedInvoice.invoiceNumber}</span>
                <span className="text-[11px] text-slate-500 block font-mono">Date: {selectedInvoice.invoiceDate}</span>
                <span className="text-[11px] text-slate-500 block font-mono">Ref Project: {selectedInvoice.projectId}</span>
                <div className="mt-1"><StatusBadge status={selectedInvoice.status} /></div>
              </div>
            </div>

            {/* Bill To */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer (Bill to & Ship to):</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoice.customerName}</p>
              <p className="text-slate-600 text-[11px]">Place of Supply: Rajasthan (08)</p>
            </div>

            {/* Turnkey Item Description (Lump-sum EPC contract) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description of Goods & Services</th>
                    <th className="py-2.5 px-3">SAC / HSN</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Taxable Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        Design, Supply, Erection, Testing & Commissioning of {selectedInvoice.systemCapacityKW} kWp Grid-Connected Solar Rooftop PV Power Plant
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Composite supply of Works Contract for rooftop solar power generation under MNRE PM Surya Ghar guidelines.
                      </p>
                    </td>
                    <td className="py-3 px-3 font-mono">SAC 9954</td>
                    <td className="py-3 px-3 text-right font-semibold">1 Job</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{formatINR(selectedInvoice.taxableAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Serialized Equipment Manifest (Without per-item prices) */}
            <div className="bg-slate-50/60 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">Installed Equipment Serial Numbers Manifest</span>
              <p className="text-[11px] text-slate-500">
                In accordance with solar EPC contract practice, individual equipment prices are bundled into the turnkey contract value. Serial numbers are enumerated below for MNRE warranty & DISCOM records:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 font-mono text-[11px] text-slate-700">
                <div className="p-1 bg-white border border-slate-200 rounded">Modules: 10 Nos (TP-MOD-26-00001 to 10)</div>
                <div className="p-1 bg-white border border-slate-200 rounded">Inverter: 5kW Dual MPPT (SOL-INV-26-0041)</div>
                <div className="p-1 bg-white border border-slate-200 rounded">Structure: Pre-fab Galvanized Iron (Set #81)</div>
              </div>
            </div>

            {/* Tax Computation Box */}
            <div className="flex justify-end">
              <div className="w-72 space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Subtotal:</span>
                  <span className="font-medium text-slate-900">{formatINR(selectedInvoice.taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (6%):</span>
                  <span className="font-mono text-slate-800">{formatINR(selectedInvoice.cgst || selectedInvoice.totalTax / 2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (6%):</span>
                  <span className="font-mono text-slate-800">{formatINR(selectedInvoice.sgst || selectedInvoice.totalTax / 2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#163A5F]">
                  <span>Total Invoice Amount:</span>
                  <span>{formatINR(selectedInvoice.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print / Download Tax Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
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
