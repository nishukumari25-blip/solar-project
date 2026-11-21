import React, { useState } from 'react';
import { Check, X, ShieldCheck, AlertCircle, FileText, ShoppingBag, Clock } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function ApprovalsPage() {
  const { approvals, processApproval } = useERP();
  const { activeRole } = useAuth();

  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject'
  const [remarks, setRemarks] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    if (activeTab === 'ALL') return true;
    return a.status === activeTab;
  });

  const handleOpenAction = (appr, type) => {
    setSelectedApproval(appr);
    setActionType(type);
    setRemarks(type === 'approve' ? 'Approved by Owner.' : 'Rejected due to budget constraints.');
  };

  const handleConfirmAction = (e) => {
    e.preventDefault();
    if (!selectedApproval) return;

    processApproval(selectedApproval.id, actionType === 'approve', remarks);
    setSelectedApproval(null);
  };

  const columns = [
    {
      header: 'Module / Ref ID',
      key: 'refId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-semibold text-[#163A5F]">{val}</span>
          <div className="text-[11px] text-slate-500">{row.module}</div>
        </div>
      ),
    },
    {
      header: 'Customer / Project',
      key: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-900">{val || 'Company Order'}</span>
          {row.projectId && <span className="font-mono text-slate-400 text-[10px] block">{row.projectId}</span>}
        </div>
      ),
    },
    {
      header: 'Requested By & Date',
      key: 'requestedBy',
      render: (val, row) => (
        <div className="text-xs">
          <span className="text-slate-800 font-medium">{val}</span>
          <span className="text-slate-400 font-mono block text-[10px]">{row.requestDate}</span>
        </div>
      ),
    },
    {
      header: 'Approval Exception Reason',
      key: 'details',
      render: (val) => (
        <p className="text-xs text-slate-700 max-w-md line-clamp-2">{val}</p>
      ),
    },
    {
      header: 'Required Authority',
      key: 'approverRole',
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#163A5F] border border-blue-200">
          {val}
        </span>
      ),
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
          <h1 className="text-xl font-bold text-slate-900">Regulatory Approvals Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized decision portal for high quotation discounts, high-value purchase orders, and BOM variances.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#163A5F] font-semibold rounded-lg border border-blue-200">
            <ShieldCheck className="w-4 h-4" />
            Current Signer: {activeRole}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {['Pending', 'Approved', 'Rejected', 'ALL'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-[#163A5F] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab} {tab !== 'ALL' && `(${approvals.filter((a) => a.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredApprovals}
        searchPlaceholder="Search approvals by Ref ID, customer, module..."
        searchKeys={['refId', 'customerName', 'module', 'details']}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            {row.status === 'Pending' ? (
              <>
                <Button
                  variant="primary"
                  size="xs"
                  icon={Check}
                  onClick={() => handleOpenAction(row, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="xs"
                  icon={X}
                  onClick={() => handleOpenAction(row, 'reject')}
                >
                  Reject
                </Button>
              </>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                {row.remarks ? `Remarks: ${row.remarks}` : 'Processed'}
              </span>
            )}
          </div>
        )}
      />

      {/* Approval Decision Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={`Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}: ${selectedApproval.refId}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
            <div
              className={`p-3 rounded-lg border ${
                actionType === 'approve'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="font-bold block mb-1">
                {actionType === 'approve' ? 'Approve Exception Request' : 'Reject Exception Request'}
              </span>
              <p className="text-[11px] leading-relaxed">{selectedApproval.details}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Approver Remarks / Decision Justification *
              </label>
              <textarea
                rows={3}
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApproval(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={actionType === 'approve' ? 'primary' : 'danger'}
                size="sm"
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
