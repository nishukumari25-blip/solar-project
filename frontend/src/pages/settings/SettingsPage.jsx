import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Users,
  Sliders,
  Hash,
  RotateCcw,
  ShieldCheck,
  Check,
  Save,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function SettingsPage() {
  const { company, setCompany, thresholds, setThresholds, resetDemoData } = useERP();
  const { allUsers } = useAuth();

  const [activeTab, setActiveTab] = useState('company');

  const [companyForm, setCompanyForm] = useState(company);
  const [thresholdForm, setThresholdForm] = useState(thresholds);

  const handleSaveCompany = (e) => {
    e.preventDefault();
    setCompany(companyForm);
    alert('Company master details saved successfully!');
  };

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    setThresholds(thresholdForm);
    alert('Configurable business thresholds updated successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settings, Masters & System Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure company tax registrations, user roles, approval thresholds, and document numbering sequences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        {[
          { id: 'company', label: 'Company Profile & Tax', icon: Building2 },
          { id: 'users', label: 'Users & Roles Matrix', icon: Users },
          { id: 'thresholds', label: 'Approval Thresholds', icon: Sliders },
          { id: 'numbering', label: 'Document Numbering', icon: Hash },
          { id: 'reset', label: 'Prototype State Reset', icon: RotateCcw },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#163A5F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Company Statutory Profile (Jaipur, Rajasthan Hub)
          </h3>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Registered Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN Number (15 Digits) *</label>
                <input
                  type="text"
                  required
                  value={companyForm.gstin}
                  onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Permanent Account Number (PAN) *</label>
                <input
                  type="text"
                  required
                  value={companyForm.pan}
                  onChange={(e) => setCompanyForm({ ...companyForm, pan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CIN / Registration No.</label>
                <input
                  type="text"
                  value={companyForm.cin}
                  onChange={(e) => setCompanyForm({ ...companyForm, cin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Registered Address *</label>
                <textarea
                  rows={2}
                  required
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" variant="primary" size="sm" icon={Save}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: USERS & MULTI-ROLE MATRIX */}
      {activeTab === 'users' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Users & Multi-Role Access Control</h3>
              <p className="text-xs text-slate-400">
                Staff members can hold multiple concurrent roles (e.g. Sales Executive + Survey Engineer).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Staff Member</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Assigned System Roles</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#163A5F] border border-blue-200"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: APPROVAL THRESHOLDS */}
      {activeTab === 'thresholds' && (
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Configurable Governance & Approval Limits</h3>
            <p className="text-xs text-slate-400">
              Set business limits that trigger Owner / Admin approval in the Approvals Queue.
            </p>
          </div>

          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quotation Discount Limit (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={thresholdForm.discountApprovalPct}
                  onChange={(e) => setThresholdForm({ ...thresholdForm, discountApprovalPct: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Discounts exceeding this percentage require Owner approval before release.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Purchase Order Value Approval Limit (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={thresholdForm.poApprovalLimit}
                  onChange={(e) => setThresholdForm({ ...thresholdForm, poApprovalLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  POs exceeding this value require Owner authorization before dispatch.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subsidy Pipeline Stuck Alert Threshold (Days) *
                </label>
                <input
                  type="number"
                  required
                  value={thresholdForm.subsidyAlertDays}
                  onChange={(e) => setThresholdForm({ ...thresholdForm, subsidyAlertDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Applications exceeding this duration in any stage trigger red alerts.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bank Loan Stuck Alert Threshold (Days) *
                </label>
                <input
                  type="number"
                  required
                  value={thresholdForm.loanAlertDays}
                  onChange={(e) => setThresholdForm({ ...thresholdForm, loanAlertDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Loan disbursements delayed beyond this trigger follow-up alerts.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" variant="primary" size="sm" icon={Save}>
                Save Approval Thresholds
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 4: NUMBERING RULES */}
      {activeTab === 'numbering' && (
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Gap-Free Sequential FY Numbering Schemes</h3>
            <p className="text-xs text-slate-400">
              In compliance with Indian commercial audit rules, all documents follow strictly sequential fiscal formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">Projects Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">PRJ-YY-NNNN</span>
              <span className="text-slate-500 text-[11px]">Example: PRJ-26-0001 (Reset annually on 1st April)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">Quotations Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">QT-YY-NNNN-Rn</span>
              <span className="text-slate-500 text-[11px]">Example: QT-26-0001-R1 (Tracks revision index)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">Purchase Orders Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">PO-YY-NNNN</span>
              <span className="text-slate-500 text-[11px]">Example: PO-26-0001 (Sequential procurement)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">Site GRN Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">GRN-YY-NNNN</span>
              <span className="text-slate-500 text-[11px]">Example: GRN-26-0001 (Site rooftop delivery)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">GST Tax Invoice Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">INV/26-27/NNNN</span>
              <span className="text-slate-500 text-[11px]">Example: INV/26-27/0001 (Statutory tax compliance)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-800 block">Payment Receipts Scheme:</span>
              <span className="font-mono text-[#163A5F] font-bold text-sm block">RCT-YY-NNNN</span>
              <span className="text-slate-500 text-[11px]">Example: RCT-26-0001 (Money receipt voucher)</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: RESET STATE */}
      {activeTab === 'reset' && (
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Prototype State Reset & Factory Restore</h3>
            <p className="text-xs text-slate-400">
              Clear local storage modifications and restore the original realistic demo dataset.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-2">
            <span className="font-bold block">Reset Actions Performed:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Restores all 9 sample customer leads across New, Survey, Quote, and Converted states.</li>
              <li>Restores sample projects including PRJ-26-0003 (Delayed case) and PRJ-26-0004 (Closed case).</li>
              <li>Restores 7-step milestones, direct-to-site POs, GRN serials manifest, and P&L statements.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                if (window.confirm('Are you sure you want to restore demo data back to initial factory state?')) {
                  resetDemoData();
                  alert('Prototype state restored to factory defaults!');
                }
              }}
            >
              Restore Factory Initial State
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
