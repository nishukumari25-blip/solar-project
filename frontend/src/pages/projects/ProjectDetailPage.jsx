import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Camera,
  ShieldAlert,
  Upload,
  Lock,
  ExternalLink,
  Plus,
  Eye,
  MapPin,
  Phone,
  User,
  Zap,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { formatINR, formatDate, formatKW } from '../../utils/formatters';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    projects,
    milestones,
    updateMilestone,
    projectMaterials,
    serials,
    subsidies,
    updateSubsidyStage,
    customerPayments,
    bankLoans,
    receipts,
    recordCustomerPayment,
    projectPnl,
    closeProject,
  } = useERP();

  const { activeRole } = useAuth();

  const [activeTab, setActiveTab] = useState('milestones');
  const [closureModalOpen, setClosureModalOpen] = useState(false);
  const [closureError, setClosureError] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Payment Form State
  const [paymentFormData, setPaymentFormData] = useState({
    amount: 100000,
    paymentMode: 'Bank Transfer / NEFT',
    referenceNumber: 'UTR-SBI-290192',
    notes: 'Milestone payment release',
  });

  const project = projects.find((p) => p.projectId === id || p.id === id);

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800">Project Not Found</h3>
        <p className="text-xs text-slate-400 mt-1">The requested project ID does not exist.</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/projects/all')}
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  // Linked entities
  const projectMilestones = milestones
    .filter((m) => m.projectId === project.projectId)
    .sort((a, b) => a.sequence - b.sequence);

  const materials = projectMaterials.filter((m) => m.projectId === project.projectId);
  const projectSerials = serials.filter((s) => s.projectId === project.projectId);
  const subsidy = subsidies.find((s) => s.projectId === project.projectId);
  const payments = customerPayments.filter((p) => p.projectId === project.projectId);
  const loan = bankLoans.find((l) => l.projectId === project.projectId);
  const projectReceipts = receipts.filter((r) => r.projectId === project.projectId);
  const pnl = projectPnl.find((p) => p.projectId === project.projectId);

  // Triple-lock check helpers
  const isBalanceZero = project.balanceDue === 0;
  const isNetMeteringDone =
    subsidy &&
    (subsidy.currentStage === 'Net Metering Done' ||
      subsidy.currentStage === 'Subsidy Credited to Customer' ||
      subsidy.currentStage === 'Not Applicable');
  const isOwner = activeRole === 'Owner / Admin';
  const canCloseProject = isBalanceZero && isNetMeteringDone && isOwner && project.status !== 'Closed';

  const handleExecuteClosure = () => {
    setClosureError('');
    try {
      closeProject(project.projectId, activeRole);
      setClosureModalOpen(false);
      alert(`Success! Project ${project.projectId} is officially CLOSED. P&L and registers are permanently locked.`);
    } catch (err) {
      setClosureError(err.message);
    }
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    try {
      recordCustomerPayment({
        projectId: project.projectId,
        customerName: project.customerName,
        amount: Number(paymentFormData.amount),
        paymentMode: paymentFormData.paymentMode,
        referenceNumber: paymentFormData.referenceNumber,
        notes: paymentFormData.notes,
      });
      setPaymentModalOpen(false);
      alert('Payment recorded and receipt generated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to record payment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/projects/all')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-[#163A5F]">
                  {project.projectId}
                </span>
                <StatusBadge status={project.status} />
                {project.isDelayed && (
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-[10px] rounded uppercase">
                    Delayed
                  </span>
                )}
                {project.pnlLocked && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded border border-slate-200">
                    <Lock className="w-3 h-3" /> P&L Locked
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5">{project.customerName}</h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="teal"
              size="sm"
              icon={DollarSign}
              onClick={() => setPaymentModalOpen(true)}
            >
              Record Payment
            </Button>

            {project.status !== 'Closed' && (
              <Button
                variant={canCloseProject ? 'primary' : 'ghost'}
                size="sm"
                icon={Lock}
                onClick={() => setClosureModalOpen(true)}
              >
                Project Closure
              </Button>
            )}
          </div>
        </div>

        {/* Project Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">System Capacity</span>
            <span className="font-bold text-amber-600 text-sm">{project.systemCapacityKW} kWp</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Contract Value</span>
            <span className="font-bold text-slate-900 text-sm">{formatINR(project.contractValue)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Collections Received</span>
            <span className="font-bold text-emerald-600 text-sm">{formatINR(project.totalReceived)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Outstanding Dues</span>
            <span className={`font-bold text-sm ${project.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatINR(project.balanceDue)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Payment Mode</span>
            <span className="font-medium text-slate-800">{project.paymentMode}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Subsidy Stage</span>
            <StatusBadge status={project.subsidyStage} />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'milestones', label: '1. Milestones (7-Steps)' },
          { id: 'materials', label: '2. Materials & Serials' },
          { id: 'subsidy', label: '3. Subsidy & DISCOM' },
          { id: 'payments', label: '4. Payments & Loans' },
          { id: 'documents', label: '5. Documents & Proofs' },
          { id: 'pnl', label: '6. Costs & Project P&L' },
          { id: 'overview', label: '7. Site & Team Overview' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#163A5F] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MILESTONES (THE 7 SEQUENTIAL INSTALLATION GATES) */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Strict Milestone Sequence Rules (Phase 1 Regulatory Integrity):</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-800 text-[11px]">
                <li>Milestones must be completed in order. Sequence overrides are prohibited.</li>
                <li><strong>Milestone 2 (Structure Installation)</strong> is blocked until Site GRN is completed.</li>
                <li><strong>Milestone 6 (Testing & Plant Commissioning)</strong> unlocks Work Completion Report (WCR), Final Tax Invoice, and Commissioning Payment.</li>
                <li><strong>Milestone 7 (DISCOM Net Metering)</strong> unlocks Bank Loan Tranche 2 and allows Project Closure.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            {projectMilestones.map((m) => {
              const isCompleted = m.status === 'Completed';
              const isInProgress = m.status === 'In Progress';
              const isPending = m.status === 'Pending';

              return (
                <Card
                  key={m.id}
                  className={`p-4 border-l-4 transition-all ${
                    isCompleted
                      ? 'border-l-emerald-500 bg-white'
                      : isInProgress
                      ? 'border-l-[#163A5F] bg-blue-50/20'
                      : 'border-l-slate-300 bg-slate-50/50 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-[#163A5F] text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.sequence}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                        
                        {m.completedDate && (
                          <div className="text-[11px] text-emerald-700 font-mono mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed on {m.completedDate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Milestone Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {m.photoRequired && (
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          <Camera className="w-3 h-3 text-slate-500" />
                          {m.photoUploaded ? 'Proof Photo Uploaded' : 'Photo Required'}
                        </span>
                      )}

                      {!isCompleted && (
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => {
                            try {
                              updateMilestone(m.id, {
                                status: 'Completed',
                                completedDate: new Date().toISOString().split('T')[0],
                                photoUploaded: true,
                              });
                              alert(`Milestone ${m.sequence}: ${m.name} marked as Completed.`);
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MATERIALS & SERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Direct to site BOM vs Delivery table */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Direct-to-Site BOM vs Dispatched vs GRN Received</h3>
                <p className="text-xs text-slate-400">Zero-warehouse model: All materials shipped directly to customer site address.</p>
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={() => navigate('/procurement/grn')}
              >
                Go to Site GRN
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Item Specification</th>
                    <th className="py-2.5 px-3 text-right">BOM Qty</th>
                    <th className="py-2.5 px-3 text-right">PO Qty</th>
                    <th className="py-2.5 px-3 text-right">GRN Received</th>
                    <th className="py-2.5 px-3 text-right">Variance %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {materials.map((mat) => {
                    const variance = mat.bomQty > 0 ? (((mat.grnQty - mat.bomQty) / mat.bomQty) * 100).toFixed(1) : 0;
                    const isHighVariance = Math.abs(variance) > 5;

                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{mat.category}</td>
                        <td className="py-2.5 px-3 text-slate-600">{mat.specification}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{mat.bomQty} {mat.unit}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{mat.poQty} {mat.unit}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{mat.grnQty} {mat.unit}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`font-semibold ${
                              isHighVariance ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded' : 'text-slate-600'
                            }`}
                          >
                            {variance > 0 ? `+${variance}%` : `${variance}%`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={mat.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Serial Numbers Table */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Mandatory Serial Numbers Manifest (ALMM / Warranty Tracking)</h3>
                <p className="text-xs text-slate-400">Captured at site GRN and guaranteed unique across all projects.</p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#163A5F] bg-blue-50 px-2 py-0.5 rounded">
                {projectSerials.length} Serialized Units
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {projectSerials.map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{s.itemType}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      Verified
                    </span>
                  </div>
                  <div className="font-mono text-slate-900 font-semibold">{s.serialNumber}</div>
                  <div className="text-[10px] text-slate-400">GRN Ref: {s.grnNumber}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SUBSIDY & DISCOM */}
      {activeTab === 'subsidy' && (
        <div className="space-y-6">
          {subsidy ? (
            <div className="space-y-4">
              {/* Subsidy Stage Alert if stuck */}
              {subsidy.daysInStage >= 45 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Subsidy Pipeline Delay Alert (≥ 45 Days):</span>
                    <p className="mt-0.5">
                      This application has been in "{subsidy.currentStage}" for {subsidy.daysInStage} days. Management escalation required to prevent customer dissatisfaction.
                    </p>
                  </div>
                </div>
              )}

              {/* Subsidy Info Card */}
              <Card className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      Application Ref: {subsidy.applicationNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">PM Surya Ghar Muft Bijli Yojana</h3>
                    <p className="text-xs text-slate-500">Consumer CA Number: {subsidy.consumerNumber || '102938472910'}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={subsidy.currentStage} />
                    <span className="text-[11px] text-slate-400 block font-mono mt-1">
                      {subsidy.daysInStage} days in current stage
                    </span>
                  </div>
                </div>

                {/* 7 Subsidy Stages Stepper */}
                <div className="space-y-3">
                  <span className="font-semibold text-slate-700 block text-xs">National Portal 7-Stage Pipeline</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {[
                      'Application Registered',
                      'Feasibility Approved',
                      'Installation Uploaded',
                      'DISCOM Inspection',
                      'Net Metering Done',
                      'Subsidy Claim Submitted',
                      'Subsidy Credited to Customer',
                    ].map((st, i) => {
                      const isCurrent = subsidy.currentStage === st;
                      return (
                        <div
                          key={st}
                          onClick={() => updateSubsidyStage(subsidy.id, st)}
                          className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#163A5F] text-white border-[#163A5F] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-[10px] font-bold opacity-75">Stage {i + 1}</span>
                          <span className="text-[11px] font-semibold leading-tight block mt-0.5">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                  <span className="font-bold">Government Subsidy Accounting Rule:</span>
                  <p className="mt-0.5 text-[11px]">
                    The ₹{subsidy.approvedAmount?.toLocaleString('en-IN') || '78,000'} subsidy will be credited directly to the customer's personal bank account by DBT. It is never remitted to Solaris EPC and is independent of project closure dues.
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center text-slate-400 text-xs">
              No government subsidy record created for this project.
            </Card>
          )}
        </div>
      )}

      {/* TAB 4: PAYMENTS & LOANS */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Financial summary tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-[#163A5F]">
              <span className="text-xs text-slate-400">Total Contract Value</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(project.contractValue)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-xs text-slate-400">Total Received to Date</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(project.totalReceived)}</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-xs text-slate-400">Net Outstanding Balance</span>
              <div className={`text-xl font-bold mt-1 ${project.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {formatINR(project.balanceDue)}
              </div>
            </Card>
          </div>

          {/* Bank Loan 2-Tranches Section if loan mode */}
          {loan && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Solar Bank Loan Disbursement (2-Tranches)</h3>
                  <p className="text-xs text-slate-400">Financier: {loan.bankName} | Sanction Ref: {loan.sanctionRef}</p>
                </div>
                <StatusBadge status={loan.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Tranche 1: Advance on Sanction</span>
                    <span className="text-emerald-700 font-semibold">{formatINR(loan.tranche1Amount)}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Disbursed upon loan sanction and customer agreement.</p>
                  <StatusBadge status={loan.tranche1Status} />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Tranche 2: Post Net-Metering</span>
                    <span className="text-emerald-700 font-semibold">{formatINR(loan.tranche2Amount)}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Disbursed only after WCR and DISCOM Net Metering synchronization.</p>
                  <StatusBadge status={loan.tranche2Status} />
                </div>
              </div>
            </Card>
          )}

          {/* Payment Receipts History */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Issued Payment Receipts</h3>
              <Button
                variant="teal"
                size="xs"
                icon={Plus}
                onClick={() => setPaymentModalOpen(true)}
              >
                Record Payment
              </Button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {projectReceipts.map((r) => (
                <div key={r.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#163A5F] mr-2">{r.receiptNumber}</span>
                    <span className="text-slate-600">{r.paymentMode} ({r.referenceNumber})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600">{formatINR(r.amount)}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{r.date}</span>
                  </div>
                </div>
              ))}

              {projectReceipts.length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">No receipts issued yet.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: DOCUMENTS & PROOFS */}
      {activeTab === 'documents' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">Project Document Repository & Proof Uploads</h3>
            <Button
              variant="ghost"
              size="xs"
              icon={Upload}
              onClick={() => alert('Simulated document upload modal.')}
            >
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { name: 'Customer Aadhaar & PAN Card', category: 'KYC', verified: true },
              { name: 'Latest DISCOM Electricity Bill', category: 'Utility', verified: true },
              { name: 'Geotagged Rooftop Survey Report', category: 'Survey', verified: true },
              { name: 'Structure Stability Engineering Certificate', category: 'Civil', verified: true },
              { name: 'Work Completion Report (WCR)', category: 'Commissioning', verified: project.status === 'Closed' },
              { name: 'DISCOM Net Metering Sync Agreement', category: 'DISCOM', verified: project.status === 'Closed' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">{doc.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{doc.category} Document</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {doc.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 6: COSTS & PROJECT P&L */}
      {activeTab === 'pnl' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Real-Time Project Costing & P&L Statement</h3>
              <p className="text-xs text-slate-400">
                Gross margin tracking across materials, civil installation, logistics, and overheads.
              </p>
            </div>
            {project.pnlLocked && (
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                P&L Statement Locked
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm border-b border-slate-200 pb-1">
                Income & Contract Price
              </span>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Contract Value:</span>
                <span className="font-bold text-slate-900">{formatINR(project.contractValue)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Total Billed to Customer:</span>
                <span className="font-medium text-slate-800">{formatINR(project.contractValue)}</span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block text-sm border-b border-slate-200 pb-1">
                Cost of Goods Sold (COGS)
              </span>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Solar Modules & Inverter:</span>
                <span className="font-medium text-slate-900">{formatINR(pnl?.moduleCost || project.contractValue * 0.55)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Mounting Structure Iron:</span>
                <span className="font-medium text-slate-900">{formatINR(pnl?.structureCost || 32000)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">BOS, Cables & Electrical:</span>
                <span className="font-medium text-slate-900">{formatINR(pnl?.bosCost || 26000)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Civil & Electrical Labor:</span>
                <span className="font-medium text-slate-900">{formatINR(pnl?.laborCost || 22000)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#163A5F]">
                <span>Project Gross Profit:</span>
                <span>{formatINR(pnl?.grossProfit || project.contractValue * 0.22)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Gross Margin Percentage:</span>
                <span>{pnl?.grossMarginPct || '22.4'}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 7: OVERVIEW & TEAM */}
      {activeTab === 'overview' && (
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
            Site Location & Project Team
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-slate-700 block">Site Information</span>
              <p className="text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {project.siteAddress}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                +91 {project.mobile}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-700 block">Assigned Project Manager</span>
              <p className="text-slate-800 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#163A5F]" />
                {project.managerName}
              </p>
              <p className="text-slate-500">Target Date: {project.targetDate || '2026-04-15'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* MODAL: PROJECT CLOSURE TRIPLE-LOCK */}
      {closureModalOpen && (
        <Modal
          isOpen={closureModalOpen}
          onClose={() => setClosureModalOpen(false)}
          title={`Formal Project Closure Approval: ${project.projectId}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Triple-Lock Closure Verification:</span>
              
              {/* Lock 1: Zero Dues */}
              <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-700">1. Customer & Bank Receivables = ₹0.00:</span>
                <span className={`font-bold ${isBalanceZero ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isBalanceZero ? '✓ Cleared (₹0.00)' : `✗ Pending (₹${project.balanceDue.toLocaleString('en-IN')})`}
                </span>
              </div>

              {/* Lock 2: Net Metering */}
              <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-700">2. DISCOM Net Metering Completed:</span>
                <span className={`font-bold ${isNetMeteringDone ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isNetMeteringDone ? '✓ Completed' : `✗ Pending (${subsidy?.currentStage || 'Not Done'})`}
                </span>
              </div>

              {/* Lock 3: Owner Role */}
              <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-700">3. Owner / Admin Final Authorization:</span>
                <span className={`font-bold ${isOwner ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isOwner ? `✓ Authorized (${activeRole})` : `✗ Insufficient Role (${activeRole})`}
                </span>
              </div>
            </div>

            {closureError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
                {closureError}
              </div>
            )}

            {!canCloseProject && (
              <p className="text-rose-600 text-[11px] font-medium">
                Closure is blocked until all 3 conditions are satisfied. Clear outstanding customer dues and ensure DISCOM Net Metering is completed.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setClosureModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!canCloseProject}
                onClick={handleExecuteClosure}
              >
                Approve Final Project Closure
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: RECORD CUSTOMER PAYMENT */}
      {paymentModalOpen && (
        <Modal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          title={`Record Customer Payment: ${project.projectId}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Outstanding Balance Due: <span className="text-amber-600 font-bold">{formatINR(project.balanceDue)}</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={project.balanceDue > 0 ? project.balanceDue : undefined}
                value={paymentFormData.amount}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Channel *
              </label>
              <select
                value={paymentFormData.paymentMode}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                <option value="UPI / QR Code">UPI / QR Code</option>
                <option value="Cheque / DD">Cheque / Demand Draft</option>
                <option value="Bank Loan Direct Disbursement">Bank Loan Direct Disbursement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                UTR / Reference / Cheque Number *
              </label>
              <input
                type="text"
                required
                value={paymentFormData.referenceNumber}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, referenceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPaymentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Issue Receipt & Update Balance
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
