import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Phone, MapPin, Calendar, FileText, ArrowUpRight, MessageSquare, Filter } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateMobile } from '../../utils/validators';

export default function LeadsListPage() {
  const navigate = useNavigate();
  const { leads, addLead } = useERP();

  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // New Lead Form State
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: '',
    source: 'Website Enquiry',
    monthlyElectricityBill: 6500,
    sanctionedLoadKW: 5,
    proposedCapacityKW: 5,
    assignedTo: 'Rahul Verma',
    notes: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const filteredLeads = React.useMemo(() => {
    if (statusFilter === 'ALL') return leads;
    return leads.filter((l) => l.status === statusFilter);
  }, [leads, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim()) {
      setErrorMsg('Customer name is required.');
      return;
    }
    if (!validateMobile(formData.mobile)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      const created = addLead(formData);
      setModalOpen(false);
      // Reset form
      setFormData({
        customerName: '',
        mobile: '',
        email: '',
        city: 'Jaipur',
        state: 'Rajasthan',
        address: '',
        source: 'Website Enquiry',
        monthlyElectricityBill: 6500,
        sanctionedLoadKW: 5,
        proposedCapacityKW: 5,
        assignedTo: 'Rahul Verma',
        notes: '',
      });
      navigate(`/crm/leads/${created.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create lead.');
    }
  };

  const columns = [
    {
      header: 'Lead Code',
      key: 'leadCode',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono font-semibold text-[#163A5F]">
          {val}
        </span>
      ),
    },
    {
      header: 'Customer',
      key: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-medium text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{row.mobile}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      key: 'city',
      sortable: true,
      render: (val, row) => (
        <span className="text-slate-600 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {val}, {row.state}
        </span>
      ),
    },
    {
      header: 'Capacity',
      key: 'proposedCapacityKW',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-800">{val} kW</span>,
    },
    {
      header: 'Source',
      key: 'source',
      sortable: true,
      render: (val) => (
        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
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
    {
      header: 'Assigned To',
      key: 'assignedTo',
      sortable: true,
      render: (val) => <span className="text-slate-600 text-xs">{val}</span>,
    },
    {
      header: 'Created Date',
      key: 'createdAt',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-xs">{val}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lead Directory & Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, qualify, and track solar enquiries from first touch to site survey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/crm/kanban')}
          >
            Kanban View
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setModalOpen(true)}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'New', 'Survey Scheduled', 'Quote Sent', 'Under Negotiation', 'Converted', 'Lost'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              statusFilter === st
                ? 'bg-[#163A5F] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st} {st !== 'ALL' && `(${leads.filter((l) => l.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={filteredLeads}
        searchPlaceholder="Search leads by customer, mobile, city, or ID..."
        searchKeys={['leadCode', 'customerName', 'mobile', 'city']}
        onRowClick={(row) => navigate(`/crm/leads/${row.id}`)}
        showExport={true}
        onExport={() => alert(`Simulated export of ${filteredLeads.length} leads to CSV.`)}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Hello ${row.customerName}, this is Solaris EPC regarding your solar rooftop enquiry for a ${row.proposedCapacityKW} kW system.`
                );
                window.open(`https://wa.me/91${row.mobile}?text=${message}`, '_blank');
              }}
              title="Chat on WhatsApp"
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/crm/leads/${row.id}`)}
              title="View Lead Details"
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add Lead Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Customer Lead"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="e.g. 9829012345"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lead Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-[#163A5F]/20 focus:border-[#163A5F]"
              >
                <option value="Website Enquiry">Website Enquiry</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral / Word of Mouth</option>
                <option value="Cold Call / Field">Cold Call / Field</option>
                <option value="DISCOM Exhibition">DISCOM Exhibition</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                disabled
                value={formData.state}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Monthly Electricity Bill (₹)
              </label>
              <input
                type="number"
                value={formData.monthlyElectricityBill}
                onChange={(e) => setFormData({ ...formData, monthlyElectricityBill: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estimated Capacity (kW)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.proposedCapacityKW}
                onChange={(e) => setFormData({ ...formData, proposedCapacityKW: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Installation Site Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Plot number, Street, Landmark..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
              Save Lead
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
