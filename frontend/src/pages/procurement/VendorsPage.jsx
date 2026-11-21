import React, { useState } from 'react';
import { Plus, Building2, Phone, Mail, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateGSTIN, validateMobile } from '../../utils/validators';

export default function VendorsPage() {
  const { vendors, setVendors, addNotification } = useERP();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Solar PV Modules',
    contactPerson: '',
    phone: '',
    email: '',
    city: 'Jaipur',
    gstin: '08AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    isAlmmApproved: true,
    isDcrCompliant: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateGSTIN(formData.gstin)) {
      setErrorMsg('Invalid GSTIN format. Must be 15 characters matching Indian GST specification (e.g. 08AAAAA0000A1Z5).');
      return;
    }

    const nextSeq = vendors.length + 1;
    const newVendor = {
      ...formData,
      id: `v-${Date.now()}`,
      vendorCode: `VND-${String(nextSeq).padStart(3, '0')}`,
      status: 'Active',
      rating: 4.8,
    };

    setVendors((prev) => [newVendor, ...prev]);
    addNotification('Vendor Added', `Vendor ${newVendor.name} (${newVendor.vendorCode}) registered.`, 'procurement', '/procurement/vendors');
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Vendor Code',
      key: 'vendorCode',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-[#163A5F]">{val}</span>,
    },
    {
      header: 'Company Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-[11px] text-slate-500 block">{row.contactPerson}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {val}
        </span>
      ),
    },
    {
      header: 'GSTIN / Location',
      key: 'gstin',
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-mono text-slate-700 font-medium block">{val}</span>
          <span className="text-slate-400 text-[11px]">{row.city}</span>
        </div>
      ),
    },
    {
      header: 'Regulatory Compliance',
      key: 'isAlmmApproved',
      render: (val, row) => (
        <div className="flex items-center gap-1.5 text-[10px]">
          {val && (
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
              ALMM Listed
            </span>
          )}
          {row.isDcrCompliant && (
            <span className="bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.5 rounded border border-blue-200">
              DCR Cells
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Contact',
      key: 'phone',
      render: (val, row) => (
        <div className="text-xs text-slate-600">
          <div>{val}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vendor & Manufacturer Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain verified solar equipment suppliers, ALMM compliance, DCR certifications, and GSTIN master records.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Add New Vendor
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vendors}
        searchPlaceholder="Search vendors by name, GSTIN, code, category..."
        searchKeys={['name', 'gstin', 'vendorCode', 'category', 'city']}
        showExport={true}
      />

      {/* Add Vendor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Vendor / Supplier"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Vendor Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Goldi Solar Pvt Ltd"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Solar PV Modules">Solar PV Modules</option>
                <option value="Solar Inverters">Solar Inverters</option>
                <option value="Mounting Structure Iron">Mounting Structure Iron (Pre-fabricated)</option>
                <option value="BOS & Solar Cables">BOS & Solar Cables</option>
                <option value="Electrical & Earthing">Electrical & Earthing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number (15 Digits) *</label>
              <input
                type="text"
                required
                maxLength={15}
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PAN Number (10 Digits)</label>
              <input
                type="text"
                maxLength={10}
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAlmmApproved}
                onChange={(e) => setFormData({ ...formData, isAlmmApproved: e.target.checked })}
                className="rounded border-slate-300 text-[#163A5F]"
              />
              <span className="font-semibold text-slate-700">MNRE ALMM Enlisted</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDcrCompliant}
                onChange={(e) => setFormData({ ...formData, isDcrCompliant: e.target.checked })}
                className="rounded border-slate-300 text-[#163A5F]"
              />
              <span className="font-semibold text-slate-700">DCR Cell Compliant</span>
            </label>
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
              Save Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
