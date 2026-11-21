import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageCheck,
  Plus,
  Barcode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  MapPin,
  FileText,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProofPhotoUpload from '../../components/common/ProofPhotoUpload';

export default function GRNPage() {
  const navigate = useNavigate();
  const { grns, addGRN, pos, projects, serials } = useERP();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    poId: pos[0]?.id || '',
    challanNumber: 'CH-26-88192',
    deliveryDate: new Date().toISOString().split('T')[0],
    receivedQuantity: 10,
    itemCategory: 'Solar PV Modules',
    serialNumbersText: 'TP-MOD-26-00101\nTP-MOD-26-00102\nTP-MOD-26-00103\nTP-MOD-26-00104\nTP-MOD-26-00105',
    remarks: 'Delivered in good condition without physical damages or glass fractures.',
  });

  const [challanPhoto, setChallanPhoto] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedPO = pos.find((p) => p.id === formData.poId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPO) {
      setErrorMsg('Please select a Purchase Order.');
      return;
    }

    // Parse serial numbers
    const parsedSerials = formData.serialNumbersText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const created = addGRN({
        poId: selectedPO.id,
        poNumber: selectedPO.poNumber,
        projectId: selectedPO.projectId,
        vendorName: selectedPO.vendorName,
        challanNumber: formData.challanNumber,
        deliveryDate: formData.deliveryDate,
        receivedQuantity: Number(formData.receivedQuantity),
        itemCategory: formData.itemCategory,
        serialNumbers: parsedSerials,
        challanPhotoUploaded: !!challanPhoto,
        remarks: formData.remarks,
      });

      alert(`Site GRN ${created.grnNumber} generated successfully! Serials verified and Milestone 2 unlocked.`);
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process Site GRN.');
    }
  };

  const columns = [
    {
      header: 'GRN Number',
      key: 'grnNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Project & Site Location',
      key: 'projectId',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-semibold text-slate-900">{val}</span>
      ),
    },
    {
      header: 'PO Ref',
      key: 'poNumber',
      sortable: true,
      render: (val) => <span className="font-mono text-slate-600 text-xs">{val}</span>,
    },
    {
      header: 'Vendor & Challan',
      key: 'vendorName',
      render: (val, row) => (
        <div>
          <span className="font-medium text-slate-800">{val}</span>
          <span className="font-mono text-[10px] text-slate-500 block">Challan: {row.challanNumber}</span>
        </div>
      ),
    },
    {
      header: 'Category & Qty',
      key: 'itemCategory',
      render: (val, row) => (
        <span className="font-semibold text-slate-900 text-xs">
          {row.receivedQuantity} Units ({val})
        </span>
      ),
    },
    {
      header: 'Serials Logged',
      key: 'serialNumbers',
      render: (val) => (
        <span className="font-mono text-xs text-[#163A5F] font-bold">
          {val ? val.length : 0} Serials
        </span>
      ),
    },
    {
      header: 'Date',
      key: 'deliveryDate',
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
          <h1 className="text-xl font-bold text-slate-900">Direct-to-Site Goods Receipt Notes (GRN)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record rooftop material deliveries, capture challan proof photos, and scan serialized panels & inverters.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Create Site GRN
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={grns}
        searchPlaceholder="Search GRN by number, project ID, challan..."
        searchKeys={['grnNumber', 'projectId', 'poNumber', 'challanNumber', 'vendorName']}
        onRowClick={(row) => setSelectedGRN(row)}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => setSelectedGRN(row)}
          >
            Serials
          </Button>
        )}
      />

      {/* CREATE SITE GRN MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Direct-to-Site Goods Receipt Note (GRN)"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Validation Block:</span>
                <p className="mt-0.5 text-[11px]">{errorMsg}</p>
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg">
            <span className="font-semibold block mb-0.5">Regulatory Integrity Rule:</span>
            <p className="text-[11px] leading-relaxed">
              Completing Site GRN unlocks <strong>Milestone 2 (Mounting Structure Installation)</strong>. Serial numbers are validated against the master database to guarantee system-wide uniqueness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Purchase Order *</label>
              <select
                value={formData.poId}
                onChange={(e) => setFormData({ ...formData, poId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono"
              >
                {pos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.poNumber} — {p.projectId} ({p.vendorName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Challan Number *</label>
              <input
                type="text"
                required
                value={formData.challanNumber}
                onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
                placeholder="e.g. CH-26-9012"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivered Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.receivedQuantity}
                onChange={(e) => setFormData({ ...formData, receivedQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Date *</label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Mandatory Challan Photo */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Vendor Signed Delivery Challan Photo Proof (Mandatory)
            </label>
            <ProofPhotoUpload
              label="Delivery Challan Document"
              required={true}
              onPhotoSelect={(f) => setChallanPhoto(f)}
            />
          </div>

          {/* Barcode & Serial Number Scanner Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-[#163A5F]" />
                Serialized Equipment Barcode List (1 per line) *
              </label>
              <span className="text-[10px] text-slate-400">Enforces system-wide uniqueness</span>
            </div>
            <textarea
              rows={4}
              required
              value={formData.serialNumbersText}
              onChange={(e) => setFormData({ ...formData, serialNumbersText: e.target.value })}
              placeholder="Paste or scan barcodes:&#10;TP-MOD-26-00101&#10;TP-MOD-26-00102"
              className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-xs"
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
              Verify Serials & Confirm GRN
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW SERIALS MODAL */}
      {selectedGRN && (
        <Modal
          isOpen={!!selectedGRN}
          onClose={() => setSelectedGRN(null)}
          title={`GRN Details: ${selectedGRN.grnNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Project:</span>
                <span className="font-mono text-[#163A5F]">{selectedGRN.projectId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vendor:</span>
                <span>{selectedGRN.vendorName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Challan Ref:</span>
                <span className="font-mono">{selectedGRN.challanNumber}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1.5">
                Captured Serial Numbers ({selectedGRN.serialNumbers?.length || 0})
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {selectedGRN.serialNumbers?.map((s, idx) => (
                  <div key={idx} className="font-mono text-[11px] text-slate-800 py-0.5 border-b border-slate-100 last:border-0 flex items-center justify-between">
                    <span>{s}</span>
                    <span className="text-emerald-600 font-semibold text-[9px]">Unique ✓</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGRN(null)}
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
