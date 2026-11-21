import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, Truck, MapPin, Eye, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatINR } from '../../utils/formatters';

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const { pos, addPO, vendors, projects, thresholds } = useERP();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: projects[0]?.projectId || 'PRJ-26-0001',
    vendorId: vendors[0]?.id || 'v-1',
    itemCategory: 'Solar PV Modules',
    specification: '545 Wp Bifacial Mono PERC (DCR)',
    quantity: 20,
    unit: 'Nos',
    rate: 9800,
    gstPct: 12,
  });

  const selectedProject = projects.find((p) => p.projectId === formData.projectId);
  const selectedVendor = vendors.find((v) => v.id === formData.vendorId);

  const subtotal = formData.quantity * formData.rate;
  const totalAmount = subtotal * (1 + formData.gstPct / 100);
  const exceedsThreshold = totalAmount > (thresholds.poApprovalLimit || 200000);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const created = addPO({
        projectId: formData.projectId,
        vendorId: formData.vendorId,
        vendorName: selectedVendor?.name || 'Vendor',
        items: [
          {
            itemCategory: formData.itemCategory,
            specification: formData.specification,
            quantity: Number(formData.quantity),
            unit: formData.unit,
            rate: Number(formData.rate),
          },
        ],
        totalAmount,
        shippingAddress: selectedProject?.siteAddress || 'Customer Rooftop Site, Jaipur',
      });

      if (exceedsThreshold) {
        alert(`Purchase Order ${created.poNumber} created and routed to Approvals Queue because value (₹${totalAmount.toLocaleString('en-IN')}) exceeds ₹${thresholds.poApprovalLimit.toLocaleString('en-IN')} limit.`);
      } else {
        alert(`Purchase Order ${created.poNumber} issued successfully!`);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create PO.');
    }
  };

  const columns = [
    {
      header: 'PO Number',
      key: 'poNumber',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Project & Site Ship-To',
      key: 'projectId',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-semibold text-slate-800">{val}</span>
          <span className="text-[11px] text-slate-500 block truncate max-w-xs flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            {row.shippingAddress || 'Customer Site Rooftop'}
          </span>
        </div>
      ),
    },
    {
      header: 'Vendor Supplier',
      key: 'vendorName',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val}</span>,
    },
    {
      header: 'Total Order Value',
      key: 'totalAmount',
      sortable: true,
      render: (val) => (
        <div>
          <span className="font-bold text-slate-900">{formatINR(val)}</span>
          {val > (thresholds.poApprovalLimit || 200000) && (
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 block mt-0.5">
              &gt; ₹2L Threshold
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Order Date',
      key: 'date',
      sortable: true,
      render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span>,
    },
    {
      header: 'Approval / Status',
      key: 'status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Direct-to-Site Purchase Orders (PO)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero-warehouse fulfillment: Suppliers dispatch materials directly to customer installation sites.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Create Purchase Order
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pos}
        searchPlaceholder="Search POs by number, vendor, project ID..."
        searchKeys={['poNumber', 'vendorName', 'projectId', 'shippingAddress']}
        showExport={true}
        actions={(row) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/procurement/grn')}
          >
            Site GRN
          </Button>
        )}
      />

      {/* Create PO Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue Direct-to-Site Purchase Order"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg">
            <span className="font-semibold block mb-0.5">Direct-to-Site Procurement Model:</span>
            <p className="text-[11px] leading-relaxed">
              Materials will be delivered straight to customer rooftop coordinates. Company warehouse transit is eliminated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Project *</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.projectId}>
                    {p.projectId} — {p.customerName} ({p.systemCapacityKW} kW)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vendor Supplier *</label>
              <select
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Item Category *</label>
              <select
                value={formData.itemCategory}
                onChange={(e) => setFormData({ ...formData, itemCategory: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Solar PV Modules">Solar PV Modules</option>
                <option value="Solar Inverters">Solar Inverters</option>
                <option value="Mounting Structure Iron">Mounting Structure Iron (Pre-fabricated)</option>
                <option value="BOS Cables & Switchgear">BOS Cables & Switchgear</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Item Specification *</label>
              <input
                type="text"
                required
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Unit Rate (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>Total PO Value (Incl GST):</span>
              <span className="text-[#163A5F]">{formatINR(totalAmount)}</span>
            </div>
            {exceedsThreshold && (
              <div className="text-amber-700 font-semibold text-[11px] flex items-center gap-1 pt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Exceeds ₹{thresholds.poApprovalLimit.toLocaleString('en-IN')} limit. Requires Owner / Admin approval.
              </div>
            )}
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
              Issue Purchase Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
