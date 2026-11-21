import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function LeftoverMaterialsPage() {
  const navigate = useNavigate();
  const { leftovers, setLeftovers, projects, addNotification } = useERP();

  const [transferModalItem, setTransferModalItem] = useState(null);
  const [targetProject, setTargetProject] = useState(projects[1]?.projectId || 'PRJ-26-0002');

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferModalItem) return;

    setLeftovers((prev) =>
      prev.map((item) =>
        item.id === transferModalItem.id
          ? {
              ...item,
              status: 'Transferred',
              transferredToProject: targetProject,
            }
          : item
      )
    );

    addNotification(
      'Leftovers Transferred',
      `${transferModalItem.quantity} ${transferModalItem.unit} of ${transferModalItem.itemDescription} transferred to ${targetProject}.`,
      'procurement',
      '/procurement/leftovers'
    );

    alert(`Leftover material transferred to ${targetProject} with PM approval!`);
    setTransferModalItem(null);
  };

  const columns = [
    {
      header: 'Source Project',
      key: 'sourceProjectId',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Material Description',
      key: 'itemDescription',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Leftover Surplus Qty',
      key: 'quantity',
      render: (val, row) => (
        <span className="font-bold text-amber-600">{val} {row.unit}</span>
      ),
    },
    {
      header: 'Condition',
      key: 'condition',
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {val}
        </span>
      ),
    },
    {
      header: 'Destination / Status',
      key: 'status',
      render: (val, row) => (
        <div>
          <StatusBadge status={val} />
          {row.transferredToProject && (
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              Transferred to {row.transferredToProject}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leftover Materials Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Surplus cables, clamps, and hardware tracking for inter-site transfers or vendor return debit notes.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leftovers}
        searchPlaceholder="Search leftovers by project or item description..."
        searchKeys={['sourceProjectId', 'itemDescription', 'status']}
        actions={(row) => (
          <div className="flex items-center justify-end">
            {row.status === 'Available at Site' ? (
              <Button
                variant="teal"
                size="xs"
                icon={ArrowRight}
                onClick={() => setTransferModalItem(row)}
              >
                Transfer to Project
              </Button>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">Reconciled</span>
            )}
          </div>
        )}
      />

      {/* Transfer Modal */}
      {transferModalItem && (
        <Modal
          isOpen={!!transferModalItem}
          onClose={() => setTransferModalItem(null)}
          title="Transfer Site Leftover Material"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleTransfer} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <span className="text-slate-400 block text-[11px]">Material to Transfer:</span>
              <p className="font-bold text-slate-800">{transferModalItem.itemDescription}</p>
              <p className="text-amber-600 font-semibold">{transferModalItem.quantity} {transferModalItem.unit} ({transferModalItem.condition})</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Destination Project *
              </label>
              <select
                value={targetProject}
                onChange={(e) => setTargetProject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.projectId}>
                    {p.projectId} — {p.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTransferModalItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Approve Transfer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
