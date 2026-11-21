import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, AlertTriangle, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

export default function BankLoansPage() {
  const navigate = useNavigate();
  const { bankLoans } = useERP();

  const columns = [
    {
      header: 'Sanction Ref',
      key: 'sanctionRef',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#163A5F]">{val}</span>
          <span className="text-[11px] text-slate-500 block">{row.bankName}</span>
        </div>
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
      header: 'Sanctioned Loan',
      key: 'sanctionedAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-slate-900">{formatINR(val)}</span>,
    },
    {
      header: 'Tranche 1 (Sanction)',
      key: 'tranche1Amount',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{formatINR(val)}</span>
          <div className="mt-0.5"><StatusBadge status={row.tranche1Status} /></div>
        </div>
      ),
    },
    {
      header: 'Tranche 2 (Post-Net Metering)',
      key: 'tranche2Amount',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{formatINR(val)}</span>
          <div className="mt-0.5"><StatusBadge status={row.tranche2Status} /></div>
        </div>
      ),
    },
    {
      header: 'Disbursement Health',
      key: 'daysInProcessing',
      render: (val) => (
        <div>
          {val >= 21 ? (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" /> ≥21d Follow-up
            </span>
          ) : (
            <span className="text-slate-500 font-mono text-xs">{val || 5} Days</span>
          )}
        </div>
      ),
    },
    {
      header: 'Overall Status',
      key: 'status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Solar Bank Loans & 2-Tranche Disbursements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor bank loan sanction agreements and track stage-gated disbursements from financing partners.
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
        <Landmark className="w-5 h-5 text-[#163A5F] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">2-Tranche Loan Structure Rules:</span>
          <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-800 text-[11px]">
            <li><strong>Tranche 1:</strong> Disbursed directly to Solaris EPC upon loan sanction and tripartite agreement.</li>
            <li><strong>Tranche 2:</strong> Disbursed only after Work Completion Report (WCR) and DISCOM Net Metering synchronization.</li>
            <li>Applications taking ≥21 days trigger an automated telecaller reminder to visit the bank branch.</li>
          </ul>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bankLoans}
        searchPlaceholder="Search bank loans by sanction ref, customer, bank..."
        searchKeys={['sanctionRef', 'customerName', 'bankName', 'projectId']}
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
