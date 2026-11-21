import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, CheckCircle2, TrendingDown, Clock, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatINR } from '../../utils/formatters';

export default function RFQPage() {
  const navigate = useNavigate();

  const [rfqTitle, setRfqTitle] = useState('RFQ-26-004: 545 Wp DCR Mono PERC Bifacial Modules (Qty: 40 Nos)');

  const quotes = [
    {
      vendor: 'Tata Power Solar Systems',
      baseRatePerWatt: 18.2,
      freightPerWatt: 0.6,
      gstPct: 12,
      landedCostPerWatt: 21.05,
      totalCost: 458900,
      deliveryDays: 5,
      paymentTerms: '20% Advance, 80% on Dispatch',
      warrantyYears: 25,
      almmTier: 'Tier 1 Listed',
      isLowestLanded: false,
    },
    {
      vendor: 'Waaree Energies Ltd',
      baseRatePerWatt: 17.5,
      freightPerWatt: 0.5,
      gstPct: 12,
      landedCostPerWatt: 20.16,
      totalCost: 439500,
      deliveryDays: 4,
      paymentTerms: '100% against Proforma Invoice',
      warrantyYears: 25,
      almmTier: 'Tier 1 Listed',
      isLowestLanded: true, // Recommended Lowest Landed Cost!
    },
    {
      vendor: 'Vikram Solar Ltd',
      baseRatePerWatt: 18.0,
      freightPerWatt: 0.7,
      gstPct: 12,
      landedCostPerWatt: 20.94,
      totalCost: 456500,
      deliveryDays: 7,
      paymentTerms: '30 days LC',
      warrantyYears: 25,
      almmTier: 'Tier 1 Listed',
      isLowestLanded: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">RFQ Multi-Vendor Comparison Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent supplier bid evaluation comparing base rates, freight to customer rooftop, and landed cost.
          </p>
        </div>
      </div>

      {/* Active RFQ Box */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-slate-400">Target Procurement RFQ</span>
          <h3 className="font-bold text-slate-900 text-sm mt-0.5">{rfqTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Shipping Destination: Direct-to-Site (Customer Rooftop, Jaipur)</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-[#163A5F] font-bold text-xs rounded-lg border border-blue-200 self-start sm:self-auto">
          3 Quotations Evaluated
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {quotes.map((q, idx) => (
          <Card
            key={idx}
            className={`p-5 flex flex-col justify-between relative transition-all ${
              q.isLowestLanded
                ? 'border-2 border-emerald-500 shadow-md bg-white'
                : 'border-slate-200 bg-white'
            }`}
          >
            {q.isLowestLanded && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Recommended (Lowest Landed)
              </div>
            )}

            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">{q.vendor}</h3>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {q.almmTier}
                </span>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate / Wp:</span>
                  <span className="font-medium text-slate-900">₹{q.baseRatePerWatt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freight to Site / Wp:</span>
                  <span className="font-medium text-slate-900">₹{q.freightPerWatt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Applicable GST:</span>
                  <span className="font-medium text-slate-900">{q.gstPct}%</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                  <span>Landed Cost / Watt:</span>
                  <span className={q.isLowestLanded ? 'text-emerald-600 text-sm' : 'text-slate-800'}>
                    ₹{q.landedCostPerWatt.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#163A5F] pt-1">
                  <span>Total Order Landed:</span>
                  <span>{formatINR(q.totalCost)}</span>
                </div>
              </div>

              {/* Commercial & Delivery Terms */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Delivery Lead Time:</span>
                  <span className="font-semibold text-slate-800">{q.deliveryDays} Days to Site</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Terms:</span>
                  <span className="font-medium text-slate-700 text-right max-w-[150px] truncate">{q.paymentTerms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Product Warranty:</span>
                  <span className="font-semibold text-slate-800">{q.warrantyYears} Years Performance</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Button
                variant={q.isLowestLanded ? 'primary' : 'ghost'}
                size="sm"
                className="w-full"
                icon={ShoppingBag}
                onClick={() => {
                  alert(`Generating Purchase Order for ${q.vendor} (Direct-to-site dispatch)...`);
                  navigate('/procurement/purchase-orders');
                }}
              >
                Issue Purchase Order
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
