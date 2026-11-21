import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  CheckCircle,
  Eye,
  Printer,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR, formatDate } from '../../utils/formatters';

export default function QuotationsListPage() {
  const navigate = useNavigate();
  const { quotations, convertQuotationToOrder, company } = useERP();

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [convertModalQuote, setConvertModalQuote] = useState(null);

  // Conversion Form State
  const [conversionParams, setConversionParams] = useState({
    paymentMode: 'Self-funded',
    financier: '',
    siteAddress: '',
    targetDate: '',
    advanceReceivedNow: 50000,
    referenceNumber: 'UPI-TXN-902182',
  });

  const handleOpenConvert = (quote) => {
    setConvertModalQuote(quote);
    setConversionParams({
      paymentMode: 'Self-funded',
      financier: '',
      siteAddress: 'Plot 42, Vaishali Nagar, Jaipur',
      targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      advanceReceivedNow: Math.round(quote.grandTotal * 0.2), // 20% advance default
      referenceNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

  const handleExecuteConversion = (e) => {
    e.preventDefault();
    if (!convertModalQuote) return;

    try {
      const newProject = convertQuotationToOrder(convertModalQuote.id, conversionParams);
      alert(`Success! Quotation ${convertModalQuote.quoteNumber} converted to Project ${newProject.projectId} with 7 milestones and procurement requisitions generated!`);
      setConvertModalQuote(null);
      navigate(`/projects/${newProject.projectId}`);
    } catch (err) {
      alert(err.message || 'Failed to convert quotation to order.');
    }
  };

  const columns = [
    {
      header: 'Quote Number',
      key: 'quoteNumber',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-semibold text-[#163A5F]">{val}</span>
          <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-600 rounded">
            {row.version}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-900">{val}</span>,
    },
    {
      header: 'Capacity',
      key: 'systemCapacityKW',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val} kW</span>,
    },
    {
      header: 'Grand Total',
      key: 'grandTotal',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Est. Subsidy',
      key: 'totalSubsidy',
      sortable: true,
      render: (val) => <span className="text-emerald-600 font-medium">{formatINR(val)}</span>,
    },
    {
      header: 'Net Customer Cost',
      key: 'netCustomerCost',
      sortable: true,
      render: (val) => <span className="font-bold text-[#163A5F]">{formatINR(val)}</span>,
    },
    {
      header: 'Validity',
      key: 'validityDate',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-xs">{val}</span>,
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
          <h1 className="text-xl font-bold text-slate-900">Quotation Register & Proposals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage cost estimates, subsidy transparency, discount approvals, and atomic order conversion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/sales/new-quote')}
          >
            Create New Quotation
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={quotations}
        searchPlaceholder="Search quotations by number or customer..."
        searchKeys={['quoteNumber', 'customerName']}
        onRowClick={(row) => setSelectedQuote(row)}
        showExport={true}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="xs"
              icon={Eye}
              onClick={() => setSelectedQuote(row)}
            >
              View
            </Button>

            {row.status !== 'Converted to Order' ? (
              <Button
                variant="teal"
                size="xs"
                icon={Briefcase}
                onClick={() => handleOpenConvert(row)}
              >
                Convert to Order
              </Button>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Converted
              </span>
            )}
          </div>
        )}
      />

      {/* Quotation Detail / Printable Modal */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Solar Installation Proposal: ${selectedQuote.quoteNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{company.name}</h3>
                <p className="text-slate-500 text-[11px]">{company.address}</p>
                <p className="text-slate-500 text-[11px]">GSTIN: {company.gstin} | PAN: {company.pan}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={selectedQuote.status} />
                <p className="text-slate-500 font-mono text-[11px] mt-1">Date: {selectedQuote.date}</p>
                <p className="text-slate-500 font-mono text-[11px]">Valid Until: {selectedQuote.validityDate}</p>
              </div>
            </div>

            {/* Customer Box */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-medium text-[10px] uppercase">Quotation Prepared For:</span>
              <p className="font-bold text-slate-900 text-sm">{selectedQuote.customerName}</p>
              <p className="text-slate-600 mt-0.5">Proposed Rooftop Solar Capacity: <strong className="text-[#163A5F]">{selectedQuote.systemCapacityKW} kWp</strong></p>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Base System Price:</span>
                <span className="font-medium">{formatINR(selectedQuote.basePrice || selectedQuote.grandTotal)}</span>
              </div>
              {selectedQuote.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Special Discount Applied:</span>
                  <span className="font-medium">- {formatINR(selectedQuote.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (CGST + SGST):</span>
                <span className="font-medium">{formatINR(selectedQuote.gstAmount || 0)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                <span>Company Contract Value (Grand Total):</span>
                <span className="text-[#163A5F]">{formatINR(selectedQuote.grandTotal)}</span>
              </div>
            </div>

            {/* Subsidy Transparency Callout */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>Central PM Surya Ghar Subsidy (Credited to Customer Bank):</span>
                <span>{formatINR(selectedQuote.totalSubsidy)}</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                * Note: In compliance with MNRE regulations, government subsidy is directly transferred by DBT into the customer's Aadhaar-linked bank account post Net Metering. It is not deducted from company invoice dues.
              </p>
              <div className="pt-1 flex items-center justify-between font-bold text-slate-900 border-t border-emerald-200">
                <span>Effective Net Investment by Customer:</span>
                <span className="text-emerald-700 text-sm">{formatINR(selectedQuote.netCustomerCost)}</span>
              </div>
            </div>

            {/* Instalment Schedule */}
            {selectedQuote.instalments && selectedQuote.instalments.length > 0 && (
              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">Payment Instalment Milestone Schedule</span>
                <div className="space-y-1.5">
                  {selectedQuote.instalments.map((inst, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
                      <span>Stage {inst.milestoneNumber}: {inst.label} ({inst.percentage}%)</span>
                      <span className="font-bold text-slate-800">{formatINR(inst.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print / Save PDF
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuote(null)}
                >
                  Close
                </Button>
                {selectedQuote.status !== 'Converted to Order' && (
                  <Button
                    variant="teal"
                    size="sm"
                    icon={Briefcase}
                    onClick={() => {
                      const q = selectedQuote;
                      setSelectedQuote(null);
                      handleOpenConvert(q);
                    }}
                  >
                    Convert to Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ATOMIC CONVERT TO ORDER MODAL */}
      {convertModalQuote && (
        <Modal
          isOpen={!!convertModalQuote}
          onClose={() => setConvertModalQuote(null)}
          title={`Convert Quotation ${convertModalQuote.quoteNumber} to Active Project`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleExecuteConversion} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg">
              <p className="font-semibold">Atomic Project Initialization Trigger:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-blue-800">
                <li>Generates sequential Project Code (e.g. PRJ-26-0006)</li>
                <li>Initializes all 7 sequential installation milestones</li>
                <li>Generates BOM-based Purchase Requisitions (PR) for procurement</li>
                <li>Initializes subsidy tracker at Stage 1 (Application Registered)</li>
                <li>Records advance customer payment receipt</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  disabled
                  value={convertModalQuote.customerName}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  System Capacity
                </label>
                <input
                  type="text"
                  disabled
                  value={`${convertModalQuote.systemCapacityKW} kWp`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Financing Mode *
                </label>
                <select
                  value={conversionParams.paymentMode}
                  onChange={(e) => setConversionParams({ ...conversionParams, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Self-funded">Self-funded (100% Direct Customer Payments)</option>
                  <option value="Bank loan">Bank loan (Sanctioned Solar Loan)</option>
                  <option value="Loan + margin money">Loan + margin money (Customer Margin + Bank Tranches)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Financier / Bank Name (If Loan)
                </label>
                <input
                  type="text"
                  value={conversionParams.financier}
                  onChange={(e) => setConversionParams({ ...conversionParams, financier: e.target.value })}
                  placeholder="e.g. State Bank of India / Canara"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Advance Payment Collected (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={conversionParams.advanceReceivedNow}
                  onChange={(e) => setConversionParams({ ...conversionParams, advanceReceivedNow: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-[#163A5F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Reference / UTR
                </label>
                <input
                  type="text"
                  value={conversionParams.referenceNumber}
                  onChange={(e) => setConversionParams({ ...conversionParams, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Installation Site Address *
                </label>
                <input
                  type="text"
                  required
                  value={conversionParams.siteAddress}
                  onChange={(e) => setConversionParams({ ...conversionParams, siteAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Commissioning Date
                </label>
                <input
                  type="date"
                  value={conversionParams.targetDate}
                  onChange={(e) => setConversionParams({ ...conversionParams, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConvertModalQuote(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Briefcase}
              >
                Confirm & Launch Project
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
