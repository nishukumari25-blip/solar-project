import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, Clock, ShieldCheck, ArrowUpRight, Upload } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

export default function SubsidyCreditPage() {
  const navigate = useNavigate();
  const { subsidies } = useERP();

  const columns = [
    {
      header: 'Application Ref',
      key: 'applicationNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Customer Beneficiary',
      key: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="font-mono text-slate-500 text-[11px] block">{row.projectId}</span>
        </div>
      ),
    },
    {
      header: 'Govt Subsidy Amount',
      key: 'approvedAmount',
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-600">{formatINR(val)}</span>,
    },
    {
      header: 'DBT Bank Account Status',
      key: 'currentStage',
      render: (val) => (
        <div className="text-xs">
          {val === 'Subsidy Credited to Customer' ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Credited to Customer Account via DBT
            </span>
          ) : (
            <span className="text-amber-600 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Awaiting National Portal DBT Release
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Company Accounting Status',
      key: 'id',
      render: () => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#163A5F] border border-blue-200">
          Independent of Company Revenue (DBT to Customer)
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Direct Subsidy Credit (DBT)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Post-closure customer support: Verify Central government subsidy transfers directly to customer bank accounts.
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Government Subsidy Accounting Isolation:</span>
          <p className="mt-0.5 text-[11px] text-emerald-800 leading-relaxed">
            MNRE rules mandate that PM Surya Ghar subsidy is credited directly to the customer's personal bank account linked with their electricity consumer number. The company does not record government subsidy as company revenue or accounts receivable, and subsidy credit is not a condition for Project Closure.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={subsidies}
        searchPlaceholder="Search subsidy credits by customer, application ref..."
        searchKeys={['applicationNumber', 'customerName', 'projectId']}
        onRowClick={(row) => navigate(`/projects/${row.projectId}`)}
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
