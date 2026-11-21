import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Trash2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Sun,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatINR } from '../../utils/formatters';
import { validateInstalmentsTotal, validateNetCustomerCost } from '../../utils/validators';

export default function QuotationBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get('leadId');
  const surveyIdParam = searchParams.get('surveyId');

  const { leads, surveys, addQuotation, thresholds } = useERP();

  const [customerName, setCustomerName] = useState('');
  const [leadId, setLeadId] = useState(leadIdParam || '');
  const [systemCapacityKW, setSystemCapacityKW] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Line Items
  const [items, setItems] = useState([
    {
      id: 1,
      category: 'Solar PV Modules',
      specification: 'Mono PERC 545 Wp TopCon Bifacial (DCR)',
      quantity: 10,
      unit: 'Nos',
      rate: 9800,
      gstRate: 12,
    },
    {
      id: 2,
      category: 'Solar On-Grid Inverter',
      specification: '5 kW 3-Phase Dual MPPT On-Grid',
      quantity: 1,
      unit: 'Nos',
      rate: 42000,
      gstRate: 12,
    },
    {
      id: 3,
      category: 'Mounting Structure',
      specification: 'Galvanized Hot-Dip Iron (Pre-fabricated, direct-to-site)',
      quantity: 1,
      unit: 'Set',
      rate: 32000,
      gstRate: 18,
    },
    {
      id: 4,
      category: 'Balance of System & Cables',
      specification: 'ACDB, DCDB, Solar DC Copper Cable 4 sq mm & Earthing Kit',
      quantity: 1,
      unit: 'Lot',
      rate: 26000,
      gstRate: 18,
    },
    {
      id: 5,
      category: 'Installation & Testing',
      specification: 'Civil foundation, module mounting, cabling & commissioning',
      quantity: 1,
      unit: 'Job',
      rate: 22000,
      gstRate: 18,
    },
  ]);

  // Instalment Schedule
  const [instalments, setInstalments] = useState([
    { milestoneNumber: 1, label: 'Order Confirmation & Advance', percentage: 20, amount: 0 },
    { milestoneNumber: 2, label: 'Delivery of Materials to Site', percentage: 70, amount: 0 },
    { milestoneNumber: 3, label: 'Testing & Commissioning Sign-off', percentage: 10, amount: 0 },
  ]);

  // Prefill customer from lead or survey
  useEffect(() => {
    if (leadIdParam) {
      const match = leads.find((l) => l.id === leadIdParam);
      if (match) {
        setCustomerName(match.customerName);
        setSystemCapacityKW(match.proposedCapacityKW || 5);
      }
    } else if (surveyIdParam) {
      const match = surveys.find((s) => s.id === surveyIdParam);
      if (match) {
        setCustomerName(match.customerName);
      }
    }
  }, [leadIdParam, surveyIdParam, leads, surveys]);

  // Financial Calculations
  const baseSubtotal = items.reduce((acc, it) => acc + (it.quantity * it.rate), 0);
  const totalGST = items.reduce((acc, it) => acc + (it.quantity * it.rate * (it.gstRate / 100)), 0);
  const grossTotal = baseSubtotal + totalGST;
  const grandTotal = Math.max(0, grossTotal - Number(discountAmount || 0));

  // Central Subsidy PM Surya Ghar
  let totalSubsidy = 0;
  if (systemCapacityKW <= 1) totalSubsidy = 30000;
  else if (systemCapacityKW <= 2) totalSubsidy = 60000;
  else totalSubsidy = 78000;

  const netCustomerCost = Math.max(0, grandTotal - totalSubsidy);

  // Recalculate instalment amounts whenever grandTotal changes
  useEffect(() => {
    setInstalments((prev) =>
      prev.map((inst) => ({
        ...inst,
        amount: Math.round(grandTotal * (inst.percentage / 100)),
      }))
    );
  }, [grandTotal]);

  // Discount percentage check
  const discountPct = (Number(discountAmount || 0) / (grossTotal || 1)) * 100;
  const isHighDiscount = discountPct > (thresholds.discountApprovalPct || 5);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        category: 'Additional Component',
        specification: 'Standard Specification',
        quantity: 1,
        unit: 'Nos',
        rate: 5000,
        gstRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInstalmentPctChange = (index, newPct) => {
    setInstalments((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        percentage: Number(newPct),
        amount: Math.round(grandTotal * (Number(newPct) / 100)),
      };
      return copy;
    });
  };

  const totalInstalmentPct = instalments.reduce((acc, i) => acc + Number(i.percentage || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter customer name.');
      return;
    }
    if (totalInstalmentPct !== 100) {
      alert(`Instalment percentages must total exactly 100%. Current sum: ${totalInstalmentPct}%`);
      return;
    }

    try {
      const newQuote = addQuotation({
        customerName,
        leadId: leadId || null,
        systemCapacityKW: Number(systemCapacityKW),
        items,
        basePrice: baseSubtotal,
        gstAmount: totalGST,
        discountAmount: Number(discountAmount || 0),
        grandTotal,
        totalSubsidy,
        netCustomerCost,
        instalments,
      });

      if (isHighDiscount) {
        alert(`Quotation ${newQuote.quoteNumber} created and routed to Approvals Queue because discount of ${discountPct.toFixed(1)}% exceeds the ${thresholds.discountApprovalPct}% threshold.`);
      } else {
        alert(`Quotation ${newQuote.quoteNumber} created successfully!`);
      }
      navigate('/sales/quotations');
    } catch (err) {
      alert(err.message || 'Failed to create quotation.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/sales/quotations')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotations</span>
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Quotation & Proposal Builder</h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate accurate solar EPC cost estimates with line-item BOM pricing, GST calculations, subsidy transparency, and milestone schedules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Sizing */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sun className="w-4 h-4 text-[#163A5F]" />
            <h3 className="font-bold text-slate-800 text-sm">1. Customer & Capacity Sizing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Existing Lead (Optional)
              </label>
              <select
                value={leadId}
                onChange={(e) => {
                  const selId = e.target.value;
                  setLeadId(selId);
                  const match = leads.find((l) => l.id === selId);
                  if (match) {
                    setCustomerName(match.customerName);
                    setSystemCapacityKW(match.proposedCapacityKW || 5);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="">-- Manual Entry --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.leadCode} — {l.customerName} ({l.proposedCapacityKW} kW)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anand Mahindra"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                System Capacity (kWp) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={systemCapacityKW}
                onChange={(e) => setSystemCapacityKW(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-[#163A5F]"
              />
            </div>
          </div>
        </Card>

        {/* Line Items Table */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">2. Bill of Materials & Pricing Items</h3>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              icon={Plus}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Specification</th>
                  <th className="py-2 px-2 w-20">Qty</th>
                  <th className="py-2 px-2 w-20">Unit</th>
                  <th className="py-2 px-2 w-28">Rate (₹)</th>
                  <th className="py-2 px-2 w-20">GST %</th>
                  <th className="py-2 px-2 text-right">Amount (₹)</th>
                  <th className="py-2 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const lineTotal = item.quantity * item.rate * (1 + item.gstRate / 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.specification}
                          onChange={(e) => handleItemChange(idx, 'specification', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-semibold"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-500"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-medium"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleItemChange(idx, 'gstRate', Number(e.target.value))}
                          className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs bg-white"
                        >
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-slate-900">
                        {formatINR(lineTotal)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pricing Summary & Approvals Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Discount & Regulatory Approvals
            </h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discount Given (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-rose-600 font-semibold"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Current Discount: {discountPct.toFixed(1)}% (Company Policy Threshold: {thresholds.discountApprovalPct}%)
                </span>
              </div>

              {isHighDiscount && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Approval Triggered:</span>
                    <p className="text-[11px] mt-0.5">
                      Because discount exceeds {thresholds.discountApprovalPct}%, this quotation will be locked in "Pending Approval" state until an Owner / Admin approves it in the Approvals Queue.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Financial Summary Breakdown
            </h3>

            <div className="flex justify-between py-1 text-slate-600">
              <span>Base Subtotal:</span>
              <span className="font-medium text-slate-900">{formatINR(baseSubtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Applicable GST:</span>
              <span className="font-medium text-slate-900">{formatINR(totalGST)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between py-1 text-rose-600">
                <span>Discount:</span>
                <span className="font-medium">- {formatINR(discountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#163A5F]">
              <span>Company Invoice Contract Value:</span>
              <span>{formatINR(grandTotal)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 text-emerald-800 bg-emerald-50/60 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between font-bold">
                <span>Direct PM Surya Ghar Subsidy:</span>
                <span>{formatINR(totalSubsidy)}</span>
              </div>
              <p className="text-[10px] text-emerald-700">
                Credited directly to customer bank account post-commissioning and Net Metering.
              </p>
              <div className="pt-1 border-t border-emerald-200 flex justify-between font-bold text-slate-900">
                <span>Effective Net Investment:</span>
                <span className="text-emerald-700 text-sm">{formatINR(netCustomerCost)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Milestone Instalments Section */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">3. Payment Milestone Schedule (Must Total 100%)</h3>
              <p className="text-xs text-slate-400">Enforce contract balancing across order stages.</p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                totalInstalmentPct === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              Total: {totalInstalmentPct}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {instalments.map((inst, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="font-semibold text-slate-800 block text-[11px]">
                  Stage {inst.milestoneNumber}: {inst.label}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inst.percentage}
                    onChange={(e) => handleInstalmentPctChange(idx, e.target.value)}
                    className="w-20 px-2 py-1 border border-slate-200 rounded bg-white font-bold"
                  />
                  <span className="font-semibold text-slate-600">%</span>
                </div>
                <div className="text-right font-mono font-semibold text-slate-900 text-xs">
                  {formatINR(inst.amount)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/sales/quotations')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            icon={Send}
          >
            {isHighDiscount ? 'Submit for Owner Approval' : 'Save & Issue Quotation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
